import { supabase } from "../lib/supabaseClient";

const normalizeIdentity = (response) => ({
  status: response.matched ? "match" : "no_match",
  ref: response.ref,
  respondedAt: response.completedAt,
  durationMs: response.durationMs,
  fields: response.result?.fields ?? [],
});

const normalizePhone = (response) => ({
  status: response.matched ? "match" : "no_match",
  ref: response.ref,
  respondedAt: response.completedAt,
  durationMs: response.durationMs,
  fields: [
    {
      label: "Mobile Number",
      value: response.result?.mobileNumber ?? "—",
    },
    {
      label: "Verification Outcome",
      value: response.matched ? "Matched" : "Not matched",
    },
  ],
});

const normalizeBusiness = (response) => {
  const result = response.result ?? {};
  const fields = [
    { label: "Business Name", value: result.businessName ?? "—" },
    { label: "Status", value: result.status ?? "—" },
    { label: "Registration Date", value: result.registrationDate ?? "—" },
    { label: "Physical Address", value: result.physicalAddress ?? "—" },
    { label: "Postal Address", value: result.postalAddress ?? "—" },
  ];

  (result.beneficialOwners ?? []).forEach((owner, index) => {
    fields.push({
      label: `Beneficial Owner ${index + 1}`,
      value: `${owner.name} — ${owner.role} (${owner.ownershipPercentage}% via ${owner.idType} ${owner.idNumber})`,
    });
  });

  return {
    status: response.matched ? "match" : "no_match",
    ref: response.ref,
    respondedAt: response.completedAt,
    durationMs: response.durationMs,
    fields,
  };
};

const NORMALIZERS = {
  identity: normalizeIdentity,
  phone: normalizePhone,
  business: normalizeBusiness,
};

export async function verifyWithXobriq(type, fields) {
  const { data, error } = await supabase.functions.invoke("kyc-verify", {
    body: { type, ...fields },
  });

  if (error) throw error;
  if (data?.errorMessage) throw new Error(data.errorMessage);

  return NORMALIZERS[type](data);
}

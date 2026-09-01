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

const normalizeCreditScore = (response) => {
  const result = response.result ?? {};
  const profile = result.profile ?? {};

  return {
    hasCreditHistory: Boolean(response.hasCreditHistory),
    grade: result.grade ?? null,
    score: result.score ?? null,
    rawScore: result.rawScore ?? null,
    scoreTrend: result.scoreTrend ?? null,
    reasons: result.reasons ?? [],
    profile: {
      fullName: profile.fullName ?? null,
      idNumber: profile.idNumber ?? null,
      dateOfBirthOrRegistration: profile.dateOfBirthOrRegistration ?? null,
      gender: profile.gender ?? null,
      maritalStatus: profile.maritalStatus ?? null,
      employerName: profile.employerName ?? null,
      phone: profile.phone ?? null,
      email: profile.email ?? null,
      address: profile.address ?? null,
    },
    summary: result.summary ?? {},
    scoreHistory: result.scoreHistory ?? [],
    contracts: result.contracts ?? [],
    providerSuccess: result.providerSuccess ?? null,
    providerMessage: result.providerMessage ?? null,
    ref: response.ref,
    respondedAt: response.completedAt,
    durationMs: response.durationMs,
  };
};

const NORMALIZERS = {
  identity: normalizeIdentity,
  phone: normalizePhone,
  business: normalizeBusiness,
  credit_score: normalizeCreditScore,
};

export async function verifyWithXobriq(type, fields) {
  const { data, error } = await supabase.functions.invoke("kyc-verify", {
    body: { type, ...fields },
  });

  if (error) throw error;
  if (data?.errorMessage) throw new Error(data.errorMessage);

  return NORMALIZERS[type](data);
}

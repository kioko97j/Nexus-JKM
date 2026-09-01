export const VERIFICATION_TYPES = [
  { id: "identity", label: "Identity" },
  { id: "phone", label: "Phone" },
  { id: "business", label: "Business (KYB)" },
];

export const DOCUMENT_TYPES = [
  { id: "national_id", label: "National ID", helper: "8-digit National ID number as printed on the ID card." },
  { id: "alien_id", label: "Alien ID", helper: "Alien ID number as printed on the card." },
  { id: "kra_pin", label: "KRA PIN", helper: "KRA PIN certificate number, e.g. A012345678Z." },
  { id: "bank", label: "Bank", helper: "Bank account number to verify against the account holder." },
  { id: "driving_license", label: "Driving License", helper: "Driving license number as printed on the card." },
  { id: "plate", label: "Plate", helper: "Vehicle number plate, e.g. KDA 123A." },
  { id: "passport", label: "Passport", helper: "Passport number as printed on the bio-data page.", disabled: true },
];

export const VERIFICATION_COST = {
  identity: 50,
  phone: 30,
  business: 200,
  credit_score: 100,
};

const BANDS = [
  { max: 400, label: "Poor", color: "red" },
  { max: 600, label: "Fair", color: "orange" },
  { max: 750, label: "Good", color: "blue" },
  { max: 900, label: "Excellent", color: "emerald" },
];

const MOCK_LENDERS = ["Equity Bank", "KCB", "M-Shwari", "Branch", "Tala"];

function bandFor(score) {
  return BANDS.find((b) => score <= b.max) ?? BANDS[BANDS.length - 1];
}

function seedFrom(value) {
  return (value || "")
    .split("")
    .reduce((sum, ch) => sum + (Number.isNaN(Number(ch)) ? ch.charCodeAt(0) : Number(ch)), 0);
}

export function simulateCreditScore({ subjectType, idNumber }) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const seed = seedFrom(idNumber);
      const score = 300 + ((seed * 37) % 601);
      const band = bandFor(score);
      const contractCount = 1 + (seed % 3);

      const contracts = Array.from({ length: contractCount }).map((_, i) => ({
        lender: MOCK_LENDERS[(seed + i) % MOCK_LENDERS.length],
        type: i % 2 === 0 ? "Mobile Loan" : "Bank Loan",
        amount: 5000 + ((seed + i * 17) % 20) * 1000,
        status: (seed + i) % 5 === 0 ? "Overdue" : "Performing",
      }));

      const missedPayments = contracts.filter((c) => c.status === "Overdue").length;

      resolve({
        score,
        band: band.label,
        bandColor: band.color,
        subjectType,
        idNumber,
        reportedAt: new Date().toISOString(),
        contracts,
        paymentHistory: {
          onTimeRate: Math.max(60, 100 - missedPayments * 15),
          missedPayments,
          totalAccounts: contracts.length,
        },
      });
    }, 1500);
  });
}

export function deriveDashboardStats(verifications) {
  const total = verifications.length;
  const matchCount = verifications.filter((v) => v.status === "match").length;
  const noMatchCount = verifications.filter((v) => v.status === "no_match").length;
  const pendingCount = verifications.filter((v) => v.status === "pending").length;
  const decided = matchCount + noMatchCount;
  const passRate = decided === 0 ? 0 : Math.round((matchCount / decided) * 1000) / 10;

  const monthBuckets = new Map();
  verifications.forEach((v) => {
    const key = new Date(v.createdAt).toLocaleDateString("en-US", { month: "short", year: "2-digit" });
    if (!monthBuckets.has(key)) monthBuckets.set(key, { month: key, passed: 0, failed: 0, order: new Date(v.createdAt) });
    const bucket = monthBuckets.get(key);
    if (v.status === "match") bucket.passed += 1;
    if (v.status === "no_match") bucket.failed += 1;
  });
  const trend = Array.from(monthBuckets.values())
    .sort((a, b) => a.order - b.order)
    .map(({ month, passed, failed }) => ({ month, passed, failed }));

  const typeCounts = { identity: 0, phone: 0, business: 0, credit_score: 0 };
  verifications.forEach((v) => {
    if (v.type in typeCounts) typeCounts[v.type] += 1;
  });
  const typeBreakdown = Object.entries(typeCounts)
    .filter(([, count]) => count > 0)
    .map(([type, count]) => ({ type, count, percentage: total === 0 ? 0 : Math.round((count / total) * 100) }));

  const docBuckets = new Map();
  verifications.forEach((v) => {
    if (!v.documentType) return;
    if (!docBuckets.has(v.documentType)) docBuckets.set(v.documentType, { volume: 0, matched: 0 });
    const bucket = docBuckets.get(v.documentType);
    bucket.volume += 1;
    if (v.status === "match") bucket.matched += 1;
  });
  const topDocumentTypes = Array.from(docBuckets.entries())
    .map(([documentType, { volume, matched }]) => ({
      documentType,
      volume,
      matchRate: volume === 0 ? 0 : Math.round((matched / volume) * 100),
    }))
    .sort((a, b) => b.volume - a.volume)
    .slice(0, 4);

  return { total, passRate, pendingCount, trend, typeBreakdown, topDocumentTypes };
}

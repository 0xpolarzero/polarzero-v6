export function getPeriod(from: string, to: string | null): string {
  const fromDate = new Date(from);
  const toDate = to ? new Date(to) : new Date();

  if (Number.isNaN(fromDate.getTime())) return "";

  const diffTime = Math.max(0, toDate.getTime() - fromDate.getTime());
  const diffDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  if (diffDays < 30) return `${diffDays} day${diffDays > 1 ? "s" : ""}`;

  const months = Math.max(1, Math.floor(diffDays / 30));
  if (months < 12)
    return `${months} month${months > 1 ? "s" : ""}`.concat(
      diffDays % 30 > 0 && months < 2
        ? ` ${diffDays % 30} day${diffDays % 30 > 1 ? "s" : ""}`
        : "",
    );

  const years = Math.floor(months / 12);
  return `${years} year${years > 1 ? "s" : ""}`.concat(
    months % 12 > 0 ? ` ${months % 12} month${months % 12 > 1 ? "s" : ""}` : "",
  );
}

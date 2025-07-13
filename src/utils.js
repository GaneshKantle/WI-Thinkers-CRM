export function extractInstagramHandle(insta) {
  if (!insta || insta === "-") return "-";
  try {
    const cleaned = insta.trim().toLowerCase();
    const url = new URL(
      cleaned.startsWith("http")
        ? cleaned
        : `https://${cleaned.replace(/^www\./, "")}`
    );
    const parts = url.pathname.split("/").filter(Boolean);
    return parts[0] ? `@${parts[0]}` : "-";
  } catch {
    // Not a URL — treat it as handle
    return insta.startsWith("@")
      ? insta
      : `@${
          insta
            .replace(/^https?:\/\/(www\.)?instagram\.com\//i, "")
            .split("/")[0]
        }`;
  }
}

export function extractInstagramUrl(insta) {
  if (!insta || insta === "-") return null;
  try {
    const cleaned = insta.trim().toLowerCase();
    if (cleaned.startsWith("http")) {
      const url = new URL(cleaned);
      const username = url.pathname.split("/").filter(Boolean)[0];
      return username ? `https://instagram.com/${username}` : null;
    }
    const username = cleaned.replace(/^@/, "").replace(/^www\./, "");
    return `https://instagram.com/${username}`;
  } catch {
    return null;
  }
} 
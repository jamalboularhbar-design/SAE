/**
 * Resolve MySQL connection string from Railway / local env.
 * Railway: DATABASE_URL=${{MySQL.MYSQL_URL}} — only valid inside Railway runtime.
 */
export function resolveDatabaseUrl() {
  const url = process.env.DATABASE_URL ?? process.env.MYSQL_URL;
  if (!url?.trim()) return null;
  if (url.includes("${{")) {
    console.error(
      "Database URL is an unresolved Railway reference (${{MySQL.MYSQL_URL}}). " +
        "Run this script on Railway (railway run) or set DATABASE_URL / MYSQL_URL to the actual mysql:// connection string."
    );
    return null;
  }
  return url.trim();
}

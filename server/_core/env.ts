import { BRAND } from "../brand";

export const ENV = {
  cookieSecret: process.env.JWT_SECRET ?? "dev-secret-change-in-production",
  databaseUrl: process.env.DATABASE_URL ?? process.env.MYSQL_URL ?? "",
  isProduction: process.env.NODE_ENV === "production",

  // Admin credentials
  adminEmail: process.env.ADMIN_EMAIL ?? BRAND.adminEmail,
  adminPassword: process.env.ADMIN_PASSWORD ?? "changeme",

  // Owner openId — fixed to "admin" for standalone deployment
  ownerOpenId: "admin",

  // ── AI / LLM ─────────────────────────────────────────────────────────────
  // Point to any OpenAI-compatible endpoint:
  //   Google AI (Gemini):  https://generativelanguage.googleapis.com/v1beta/openai
  //   OpenAI:              https://api.openai.com/v1
  llmApiUrl: process.env.LLM_API_URL ?? "https://generativelanguage.googleapis.com/v1beta/openai",
  llmApiKey: process.env.LLM_API_KEY ?? "",
  llmModel: process.env.LLM_MODEL ?? "gemini-2.5-flash",

  // ── Image generation ─────────────────────────────────────────────────────
  // Uses OpenAI images API. Set IMAGE_API_KEY to your OpenAI key.
  // If using Google AI for LLM, you can reuse LLM_API_KEY here too.
  imageApiKey: process.env.IMAGE_API_KEY ?? process.env.LLM_API_KEY ?? "",
  imageModel: process.env.IMAGE_MODEL ?? "dall-e-3",

  // ── S3-compatible storage ────────────────────────────────────────────────
  // Works with AWS S3 and Cloudflare R2 (recommended: free 10 GB).
  // Cloudflare R2 endpoint: https://<ACCOUNT_ID>.r2.cloudflarestorage.com
  // AWS S3: leave S3_ENDPOINT empty.
  s3Bucket: process.env.S3_BUCKET ?? "",
  s3Region: process.env.S3_REGION ?? "auto",
  s3AccessKeyId: process.env.S3_ACCESS_KEY_ID ?? "",
  s3SecretAccessKey: process.env.S3_SECRET_ACCESS_KEY ?? "",
  s3Endpoint: process.env.S3_ENDPOINT ?? "",
  // Public base URL for files, e.g. https://pub-abc123.r2.dev or your CDN
  s3PublicUrl: process.env.S3_PUBLIC_URL ?? "",

  // ── Stripe (optional) ────────────────────────────────────────────────────
  stripeSecretKey: process.env.STRIPE_SECRET_KEY ?? "",
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET ?? "",

  // ── Manus platform APIs (optional — legacy hosting integration) ─────────
  forgeApiUrl: process.env.BUILT_IN_FORGE_API_URL ?? "",
  forgeApiKey: process.env.BUILT_IN_FORGE_API_KEY ?? "",
};

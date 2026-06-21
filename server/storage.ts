/**
 * S3-compatible storage helpers (AWS S3 or Cloudflare R2)
 *
 * Replaces the Manus Forge storage proxy.
 *
 * Configure via env vars:
 *   S3_BUCKET          — bucket name
 *   S3_REGION          — e.g. "us-east-1" (AWS) or "auto" (R2)
 *   S3_ACCESS_KEY_ID   — access key
 *   S3_SECRET_ACCESS_KEY — secret key
 *   S3_ENDPOINT        — Cloudflare R2: https://<ACCOUNT_ID>.r2.cloudflarestorage.com
 *                        AWS S3: leave empty
 *   S3_PUBLIC_URL      — public base URL for serving files
 *                        e.g. https://pub-abc123.r2.dev  or  https://files.argbuilder.io
 */

import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { ENV } from "./_core/env";

let _s3: S3Client | null = null;

function getS3Client(): S3Client {
  if (_s3) return _s3;

  if (!ENV.s3Bucket || !ENV.s3AccessKeyId || !ENV.s3SecretAccessKey) {
    throw new Error(
      "Storage not configured. Set S3_BUCKET, S3_ACCESS_KEY_ID, and S3_SECRET_ACCESS_KEY."
    );
  }

  _s3 = new S3Client({
    region: ENV.s3Region || "auto",
    credentials: {
      accessKeyId: ENV.s3AccessKeyId,
      secretAccessKey: ENV.s3SecretAccessKey,
    },
    ...(ENV.s3Endpoint ? { endpoint: ENV.s3Endpoint } : {}),
  });

  return _s3;
}

function normalizeKey(relKey: string): string {
  return relKey.replace(/^\/+/, "");
}

function appendHashSuffix(relKey: string): string {
  const hash = crypto.randomUUID().replace(/-/g, "").slice(0, 8);
  const lastDot = relKey.lastIndexOf(".");
  if (lastDot === -1) return `${relKey}_${hash}`;
  return `${relKey.slice(0, lastDot)}_${hash}${relKey.slice(lastDot)}`;
}

function buildPublicUrl(key: string): string {
  if (ENV.s3PublicUrl) {
    return `${ENV.s3PublicUrl.replace(/\/$/, "")}/${key}`;
  }
  // Fallback: serve through the local proxy route
  return `/storage/${key}`;
}

/**
 * Upload a file to S3/R2.
 * Returns { key, url } where url is the public-facing URL.
 */
export async function storagePut(
  relKey: string,
  data: Buffer | Uint8Array | string,
  contentType = "application/octet-stream"
): Promise<{ key: string; url: string }> {
  const s3 = getS3Client();
  const key = appendHashSuffix(normalizeKey(relKey));

  const body = typeof data === "string" ? Buffer.from(data, "utf-8") : data;

  await s3.send(
    new PutObjectCommand({
      Bucket: ENV.s3Bucket,
      Key: key,
      Body: body,
      ContentType: contentType,
    })
  );

  return { key, url: buildPublicUrl(key) };
}

/**
 * Get the public URL for an existing file.
 */
export async function storageGet(relKey: string): Promise<{ key: string; url: string }> {
  const key = normalizeKey(relKey);
  return { key, url: buildPublicUrl(key) };
}

/**
 * Generate a short-lived signed URL for private file access (1 hour TTL).
 */
export async function storageGetSignedUrl(relKey: string): Promise<string> {
  const s3 = getS3Client();
  const key = normalizeKey(relKey);

  const command = new GetObjectCommand({
    Bucket: ENV.s3Bucket,
    Key: key,
  });

  return getSignedUrl(s3, command, { expiresIn: 3600 });
}

/**
 * Storage proxy route — serves files via signed URL redirect.
 *
 * Replaces the Manus /manus-storage/* proxy.
 * Route: GET /storage/:key  →  307 redirect to signed S3/R2 URL
 *
 * If S3_PUBLIC_URL is set, files are served directly from the CDN/public bucket
 * and this proxy is rarely needed (only for private files).
 */

import type { Express } from "express";
import { storageGetSignedUrl } from "../storage";

export function registerStorageProxy(app: Express) {
  app.get("/storage/*", async (req, res) => {
    const key = (req.params as Record<string, string>)[0];

    if (!key) {
      res.status(400).send("Missing storage key");
      return;
    }

    try {
      const signedUrl = await storageGetSignedUrl(key);
      res.set("Cache-Control", "private, max-age=3600");
      res.redirect(307, signedUrl);
    } catch (err) {
      console.error("[StorageProxy] failed:", err);
      res.status(502).send("Storage error");
    }
  });
}

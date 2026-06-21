/**
 * Image generation — OpenAI Images API (DALL-E 3 or compatible)
 *
 * Replaces the Manus Forge image service.
 *
 * Configure via env vars:
 *   IMAGE_API_KEY  — OpenAI API key (defaults to LLM_API_KEY if not set)
 *   IMAGE_MODEL    — default: dall-e-3
 */

import { storagePut } from "server/storage";
import { ENV } from "./env";

export type GenerateImageOptions = {
  prompt: string;
  originalImages?: Array<{
    url?: string;
    b64Json?: string;
    mimeType?: string;
  }>;
};

export type GenerateImageResponse = {
  url?: string;
};

export async function generateImage(
  options: GenerateImageOptions
): Promise<GenerateImageResponse> {
  if (!ENV.imageApiKey) {
    throw new Error(
      "IMAGE_API_KEY (or LLM_API_KEY) is not configured. Image generation requires an OpenAI API key."
    );
  }

  const response = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${ENV.imageApiKey}`,
    },
    body: JSON.stringify({
      model: ENV.imageModel,
      prompt: options.prompt,
      n: 1,
      size: "1024x1024",
      response_format: "b64_json",
    }),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(
      `Image generation failed (${response.status} ${response.statusText})${detail ? `: ${detail}` : ""}`
    );
  }

  const result = (await response.json()) as {
    data: Array<{ b64_json: string }>;
  };

  const b64 = result.data[0]?.b64_json;
  if (!b64) throw new Error("No image data returned from API");

  const buffer = Buffer.from(b64, "base64");

  const { url } = await storagePut(
    `generated/${Date.now()}.png`,
    buffer,
    "image/png"
  );

  return { url };
}

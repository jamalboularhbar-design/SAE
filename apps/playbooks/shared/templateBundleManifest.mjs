/**
 * Template bundle → docs-seed file patterns for export (read-only source).
 */
import { getCuratedDocs } from "../scripts/notion/curate-docs.mjs";

const GENERAL_EXCLUDE = [/^ARG-Builder-RR-/, /^ARG-Builder-AK-/];

export const BUNDLE_PATTERNS = {
  agency: [
    /Vertical-GTM/i,
    /Agency/i,
    /Multi-Brand/i,
    /Client Success/i,
    /Customer Success/i,
    /Onboarding/i,
    /Marketing Demand/i,
    /Content Marketing/i,
    /Sales/i,
    /SDR/i,
    /Founding Customer/i,
  ],
};

export function resolveBundleDocs(bundleId) {
  const curated = getCuratedDocs();

  if (bundleId === "complete") {
    return curated;
  }

  if (bundleId === "travel-ops") {
    return curated.filter((d) => /RR-|Riad|Routes|Luxury Travel/i.test(d.file));
  }

  if (bundleId === "creative-studio") {
    return curated.filter((d) => /AK-|ArtKech|Creative Studio/i.test(d.file));
  }

  if (bundleId === "starter") {
    const general = curated.filter(
      (d) => !GENERAL_EXCLUDE.some((p) => p.test(d.file))
    );
    return general.slice(0, 50);
  }

  if (bundleId === "agency") {
    const vertical = curated.filter((d) =>
      /^ARG-Builder-(RR|AK)-/.test(d.file)
    );
    const general = curated.filter(
      (d) => !/^ARG-Builder-(RR|AK)-/.test(d.file)
    );
    const combined = [...general, ...vertical.slice(0, 20)];
    const unique = [...new Map(combined.map((d) => [d.id, d])).values()];
    return unique.slice(0, 100);
  }

  return [];
}

export function bundleManifestSummary(bundleId) {
  const docs = resolveBundleDocs(bundleId);
  return {
    bundleId,
    docCount: docs.length,
    files: docs.map((d) => d.id),
  };
}

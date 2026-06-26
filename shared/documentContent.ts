/**
 * Document content normalization — strip legacy Manus footers, prepare for display.
 */

/** Legacy footer appended by Manus AI during doc generation */
const MANUS_FOOTER_PATTERN =
  /\n*---?\n*\n*\*Document prepared by Manus AI[^*]*\*\s*$/i;

/** Alternate Manus footer variants */
const MANUS_FOOTER_ALT =
  /\n*\*?(?:Document )?(?:prepared|generated) by Manus(?: AI)?[^*\n]*\*?\s*$/i;

/**
 * Remove legacy Manus AI attribution footer from markdown content.
 * Safe to call on content that never had a Manus footer.
 */
export function stripManusFooter(content: string): string {
  if (!content) return content;
  return content.replace(MANUS_FOOTER_PATTERN, "").replace(MANUS_FOOTER_ALT, "").trimEnd();
}

/**
 * Prepare document content for display or export.
 */
export function prepareDocumentContent(content: string): string {
  return stripManusFooter(content);
}

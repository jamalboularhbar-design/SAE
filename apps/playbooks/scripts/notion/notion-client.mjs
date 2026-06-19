/**
 * Minimal Notion API client for PPV deployment.
 * @see https://developers.notion.com/reference
 */

const NOTION_VERSION = "2022-06-28";

export function createNotionClient(apiKey) {
  if (!apiKey) throw new Error("NOTION_API_KEY is required");

  async function request(path, options = {}) {
    const res = await fetch(`https://api.notion.com/v1${path}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Notion-Version": NOTION_VERSION,
        "Content-Type": "application/json",
        ...options.headers,
      },
    });
    const body = await res.json();
    if (!res.ok) {
      throw new Error(`Notion API ${res.status}: ${body.message ?? JSON.stringify(body)}`);
    }
    return body;
  }

  return {
    createPage: (data) => request("/pages", { method: "POST", body: JSON.stringify(data) }),
    createDatabase: (data) =>
      request("/databases", { method: "POST", body: JSON.stringify(data) }),
    appendBlocks: (blockId, children) =>
      request(`/blocks/${blockId}/children`, {
        method: "PATCH",
        body: JSON.stringify({ children }),
      }),
    search: (query) =>
      request("/search", {
        method: "POST",
        body: JSON.stringify({ query, page_size: 10 }),
      }),
  };
}

/** Rich text helper */
export function rt(content) {
  return [{ type: "text", text: { content: content.slice(0, 2000) } }];
}

/** Paragraph block */
export function paragraph(text) {
  return { object: "block", type: "paragraph", paragraph: { rich_text: rt(text) } };
}

/** Heading block */
export function heading2(text) {
  return { object: "block", type: "heading_2", heading_2: { rich_text: rt(text) } };
}

/** Bulleted list item */
export function bullet(text) {
  return {
    object: "block",
    type: "bulleted_list_item",
    bulleted_list_item: { rich_text: rt(text) },
  };
}

/** Callout block */
export function callout(text, emoji = "💡") {
  return {
    object: "block",
    type: "callout",
    callout: {
      rich_text: rt(text),
      icon: { type: "emoji", emoji },
    },
  };
}

export function pageUrl(pageId) {
  return `https://notion.so/${pageId.replace(/-/g, "")}`;
}

export function selectProp(name) {
  return { select: { name } };
}

export function titleProp(content) {
  return { title: rt(content) };
}

export function richTextProp(content) {
  return { rich_text: rt(content) };
}

export function numberProp(n) {
  return { number: n };
}

export async function createDatabasePage(notion, databaseId, properties) {
  return notion.createPage({
    parent: { database_id: databaseId },
    properties,
  });
}

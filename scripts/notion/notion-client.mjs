/**
 * Extended Notion API client — upsert sync support.
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
    updatePage: (pageId, data) =>
      request(`/pages/${pageId}`, { method: "PATCH", body: JSON.stringify(data) }),
    createDatabase: (data) =>
      request("/databases", { method: "POST", body: JSON.stringify(data) }),
    queryDatabase: (databaseId, filter = undefined, startCursor = undefined) =>
      request(`/databases/${databaseId}/query`, {
        method: "POST",
        body: JSON.stringify({
          page_size: 100,
          ...(filter ? { filter } : {}),
          ...(startCursor ? { start_cursor: startCursor } : {}),
        }),
      }),
    getBlockChildren: (blockId, startCursor) => {
      const qs = startCursor ? `?start_cursor=${startCursor}` : "";
      return request(`/blocks/${blockId}/children${qs}`);
    },
    appendBlocks: (blockId, children) =>
      request(`/blocks/${blockId}/children`, {
        method: "PATCH",
        body: JSON.stringify({ children }),
      }),
    deleteBlock: (blockId) => request(`/blocks/${blockId}`, { method: "DELETE" }),
    search: (query) =>
      request("/search", {
        method: "POST",
        body: JSON.stringify({ query, page_size: 10 }),
      }),
  };
}

export function rt(content) {
  const text = String(content ?? "");
  if (text.length <= 2000) return [{ type: "text", text: { content: text } }];
  const parts = [];
  for (let i = 0; i < text.length; i += 2000) {
    parts.push({ type: "text", text: { content: text.slice(i, i + 2000) } });
  }
  return parts;
}

export function titleProp(content) {
  return { title: rt(content) };
}

export function richTextProp(content) {
  return { rich_text: rt(content) };
}

export function selectProp(name) {
  return { select: { name } };
}

export function numberProp(n) {
  return { number: n };
}

export function pageUrl(pageId) {
  return `https://notion.so/${pageId.replace(/-/g, "")}`;
}

export function slugify(input) {
  return String(input)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 120);
}

/** Convert markdown to Notion blocks (simple subset, max blocks cap) */
export function markdownToBlocks(markdown, maxBlocks = 80) {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const blocks = [];
  for (const line of lines) {
    if (blocks.length >= maxBlocks) break;
    const trimmed = line.trimEnd();
    if (!trimmed) continue;
    if (trimmed.startsWith("# ")) {
      blocks.push({
        object: "block",
        type: "heading_1",
        heading_1: { rich_text: rt(trimmed.slice(2)) },
      });
    } else if (trimmed.startsWith("## ")) {
      blocks.push({
        object: "block",
        type: "heading_2",
        heading_2: { rich_text: rt(trimmed.slice(3)) },
      });
    } else if (trimmed.startsWith("### ")) {
      blocks.push({
        object: "block",
        type: "heading_3",
        heading_3: { rich_text: rt(trimmed.slice(4)) },
      });
    } else if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      blocks.push({
        object: "block",
        type: "bulleted_list_item",
        bulleted_list_item: { rich_text: rt(trimmed.slice(2)) },
      });
    } else {
      blocks.push({
        object: "block",
        type: "paragraph",
        paragraph: { rich_text: rt(trimmed) },
      });
    }
  }
  if (blocks.length >= maxBlocks) {
    blocks.push({
      object: "block",
      type: "paragraph",
      paragraph: {
        rich_text: rt("… Content truncated for Notion sync. See Source Path in database row for full file in repo."),
      },
    });
  }
  return blocks.length ? blocks : [{ object: "block", type: "paragraph", paragraph: { rich_text: rt("(empty)") } }];
}

export async function clearPageContent(notion, pageId) {
  let cursor;
  do {
    const res = await notion.getBlockChildren(pageId, cursor);
    for (const block of res.results ?? []) {
      if (block.type === "child_page" || block.type === "child_database") continue;
      await notion.deleteBlock(block.id);
      await sleep(120);
    }
    cursor = res.has_more ? res.next_cursor : undefined;
  } while (cursor);
}

export async function replacePageContent(notion, pageId, markdown) {
  await clearPageContent(notion, pageId);
  const blocks = markdownToBlocks(markdown);
  for (let i = 0; i < blocks.length; i += 50) {
    await notion.appendBlocks(pageId, blocks.slice(i, i + 50));
    await sleep(200);
  }
}

export function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

export async function findPageByTitle(notion, databaseId, titleProperty, title) {
  const filter = {
    property: titleProperty,
    title: { equals: title },
  };
  let cursor;
  do {
    const res = await notion.queryDatabase(databaseId, filter, cursor);
    const hit = (res.results ?? []).find((p) => {
      const prop = p.properties?.[titleProperty];
      const t = prop?.title?.[0]?.plain_text ?? "";
      return t === title;
    });
    if (hit) return hit.id;
    cursor = res.has_more ? res.next_cursor : undefined;
  } while (cursor);
  return null;
}

export function paragraph(text) {
  return { object: "block", type: "paragraph", paragraph: { rich_text: rt(text) } };
}

export function heading2(text) {
  return { object: "block", type: "heading_2", heading_2: { rich_text: rt(text) } };
}

export function bullet(text) {
  return {
    object: "block",
    type: "bulleted_list_item",
    bulleted_list_item: { rich_text: rt(text) },
  };
}

export function callout(text, emoji = "💡") {
  return {
    object: "block",
    type: "callout",
    callout: { rich_text: rt(text), icon: { type: "emoji", emoji } },
  };
}

export async function createDatabasePage(notion, databaseId, properties) {
  return notion.createPage({
    parent: { database_id: databaseId },
    properties,
  });
}

export async function upsertDatabaseRow(notion, {
  databaseId,
  titleProperty,
  title,
  properties,
  manifest,
  manifestKey,
  content,
  syncContent = true,
}) {
  let pageId = manifest?.pages?.[manifestKey];
  if (pageId) {
    try {
      await notion.updatePage(pageId, { properties });
      if (content && syncContent) await replacePageContent(notion, pageId, content);
      return { pageId, action: "updated" };
    } catch {
      delete manifest.pages[manifestKey];
    }
  }

  const existing = await findPageByTitle(notion, databaseId, titleProperty, title);
  if (existing) {
    pageId = existing;
    await notion.updatePage(pageId, { properties });
    if (content && syncContent) await replacePageContent(notion, pageId, content);
    if (manifest) manifest.pages[manifestKey] = pageId;
    return { pageId, action: "updated" };
  }

  const page = await notion.createPage({
    parent: { database_id: databaseId },
    properties,
    ...(content ? { children: markdownToBlocks(content, 50) } : {}),
  });
  if (manifest) manifest.pages[manifestKey] = page.id;
  return { pageId: page.id, action: "created" };
}

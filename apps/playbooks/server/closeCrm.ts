/**
 * Close CRM Integration
 * Creates leads in Close CRM when demo requests are submitted.
 * API Docs: https://developer.close.com/api/resources/leads/create
 */

const CLOSE_API_URL = "https://api.close.com/api/v1";

interface CloseLeadInput {
  fullName: string;
  email: string;
  company?: string;
  jobTitle?: string;
  teamSize?: string; // industry vertical
  message?: string;
  source?: string;
}

interface CloseLeadResponse {
  id: string;
  display_name: string;
  status_label: string;
  contacts: Array<{ id: string; name: string }>;
}

/**
 * Create a lead in Close CRM with nested contact.
 * Uses Basic Auth with the API key as username (empty password).
 * Returns the Close lead ID on success, null on failure.
 */
export async function createCloseLead(input: CloseLeadInput): Promise<string | null> {
  const apiKey = process.env.CLOSE_CRM_API_KEY;
  if (!apiKey) {
    console.log("[Close CRM] No API key configured, skipping");
    return null;
  }

  // Map industry vertical to a readable label
  const industryMap: Record<string, string> = {
    hospitality: "Hospitality & Travel",
    healthcare: "Healthcare",
    "professional-services": "Professional Services",
    retail: "Retail & E-Commerce",
    manufacturing: "Manufacturing",
    saas: "SaaS & Technology",
    other: "Other",
  };

  const industry = input.teamSize ? industryMap[input.teamSize] || input.teamSize : undefined;

  // Build the lead payload
  const payload: Record<string, unknown> = {
    name: input.company || `${input.fullName} (Personal)`,
    description: [
      input.message ? `Challenge: ${input.message}` : null,
      industry ? `Industry: ${industry}` : null,
      input.source ? `Source: ${input.source}` : null,
      `Submitted via ARG Builder website`,
    ]
      .filter(Boolean)
      .join("\n"),
    contacts: [
      {
        name: input.fullName,
        title: input.jobTitle || undefined,
        emails: [{ email: input.email, type: "office" }],
      },
    ],
  };

  try {
    // Close uses Basic Auth: API key as username, empty password
    const authHeader = `Basic ${Buffer.from(`${apiKey}:`).toString("base64")}`;

    const response = await fetch(`${CLOSE_API_URL}/lead/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[Close CRM] Failed to create lead (${response.status}):`, errorText);
      return null;
    }

    const data = (await response.json()) as CloseLeadResponse;
    console.log(`[Close CRM] Lead created: ${data.id} (${data.display_name})`);
    return data.id;
  } catch (error) {
    console.error("[Close CRM] Error creating lead:", error);
    return null;
  }
}

// Close CRM Sequence Configuration
const SEQUENCE_ID = "seq_35QZqN40zFJfzmG5AunVU8"; // ARG Builder - Demo Request Nurture
const SENDER_ACCOUNT_ID = "emailacct_KTAg0kk15AycmtzHFGRPyzNsLKG2XcpqCNAiZBDUUr2";
const SENDER_EMAIL = "jamal.boularhbar@gmail.com";
const SENDER_NAME = "Jamal";
const USER_ID = "user_1Kwk81ixoVT20p2b3sZEd5hQW96VwsRkf7cnhN86MMc";

/**
 * Subscribe a contact to the nurture email sequence in Close CRM.
 * Should be called after lead creation to auto-enroll the prospect.
 * Returns the subscription ID on success, null on failure.
 */
export async function subscribeToNurtureSequence(contactId: string, contactEmail: string): Promise<string | null> {
  const apiKey = process.env.CLOSE_CRM_API_KEY;
  if (!apiKey) {
    console.log("[Close CRM] No API key configured, skipping sequence subscription");
    return null;
  }

  try {
    const authHeader = `Basic ${Buffer.from(`${apiKey}:`).toString("base64")}`;
    const payload = {
      sequence_id: SEQUENCE_ID,
      contact_id: contactId,
      contact_email: contactEmail,
      sender_account_id: SENDER_ACCOUNT_ID,
      sender_email: SENDER_EMAIL,
      sender_name: SENDER_NAME,
      calls_assigned_to: [USER_ID],
    };

    const response = await fetch(`${CLOSE_API_URL}/sequence_subscription/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[Close CRM] Failed to subscribe contact to sequence (${response.status}):`, errorText);
      return null;
    }

    const data = (await response.json()) as { id: string };
    console.log(`[Close CRM] Contact ${contactId} subscribed to nurture sequence: ${data.id}`);
    return data.id;
  } catch (error) {
    console.error("[Close CRM] Error subscribing to sequence:", error);
    return null;
  }
}

/**
 * Verify the Close CRM API key is valid by fetching the current user's info.
 * Returns true if the key is valid, false otherwise.
 */
export async function verifyCloseApiKey(): Promise<boolean> {
  const apiKey = process.env.CLOSE_CRM_API_KEY;
  if (!apiKey) return false;

  try {
    const authHeader = `Basic ${Buffer.from(`${apiKey}:`).toString("base64")}`;
    const response = await fetch(`${CLOSE_API_URL}/me/`, {
      headers: { Authorization: authHeader },
    });
    return response.ok;
  } catch {
    return false;
  }
}

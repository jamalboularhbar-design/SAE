/**
 * Auto-loads a user-provided Hub component if `jamal-hub-v2.jsx` exists.
 * Drop the file into this folder and it will be embedded in the Hub panel.
 */
import type { ComponentType } from "react";

export interface HubComponentProps {
  query?: string;
  context?: Record<string, unknown>;
  onAnswer?: (answer: string) => void;
}

const modules = import.meta.glob("./jamal-hub-v2.{jsx,tsx}", { eager: true });

export function getHubComponent(): ComponentType<HubComponentProps> | null {
  const mod = Object.values(modules)[0] as { default?: ComponentType<HubComponentProps> } | undefined;
  return mod?.default ?? null;
}

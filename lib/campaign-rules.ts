/**
 * Group-testing rules: every campaign needs at least MIN_BACKERS pledges to
 * lock in testing, caps out at MAX_BACKERS, and only accepts pledges for
 * FUNDING_WINDOW_HOURS from creation. Janoshik Analytical is the fixed lab.
 */
export const MIN_BACKERS = 4;
export const MAX_BACKERS = 20;
export const FUNDING_WINDOW_HOURS = 48;
export const TESTING_LAB = "Janoshik Analytical";

export type CampaignPhase =
  | "open" // still accepting pledges
  | "full" // hit MAX_BACKERS, moving to testing immediately
  | "advancing" // window expired with enough backers, moving to testing
  | "failed"; // window expired without enough backers

export interface CampaignPhaseInfo {
  phase: CampaignPhase;
  msRemaining: number;
}

export function getCampaignPhase(
  createdAt: string,
  backers: number,
  minimumBackers: number = MIN_BACKERS,
  maxBackers: number = MAX_BACKERS,
  windowHours: number = FUNDING_WINDOW_HOURS
): CampaignPhaseInfo {
  const deadline = new Date(createdAt).getTime() + windowHours * 60 * 60 * 1000;
  const msRemaining = deadline - Date.now();

  if (backers >= maxBackers) {
    return { phase: "full", msRemaining: 0 };
  }
  if (msRemaining > 0) {
    return { phase: "open", msRemaining };
  }
  return { phase: backers >= minimumBackers ? "advancing" : "failed", msRemaining: 0 };
}

export function formatTimeRemaining(ms: number): string {
  if (ms <= 0) return "0h 0m";
  const totalMinutes = Math.floor(ms / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours}h ${minutes}m`;
}

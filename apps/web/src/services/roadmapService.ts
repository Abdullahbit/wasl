import type { CommunityView } from "../data/communities";
import type { ResourceView } from "../data/resources";
import { ahmedProfile } from "../data/demoProfile";
import { whyMap } from "../data/communities";

// Deterministic scoring aligned with docs/recommendation-engine.md
// This mirrors apps/api recommendation.service but client-side for demo fallback.
export function scoreCommunity(profile: typeof ahmedProfile, c: CommunityView): number {
  let s = 0;
  if (c.universities.includes(profile.university) || c.universities.includes("Any")) s += 30;
  if (profile.interests.some((i: string) => c.interests.includes(i))) s += 25;
  if (profile.goals.some((g: string) => (c.targetAudience ?? "").includes(g))) s += 20;
  if (c.languages.includes("English") || (profile.turkishLevel !== "None" && c.languages.includes("Turkish"))) s += 10;
  if ((c.targetAudience ?? "").includes("Newcomers") || (c.targetAudience ?? "").includes(profile.arrivalStage)) s += 10;
  if (c.newcomerFriendly) s += 5;
  return s;
}

export type RoadmapSection = "DO_FIRST" | "CONNECT" | "GROW";
export type RoadmapItem =
  | { type: "resource"; id: string; data: ResourceView; why: string[]; section: RoadmapSection }
  | { type: "community"; id: string; data: CommunityView; why: string[]; section: RoadmapSection; score: number };

export async function buildRoadmap(): Promise<RoadmapItem[]> {
  const { communities } = await import("../data/communities");
  const { resources } = await import("../data/resources");

  // DO_FIRST: trusted resources (not communities)
  const doFirst: RoadmapItem[] = resources.map(r => ({
    type: "resource" as const,
    id: r.id,
    data: r,
    section: "DO_FIRST" as RoadmapSection,
    why: r.category === "Housing"
      ? ["A stable place to live helps you feel at home"]
      : ["Getting around easily gives you freedom"],
  }));

  // CONNECT: language / Beykoz / newcomer-friendly, low Turkish barrier
  const connectCandidates = communities
    .filter(c => c.category === "language_integration" || c.category === "social_cultural")
    .sort((a,b)=> scoreCommunity(ahmedProfile,b)-scoreCommunity(ahmedProfile,a))
    .slice(0,2);

  // GROW: tech communities matching Software/AI, sorted by score
  const growCandidates = communities
    .filter(c => c.category === "technology")
    .sort((a,b)=> scoreCommunity(ahmedProfile,b)-scoreCommunity(ahmedProfile,a))
    .slice(0,2);

  return [
    ...doFirst,
    ...connectCandidates.map(c => ({
      type: "community" as const,
      id: c.id,
      data: c,
      why: whyMap[c.id] ?? ["Active in Istanbul", "Welcoming to newcomers"],
      section: "CONNECT" as RoadmapSection,
      score: scoreCommunity(ahmedProfile,c),
    })),
    ...growCandidates.map(c => ({
      type: "community" as const,
      id: c.id,
      data: c,
      why: whyMap[c.id] ?? ["Matches your Software interest"],
      section: "GROW" as RoadmapSection,
      score: scoreCommunity(ahmedProfile,c),
    })),
  ];
}

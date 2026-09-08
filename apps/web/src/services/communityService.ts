import { communities as mockCommunities } from "../data/communities";
import type { CommunityView } from "../data/communities";

// Thin boundary — UI calls these, backend team can replace with fetch without rewriting pages.
// Currently mocked; later: fetch('/api/v1/communities')
export async function getCommunities(): Promise<CommunityView[]> {
  // simulate async for loader compatibility
  return Promise.resolve(mockCommunities);
}

export async function getCommunityById(id: string): Promise<CommunityView | null> {
  const all = await getCommunities();
  // support both uuid and legacy slug
  const { slugToId } = await import("../data/communities");
  const resolved = slugToId[id] ?? id;
  return all.find(c => c.id === resolved) ?? null;
}

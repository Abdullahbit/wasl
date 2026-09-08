import { resources as mockResources } from "../data/resources";
import type { ResourceView } from "../data/resources";

export async function getResources(): Promise<ResourceView[]> {
  return Promise.resolve(mockResources);
}
export async function getResourceById(id: string): Promise<ResourceView | null> {
  const all = await getResources();
  return all.find(r => r.id === id) ?? null;
}

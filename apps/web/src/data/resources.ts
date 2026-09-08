import type { Resource } from "@wasl/contracts";

export type ResourceView = Resource & {
  image: string;
  tags: string[];
};

export const resources: ResourceView[] = [
  {
    id: "00000000-0000-0000-0000-000000000021",
    title: "Student Residence Essentials",
    description: "Everything you need to know about finding and securing student housing in Istanbul.",
    category: "Housing",
    url: "https://e-ikamet.goc.gov.tr",
    source: "Göç İdaresi",
    lastReviewed: "2026-09-01T00:00:00.000Z",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-09-01T00:00:00.000Z",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&q=80",
    tags: ["Housing", "Newcomer essentials"],
  },
  {
    id: "00000000-0000-0000-0000-000000000022",
    title: "Transportation Starter Guide",
    description: "Learn how to use public transport, get your Istanbulkart, and explore the city.",
    category: "Transportation",
    url: "https://bireysel.istanbulkart.istanbul",
    source: "IBB",
    lastReviewed: "2026-09-01T00:00:00.000Z",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-09-01T00:00:00.000Z",
    image: "https://images.unsplash.com/photo-1527838832700-5059252407fa?w=600&q=80",
    tags: ["Transportation", "City life"],
  },
];

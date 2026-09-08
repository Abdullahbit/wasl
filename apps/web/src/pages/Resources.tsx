import { useEffect, useState } from "react";
import { getResources } from "../services/resourceService";
import type { ResourceView } from "../data/resources";
import { useLang } from "../context/LanguageContext";

export default function Resources() {
  const { t, arrow } = useLang();
  const [resources, setResources] = useState<ResourceView[] | null>(null);
  useEffect(() => {
    getResources().then(setResources);
  }, []);
  if (!resources) return <div className="max-w-[1280px] mx-auto px-6 py-10 text-sm text-[#6b7a8a]">{t.resources.loading}</div>;
  if (resources.length === 0) return <div className="max-w-[1280px] mx-auto px-6 py-10 text-sm text-[#6b7a8a]">{t.resources.empty}</div>;
  return (
    <div className="max-w-[1280px] mx-auto px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold">{t.resources.title}</h1>
      <p className="text-sm text-[#6b7a8a]">{t.resources.subtitle}</p>
      <div className="grid md:grid-cols-2 gap-4 mt-6">
        {resources.map((r) => (
          <div key={r.id} className="bg-white border border-[#e8ddd0] rounded-2xl overflow-hidden text-start">
            <img
              src={r.image}
              alt={r.title}
              className="w-full h-[160px] object-cover"
              onError={(e) => ((e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&q=80")}
            />
            <div className="p-5">
              <h3 className="font-semibold">{r.title}</h3>
              <p className="text-sm text-[#4a5a6a] mt-1">{r.description}</p>
              <a href={r.url} target="_blank" rel="noreferrer" className="mt-3 inline-flex border border-[#e8ddd0] rounded-full px-4 py-2 text-sm hover:bg-[#fdf8f2]">
                {t.resources.view} {arrow}
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

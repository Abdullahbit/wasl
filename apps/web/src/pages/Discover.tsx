import { useState, useEffect } from "react";
import CommunityCard from "../components/CommunityCard";
import { getCommunities } from "../services/communityService";
import { whyMap } from "../data/communities";
import type { CommunityView } from "../data/communities";
import { useLang } from "../context/LanguageContext";

export default function Discover() {
  const { t } = useLang();
  const [active, setActive] = useState<string>(t.discover.filters[0]);
  const [communities, setCommunities] = useState<CommunityView[]>([]);
  useEffect(() => {
    getCommunities().then(setCommunities);
  }, []);
  useEffect(() => {
    setActive(t.discover.filters[0]);
  }, [t.discover.filters]);
  const filtered =
    active === t.discover.filters[0]
      ? communities
      : communities.filter((c) => c.category.toLowerCase().includes(active.toLowerCase().slice(0, 4)) || c.tags.join(" ").toLowerCase().includes(active.toLowerCase()));
  if (communities.length === 0) return <div className="max-w-[1280px] mx-auto px-6 py-10 text-sm text-[#6b7a8a]">{t.discover.loading}</div>;
  return (
    <div className="max-w-[1280px] mx-auto px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold">{t.discover.title}</h1>
      <p className="text-sm text-[#6b7a8a]">{t.discover.subtitle}</p>
      <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
        {t.discover.filters.map((f) => (
          <button
            key={f}
            onClick={() => setActive(f)}
            className={`px-4 py-1.5 rounded-full text-sm border whitespace-nowrap ${active === f ? "bg-[#1e3a5f] text-white border-[#1e3a5f]" : "bg-white border-[#e8ddd0]"}`}
          >
            {f}
          </button>
        ))}
      </div>
      <h2 className="mt-6 font-semibold">{t.discover.picked}</h2>
      {filtered.length === 0 ? (
        <p className="text-sm text-[#6b7a8a] mt-6 bg-white border border-[#e8ddd0] rounded-xl p-4">{t.discover.noFilter}</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-3">
          {filtered.map((c) => (
            <CommunityCard key={c.id} c={c} why={whyMap[c.id]} />
          ))}
        </div>
      )}
    </div>
  );
}

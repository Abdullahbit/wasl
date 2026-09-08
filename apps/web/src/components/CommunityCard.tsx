import { Link } from "react-router-dom";
import type { CommunityView } from "../data/communities";
import { FALLBACK_IMAGE } from "../data/communities";
import { useLang } from "../context/LanguageContext";

export default function CommunityCard({ c, why }: { c: CommunityView; why?: string[] }) {
  const { t, arrow } = useLang();
  return (
    <div className="bg-white rounded-[18px] border border-[#e8ddd0] overflow-hidden flex flex-col hover:shadow-md transition-shadow text-start">
      <div className="h-[140px] overflow-hidden relative">
        <img src={c.image} alt={c.name} className="w-full h-full object-cover" onError={(e) => ((e.target as HTMLImageElement).src = FALLBACK_IMAGE)} />
        {c.verified && <span className="absolute top-3 end-3 bg-white text-[11px] px-2 py-1 rounded-full border border-[#e8ddd0]">{t.common.teamReviewed}</span>}
        {c.newcomerFriendly && <span className="absolute top-3 start-3 bg-[#eef3ff] text-[#1e3a5f] text-[11px] px-2 py-1 rounded-full">{t.common.newcomer}</span>}
      </div>
      <div className="p-4 flex-1 flex flex-col gap-2">
        <h3 className="font-semibold text-[#1e3a5f] leading-tight" dir="auto">
          <bdi>{c.name}</bdi>
        </h3>
        <p className="text-xs text-[#6b7a8a]" dir="auto">
          👥 <bdi>{c.languages.join(" · ")}</bdi> | {c.location}
        </p>
        <p className="text-sm text-[#3a4a5a] line-clamp-2">{c.description}</p>
        <div className="flex flex-wrap gap-1.5 mt-1">
          {c.tags.map((tag: string) => (
            <span key={tag} className="text-[11px] bg-[#fdf0e6] text-[#7a4a2e] px-2 py-1 rounded-full border border-[#e8ddd0]">
              {tag}
            </span>
          ))}
        </div>
        {why && (
          <div className="mt-2 bg-[#f7f9ff] rounded-xl p-3 text-xs text-start">
            <p className="font-semibold text-[#1e3a5f] mb-1">{t.plan.why}</p>
            <ul className="space-y-1 text-[#3a4a5a]">
              {why.map((w: string) => (
                <li key={w}>✓ {w}</li>
              ))}
            </ul>
          </div>
        )}
        <Link to={`/communities/${c.id}`} className="mt-3 text-sm font-medium text-[#1e3a5f] border border-[#e8ddd0] rounded-full px-4 py-2 text-center hover:bg-[#fdf8f2]">
          {t.plan.viewCommunity} {arrow}
        </Link>
      </div>
    </div>
  );
}

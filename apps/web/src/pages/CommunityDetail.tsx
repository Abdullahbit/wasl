import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getCommunityById } from "../services/communityService";
import { whyMap, FALLBACK_IMAGE } from "../data/communities";
import type { CommunityView } from "../data/communities";
import { useLang } from "../context/LanguageContext";

export default function CommunityDetail() {
  const { id } = useParams<{ id: string }>();
  const { t, arrow, lang } = useLang();
  const backArrow = lang === "ar" ? "→" : "←";
  const [c, setC] = useState<CommunityView | null | undefined>(undefined);
  useEffect(() => {
    if (id) getCommunityById(id).then(setC);
  }, [id]);
  if (c === undefined) return <div className="max-w-[960px] mx-auto px-6 py-10 text-sm text-[#6b7a8a]">{t.detail.loading}</div>;
  if (c === null)
    return (
      <div className="max-w-[960px] mx-auto px-6 py-10">
        <h1 className="text-xl font-bold">{t.detail.notFound}</h1>
        <p className="text-sm text-[#6b7a8a] mt-2">{t.detail.notFoundDesc}</p>
        <Link to="/communities" className="text-[#1e3a5f] underline text-sm mt-4 inline-block">
          {backArrow} {t.detail.back}
        </Link>
      </div>
    );
  const why = whyMap[c.id] || ["Active in Istanbul", "Welcoming to newcomers"];
  return (
    <div className="max-w-[1100px] mx-auto px-6 lg:px-8 py-8">
      <Link to="/communities" className="text-sm text-[#6b7a8a]">
        {backArrow} {t.detail.back}
      </Link>
      <div className="mt-4 h-[260px] rounded-[20px] overflow-hidden border border-[#e8ddd0]">
        <img src={c.image} alt={c.name} className="w-full h-full object-cover" onError={(e) => ((e.target as HTMLImageElement).src = FALLBACK_IMAGE)} />
      </div>
      <div className="mt-6 grid lg:grid-cols-[1fr_340px] gap-8">
        <div className="text-start">
          <h1 className="text-3xl font-bold text-[#1e3a5f]" dir="auto">
            <bdi>{c.name}</bdi>
          </h1>
          <p className="text-sm text-[#6b7a8a] mt-1" dir="auto">
            {c.category} · {c.location} · <bdi>{c.languages.join(" · ")}</bdi>
          </p>
          <a href={c.joinUrl ?? "#"} target="_blank" rel="noreferrer" className="mt-4 inline-flex bg-[#1e3a5f] text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-[#15304f]">
            {t.detail.visit} {arrow}
          </a>
          <div className="mt-6 bg-white border border-[#e8ddd0] rounded-2xl p-6 text-start">
            <h3 className="font-semibold">{t.detail.about}</h3>
            <p className="text-sm text-[#4a5a6a] mt-2">
              {c.description} Regular meetups, workshops and community support for students and professionals across Istanbul.
            </p>
            <h3 className="font-semibold mt-6">{t.detail.who}</h3>
            <p className="text-sm text-[#4a5a6a] mt-2" dir="auto">
              Students, newcomers and professionals interested in <bdi>{c.interests.join(", ")}</bdi>.
            </p>
            <h3 className="font-semibold mt-6">{t.detail.languages}</h3>
            <p className="text-sm text-[#4a5a6a] mt-1" dir="auto">
              <bdi>{c.languages.join(", ")}</bdi>
            </p>
            <h3 className="font-semibold mt-6">{t.detail.details}</h3>
            <p className="text-xs text-[#6b7a8a] mt-1">
              {t.detail.verified}: {c.verified ? t.detail.verified : t.detail.reported} · {t.detail.lastReviewed} {c.lastReviewed ? new Date(c.lastReviewed).toLocaleDateString(lang === "ar" ? "ar-EG" : "en-GB") : "—"}
            </p>
          </div>
        </div>
        <div className="space-y-4">
          <div className="bg-white border border-[#e8ddd0] rounded-2xl p-5 text-start">
            <h3 className="font-semibold text-[#1e3a5f]">{t.detail.why}</h3>
            <ul className="mt-3 space-y-2 text-sm">
              {why.map((w: string) => (
                <li key={w} className="flex gap-2">
                  <span className="text-[#7a9e8a]">✓</span> <span>{w}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex flex-wrap gap-2">
              {c.tags.map((tag: string) => (
                <span key={tag} className="text-xs bg-[#fdf0e6] border border-[#e8ddd0] px-2 py-1 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div className="bg-[#f7f9ff] border border-[#d0dcee] rounded-2xl p-5 text-sm text-start">
            <p className="font-semibold">{t.detail.join}</p>
            <p className="text-[#6b7a8a] mt-1">
              {t.detail.external} {c.joinUrl ? new URL(c.joinUrl).hostname : "the community site"}.
            </p>
            <a href={c.joinUrl ?? "#"} target="_blank" rel="noreferrer" className="mt-3 inline-flex w-full justify-center border border-[#1e3a5f] text-[#1e3a5f] rounded-full py-2 text-sm font-medium hover:bg-white">
              {t.detail.open}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

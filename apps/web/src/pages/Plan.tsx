import { useSearchParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import CommunityCard from "../components/CommunityCard";
import { buildRoadmap, type RoadmapItem } from "../services/roadmapService";
import { useLang } from "../context/LanguageContext";

export default function Plan() {
  const { t, arrow } = useLang();
  const [sp] = useSearchParams();
  const loadingInit = sp.get("loading") === "1";
  const [loading, setLoading] = useState(loadingInit);
  const [done, setDone] = useState<Record<string, boolean>>({
    "00000000-0000-0000-0000-000000000021": true,
    "00000000-0000-0000-0000-000000000012": true,
  });
  const [roadmap, setRoadmap] = useState<RoadmapItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (loading) {
      const timer = setTimeout(() => setLoading(false), 1600);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  useEffect(() => {
    buildRoadmap()
      .then(setRoadmap)
      .catch(() => setError("Could not build your plan. Please refresh."));
  }, []);

  if (loading) {
    return (
      <div className="max-w-[960px] mx-auto px-6 py-20 text-center">
        <div className="w-12 h-12 border-4 border-[#e8ddd0] border-t-[#1e3a5f] rounded-full animate-spin mx-auto" />
        <h2 className="mt-6 text-xl font-bold text-[#1e3a5f]">{t.plan.building}</h2>
        <p className="text-sm text-[#6b7a8a]">{t.plan.matching}</p>
      </div>
    );
  }
  if (error)
    return (
      <div className="max-w-[960px] mx-auto px-6 py-10 text-center">
        <p className="text-sm text-red-600">{error}</p>
        <Link to="/onboarding" className="text-[#1e3a5f] underline text-sm mt-2 inline-block">
          Restart onboarding
        </Link>
      </div>
    );
  if (!roadmap) return <div className="max-w-[960px] mx-auto px-6 py-10 text-center text-sm text-[#6b7a8a]">Loading...</div>;

  const doFirst = roadmap.filter((r) => r.section === "DO_FIRST");
  const connect = roadmap.filter((r) => r.section === "CONNECT");
  const grow = roadmap.filter((r) => r.section === "GROW");
  const toggle = (id: string) => setDone((d) => ({ ...d, [id]: !d[id] }));
  const completed = Object.values(done).filter(Boolean).length;

  return (
    <div className="max-w-[1280px] mx-auto px-6 lg:px-8 py-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="text-start">
          <h1 className="text-2xl font-bold">{t.plan.title}</h1>
          <p className="text-sm text-[#6b7a8a]">{t.plan.subtitle}</p>
        </div>
        <div className="text-end">
          <p className="text-xs text-[#6b7a8a]">{completed} {t.plan.completed}</p>
          <div className="w-[160px] h-2 bg-[#e8ddd0] rounded-full overflow-hidden mt-1">
            <div className="h-full bg-[#7a9e8a]" style={{ width: `${(completed / 5) * 100}%` }} />
          </div>
        </div>
      </div>

      <section className="mt-8">
        <div className="flex items-center gap-3 mb-3">
          <span className="w-8 h-8 rounded-full bg-[#fdf0e6] border border-[#e8ddd0] flex items-center justify-center text-xs font-bold text-[#c45a2e]">01</span>
          <h2 className="font-bold">
            {t.plan.doFirst} <span className="font-normal text-[#6b7a8a] text-sm">— {t.plan.doFirstSub}</span>
          </h2>
          <span className="ms-auto text-xs text-[#6b7a8a]">
            {doFirst.filter((r) => done[r.id]).length} of {doFirst.length} done
          </span>
        </div>
        <div className="grid md:grid-cols-2 gap-4 bg-[#fff6ee] border border-[#f0d8c0] rounded-2xl p-4">
          {doFirst.map(
            (item) =>
              item.type === "resource" && (
                <div key={item.id} className="bg-white rounded-[16px] border border-[#e8ddd0] overflow-hidden flex flex-col">
                  <div className="h-[150px] relative">
                    <img
                      src={item.data.image}
                      alt={item.data.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&q=80";
                      }}
                    />
                    <span className="absolute top-3 start-3 bg-white text-xs px-2 py-1 rounded-full border border-[#e8ddd0]">{done[item.id] ? t.plan.completedBadge : t.plan.toDo}</span>
                  </div>
                  <div className="p-4 flex-1 flex flex-col gap-2 text-start">
                    <h3 className="font-semibold text-[#1e3a5f]">{item.data.title}</h3>
                    <p className="text-sm text-[#4a5a6a]">{item.data.description}</p>
                    <p className="text-xs bg-[#fdf6ee] border border-[#e8ddd0] rounded-lg p-2">
                      <span className="font-semibold">{t.plan.why}</span> {item.why[0]}
                    </p>
                    <div className="flex gap-1.5 flex-wrap">
                      {item.data.tags.map((tag: string) => (
                        <span key={tag} className="text-[11px] bg-[#fdf0e6] px-2 py-1 rounded-full border border-[#e8ddd0]">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2 mt-2">
                      <a href={item.data.url} target="_blank" rel="noreferrer" className="flex-1 text-center text-sm border border-[#e8ddd0] rounded-full py-2 hover:bg-[#fdf8f2]">
                        {t.plan.viewResource} {arrow}
                      </a>
                      <button onClick={() => toggle(item.id)} className={`px-4 py-2 rounded-full text-sm ${done[item.id] ? "bg-[#eef5f0] border border-[#7a9e8a]" : "bg-[#1e3a5f] text-white"}`}>
                        {done[item.id] ? t.plan.undo : t.plan.done}
                      </button>
                    </div>
                  </div>
                </div>
              ),
          )}
        </div>
      </section>

      <section className="mt-8">
        <div className="flex items-center gap-3 mb-3">
          <span className="w-8 h-8 rounded-full bg-[#eef3ff] border border-[#d0dcee] flex items-center justify-center text-xs font-bold text-[#1e3a5f]">02</span>
          <h2 className="font-bold">
            {t.plan.connect} <span className="font-normal text-[#6b7a8a] text-sm">— {t.plan.connectSub}</span>
          </h2>
        </div>
        {connect.length === 0 ? (
          <p className="text-sm text-[#6b7a8a] bg-white border border-[#e8ddd0] rounded-xl p-4">{t.plan.noConnect}</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-4 bg-[#f3f6ff] border border-[#d0dcee] rounded-2xl p-4">
            {connect.map((item) => item.type === "community" && <CommunityCard key={item.id} c={item.data} why={item.why} />)}
          </div>
        )}
      </section>

      <section className="mt-8">
        <div className="flex items-center gap-3 mb-3">
          <span className="w-8 h-8 rounded-full bg-[#eef5f0] border border-[#c8ddd0] flex items-center justify-center text-xs font-bold text-[#2d6a4f]">03</span>
          <h2 className="font-bold">
            {t.plan.grow} <span className="font-normal text-[#6b7a8a] text-sm">— {t.plan.growSub}</span>
          </h2>
        </div>
        <div className="grid md:grid-cols-2 gap-4 bg-[#f2faf4] border border-[#c8ddd0] rounded-2xl p-4">
          {grow.map(
            (item) =>
              item.type === "community" && (
                <div key={item.id} className="bg-white rounded-[16px] border border-[#e8ddd0] overflow-hidden relative">
                  {done[item.id] && <span className="absolute top-3 start-3 bg-white text-xs px-2 py-1 rounded-full border border-[#7a9e8a] z-10">{t.plan.completedBadge}</span>}
                  <CommunityCard c={item.data} why={item.why} />
                  <div className="px-4 pb-3">
                    <button onClick={() => toggle(item.id)} className={`w-full py-2 rounded-full text-sm ${done[item.id] ? "bg-[#eef5f0] border border-[#7a9e8a]" : "bg-white border border-[#e8ddd0] hover:bg-[#fdf8f2]"}`}>
                      {done[item.id] ? t.plan.undo : t.plan.markDone}
                    </button>
                  </div>
                </div>
              ),
          )}
        </div>
      </section>

      <section className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="font-bold">{t.plan.needMore}</h2>
          <Link to="/communities" className="text-sm text-[#1e3a5f]">
            {t.plan.explore} {arrow}
          </Link>
        </div>
        <p className="text-sm text-[#6b7a8a] mt-2">{t.plan.browse}</p>
      </section>
    </div>
  );
}

import { Link } from "react-router-dom";
import { useLang } from "../context/LanguageContext";

export default function Landing() {
  const { t, arrow } = useLang();
  return (
    <div>
      <section className="max-w-[1280px] mx-auto px-6 lg:px-8 py-10 lg:py-16 grid lg:grid-cols-[1.1fr_0.9fr] gap-10 items-center">
        <div className="text-start">
          <h1 className="text-[42px] lg:text-[48px] leading-[1.05] font-bold text-[#1a242e]">
            {t.landing.title1}
            <br />
            <span className="text-[#c45a2e]">{t.landing.title2}</span>
          </h1>
          <p className="mt-4 text-[#4a5a6a] max-w-[560px]">{t.landing.subtitle}</p>
          <Link to="/onboarding" className="mt-6 inline-flex items-center gap-2 bg-[#1e3a5f] text-white px-6 py-3 rounded-full font-medium hover:bg-[#15304f]">
            {t.landing.cta} {arrow}
          </Link>
          <p className="mt-3 text-sm text-[#7a9e8a] italic whitespace-pre-line">{t.landing.smoother}</p>
        </div>
        <div className="bg-[#fff6ee] rounded-[24px] border border-[#e8ddd0] p-6 relative overflow-hidden">
          <p className="text-xs italic text-[#6b7a8a] absolute top-4 start-6 whitespace-pre-line">{t.landing.journeyFurther}</p>
          <p className="text-xs italic text-[#c45a2e] absolute top-4 end-6 text-end whitespace-pre-line">{t.landing.brighter}</p>
          <div className="mt-10 flex items-center justify-between gap-2">
            {[
              { k: t.landing.arrive, d: t.landing.arriveD, icon: "✈" },
              { k: t.landing.navigate, d: t.landing.navigateD, icon: "📍" },
              { k: t.landing.connect, d: t.landing.connectD, icon: "👥" },
              { k: t.landing.grow, d: t.landing.growD, icon: "🌿" },
            ].map((s) => (
              <div key={s.k} className="flex-1 text-center">
                <div
                  className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center text-white text-lg ${s.k === t.landing.arrive ? "bg-[#c45a2e]" : s.k === t.landing.navigate ? "bg-[#1e3a5f]" : s.k === t.landing.connect ? "bg-[#2d6a4f]" : "bg-[#c45a2e]"}`}
                >
                  {s.icon}
                </div>
                <p className="text-[11px] font-bold mt-2 text-[#1e3a5f]">{s.k}</p>
                <p className="text-[10px] leading-tight text-[#6b7a8a]">{s.d}</p>
              </div>
            ))}
          </div>
          <img
            src="https://images.unsplash.com/photo-1527838832700-5059252407fa?w=800&q=80"
            alt="Istanbul"
            className="mt-6 rounded-xl w-full h-[160px] object-cover opacity-90"
          />
        </div>
      </section>
      <section className="max-w-[1280px] mx-auto px-6 lg:px-8 pb-6">
        <h2 className="font-semibold text-[#1e3a5f]">{t.landing.how}</h2>
        <div className="grid md:grid-cols-3 gap-4 mt-4">
          {t.landing.steps.map((s) => (
            <div key={s.n} className="bg-white border border-[#e8ddd0] rounded-2xl p-5 text-start">
              <p className="text-[#c45a2e] font-bold text-sm">{s.n}</p>
              <p className="font-semibold mt-1">{s.t}</p>
              <p className="text-sm text-[#6b7a8a]">{s.d}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

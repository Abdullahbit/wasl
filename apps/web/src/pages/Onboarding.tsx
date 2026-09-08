import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLang } from "../context/LanguageContext";

export default function Onboarding() {
  const { t, lang, arrow } = useLang();
  const steps = [
    {
      q: t.onboarding.questions[0],
      opts: lang === "ar" ? ["وصلت للتو", "شهري الأول", "أستقر حالياً", "مستقر منذ فترة"] : ["Just arrived", "First month", "Settling in", "Already established"],
    },
    {
      q: t.onboarding.questions[1],
      opts: ["Beykoz University", "Istanbul University", "Marmara University", "ITU", "YTU", lang === "ar" ? "أخرى" : "Other"],
    },
    {
      q: t.onboarding.questions[2],
      opts: lang === "ar"
        ? ["تطوير البرمجيات", "الذكاء الاصطناعي", "ريادة الأعمال", "اللغات", "أكاديمي", "الرياضة", "التصميم", "أنشطة اجتماعية"]
        : ["Software Development", "Artificial Intelligence", "Entrepreneurship", "Languages", "Academic", "Sports", "Design", "Social Activities"],
      multi: true,
    },
    {
      q: t.onboarding.questions[3],
      opts: lang === "ar"
        ? ["تحسين لغتي التركية", "التعرف على أشخاص", "بناء شبكة علاقات", "العثور على تدريب", "الانضمام إلى مشاريع", "فهم الحياة في تركيا"]
        : ["Improve my Turkish", "Meet people", "Build my network", "Find an internship", "Join projects", "Understand life in Türkiye"],
      multi: true,
    },
  ];

  const [step, setStep] = useState(0);
  const [sel, setSel] = useState<Record<number, string[]>>({});
  const nav = useNavigate();
  const toggle = (o: string) => {
    const cur = sel[step] || [];
    const isMulti = (steps[step] as any).multi;
    if (isMulti) setSel({ ...sel, [step]: cur.includes(o) ? cur.filter((x) => x !== o) : [...cur, o] });
    else setSel({ ...sel, [step]: [o] });
  };
  const next = () => {
    if (step < 3) setStep(step + 1);
    else {
      localStorage.setItem("wasl_onboarding", JSON.stringify(sel));
      nav("/plan?loading=1");
    }
  };
  const backArrow = lang === "ar" ? "→" : "←";
  return (
    <div className="max-w-[960px] mx-auto px-6 py-10 grid md:grid-cols-[280px_1fr] gap-8">
      <div className="bg-white border border-[#e8ddd0] rounded-2xl p-6 h-fit">
        <p className="text-sm font-semibold text-[#1e3a5f]">{t.onboarding.title}</p>
        <p className="text-xs text-[#6b7a8a] mt-1">
          {lang === "ar" ? `الخطوة ${step + 1} من ٤` : `Step ${step + 1} of 4`}
        </p>
        <div className="mt-4 h-2 bg-[#f0e6db] rounded-full overflow-hidden">
          <div className="h-full bg-[#1e3a5f] transition-all" style={{ width: `${((step + 1) / 4) * 100}%` }} />
        </div>
        <ul className="mt-6 space-y-2 text-sm">
          {steps.map((s, i) => (
            <li key={i} className={`${i === step ? "font-semibold text-[#1e3a5f]" : "text-[#6b7a8a]"} ${i < step ? "line-through" : ""}`}>
              {i + 1}. {s.q}
            </li>
          ))}
        </ul>
      </div>
      <div className="bg-white border border-[#e8ddd0] rounded-2xl p-8">
        <h2 className="text-xl font-bold text-[#1e3a5f]">{steps[step].q}</h2>
        <p className="text-sm text-[#6b7a8a] mt-1">{step === 2 || step === 3 ? t.onboarding.selectAll : t.onboarding.chooseOne}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          {steps[step].opts.map((o) => {
            const active = (sel[step] || []).includes(o);
            return (
              <button
                key={o}
                onClick={() => toggle(o)}
                dir="auto"
                className={`px-4 py-2.5 rounded-full border text-sm font-medium ${active ? "bg-[#1e3a5f] text-white border-[#1e3a5f]" : "bg-white border-[#e8ddd0] hover:border-[#1e3a5f]"}`}
              >
                {o}
              </button>
            );
          })}
        </div>
        <div className="mt-8 flex justify-between">
          <button onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0} className="text-sm px-4 py-2 rounded-full border border-[#e8ddd0] disabled:opacity-40">
            {t.onboarding.back} {step > 0 ? backArrow : ""}
          </button>
          <button onClick={next} disabled={!(sel[step]?.length)} className="bg-[#1e3a5f] text-white px-6 py-2.5 rounded-full text-sm font-medium disabled:opacity-40">
            {step === 3 ? `${t.onboarding.build} ${arrow}` : `${t.onboarding.continue} ${arrow}`}
          </button>
        </div>
      </div>
    </div>
  );
}

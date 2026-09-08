import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type Lang = "en" | "ar";

const dict = {
  en: {
    nav: { plan: "My Plan", discover: "Discover", resources: "Resources", about: "About" },
    landing: {
      title1: "New city. New university.",
      title2: "You don't have to figure it out alone.",
      subtitle: "WASL helps Arabic-speaking international students in Istanbul find their next steps, communities, and opportunities — with the power of AI and a human touch.",
      cta: "Build my Istanbul plan",
      journeyFurther: "A journey\nthat takes you further",
      brighter: "Same journey.\nA brighter you.",
      smoother: "A smoother start\nbrighter tomorrows",
      how: "How WASL works",
      steps: [
        { n: "01", t: "Tell us about yourself", d: "Your university, interests and goals." },
        { n: "02", t: "Get your next steps", d: "A prioritized plan for your first weeks." },
        { n: "03", t: "Find your people", d: "Communities that match your journey." },
      ],
      arrive: "ARRIVE",
      arriveD: "Settle in with confidence",
      navigate: "NAVIGATE",
      navigateD: "Find what you need, when you need it",
      connect: "CONNECT",
      connectD: "Meet your people",
      grow: "GROW",
      growD: "Turn today’s steps into tomorrow’s opportunities",
    },
    onboarding: {
      title: "Build your Istanbul plan",
      chooseOne: "Choose one",
      selectAll: "Select all that apply",
      back: "Back",
      continue: "Continue",
      build: "Build my plan",
      questions: [
        "Where are you in your journey?",
        "Where do you study?",
        "What are you interested in?",
        "What would make the next few months better?",
      ],
      steps: [
        "Where are you in your journey?",
        "Where do you study?",
        "What are you interested in?",
        "What would make the next few months better?",
      ],
    },
    plan: {
      title: "Your Istanbul Starter Plan",
      subtitle: "A personalized starting point, powered by AI and real student experiences.",
      completed: "of 5 actions completed",
      doFirst: "DO FIRST",
      doFirstSub: "Get settled and take care of the essentials.",
      connect: "CONNECT",
      connectSub: "Meet people, join communities, feel at home.",
      grow: "GROW",
      growSub: "Explore opportunities and build your future.",
      why: "Why this?",
      teamReviewed: "Team reviewed",
      viewResource: "View resource",
      viewCommunity: "View community",
      done: "Done",
      undo: "Undo",
      markDone: "Mark done",
      needMore: "Need more?",
      browse: "Browse 9 curated communities across technology, language and student life.",
      explore: "Explore all communities",
      completedBadge: "✓ Completed",
      toDo: "To do",
      whyHousing: "A stable place to live helps you feel at home",
      whyTransport: "Getting around easily gives you freedom",
      building: "Building your Istanbul Starter Plan...",
      matching: "Matching your goals with trusted resources and communities.",
      noConnect: "No connect recommendations for this profile yet. Try adjusting your interests.",
    },
    discover: {
      title: "Discover Communities",
      subtitle: "Real people. Real support. A more connected Istanbul.",
      picked: "Picked for you",
      filters: ["For You", "Technology", "Language", "Academic", "Career", "Entrepreneurship", "Social", "Sports"],
      noFilter: "No communities for this filter. Try another category.",
      loading: "Loading communities...",
    },
    detail: {
      back: "Back to Discover",
      about: "About",
      who: "Who it's for",
      languages: "Languages",
      details: "Community details",
      verified: "Team reviewed",
      reported: "Community reported",
      lastReviewed: "Last reviewed",
      why: "Why WASL picked this",
      join: "Join",
      external: "External community — you’ll be redirected to",
      open: "Open official page",
      visit: "Visit Community",
      notFound: "Community not found",
      notFoundDesc: "The community you’re looking for doesn’t exist or has been removed.",
      loading: "Loading...",
    },
    resources: {
      title: "Resources",
      subtitle: "Trusted guides for your first weeks.",
      view: "View resource",
      loading: "Loading resources...",
      empty: "No resources yet.",
    },
    common: {
      newcomer: "Newcomer friendly",
      teamReviewed: "◆ Team reviewed",
    },
  },
  ar: {
    nav: { plan: "خطتي", discover: "اكتشف", resources: "الموارد", about: "حول" },
    landing: {
      title1: "مدينة جديدة. جامعة جديدة.",
      title2: "لست مضطرًا لاكتشاف كل شيء وحدك.",
      subtitle: "وصل يساعد الطلبة الدوليين الناطقين بالعربية في إسطنبول على إيجاد خطواتهم التالية ومجتمعاتهم وفرصهم — بقوة الذكاء الاصطناعي ولمسة إنسانية.",
      cta: "أنشئ خطتي في إسطنبول",
      journeyFurther: "رحلة\nتأخذك أبعد",
      brighter: "نفس الرحلة.\nمستقبل أشرق.",
      smoother: "بداية أسهل\nوغدٌ أجمل",
      how: "كيف يعمل وصل",
      steps: [
        { n: "٠١", t: "عرّفنا بنفسك", d: "جامعتك واهتماماتك وأهدافك." },
        { n: "٠٢", t: "احصل على خطواتك التالية", d: "خطة مرتبة لأسابيعك الأولى." },
        { n: "٠٣", t: "جد مجتمعك", d: "مجتمعات تناسب رحلتك." },
      ],
      arrive: "الوصول",
      arriveD: "استقر بثقة",
      navigate: "التنقل",
      navigateD: "اعثر على ما تحتاجه حين تحتاجه",
      connect: "تواصل",
      connectD: "قابل أشخاصك",
      grow: "تطوّر",
      growD: "حوّل خطوات اليوم إلى فرص الغد",
    },
    onboarding: {
      title: "أنشئ خطتك في إسطنبول",
      chooseOne: "اختر واحدًا",
      selectAll: "اختر كل ما ينطبق",
      back: "رجوع",
      continue: "متابعة",
      build: "أنشئ خطتي",
      questions: [
        "أين أنت في رحلتك؟",
        "أين تدرس؟",
        "ما الذي يهمك؟",
        "ما الذي سيجعل الأشهر القادمة أفضل؟",
      ],
      steps: [
        "أين أنت في رحلتك؟",
        "أين تدرس؟",
        "ما الذي يهمك؟",
        "ما الذي سيجعل الأشهر القادمة أفضل؟",
      ],
    },
    plan: {
      title: "خطتك للانطلاق في إسطنبول",
      subtitle: "نقطة بداية شخصية، مدعومة بالذكاء الاصطناعي وتجارب طلبة حقيقيين.",
      completed: "من ٥ مهام مكتملة",
      doFirst: "ابدأ بهذه الخطوات",
      doFirstSub: "استقر وأنجز الأساسيات.",
      connect: "تواصل",
      connectSub: "قابل الناس وانضم إلى مجتمعات تشعرك بالانتماء.",
      grow: "تطوّر",
      growSub: "استكشف الفرص وابنِ مستقبلك.",
      why: "لماذا نوصي بهذا؟",
      teamReviewed: "راجعه فريق وصل",
      viewResource: "عرض المصدر",
      viewCommunity: "عرض المجتمع",
      done: "تم",
      undo: "تراجع",
      markDone: "تأكيد الإنجاز",
      needMore: "هل تريد المزيد؟",
      browse: "تصفح ٩ مجتمعات مختارة في التقنية واللغة والحياة الطلابية.",
      explore: "استكشاف كل المجتمعات",
      completedBadge: "✓ مكتمل",
      toDo: "مهمة",
      whyHousing: "مكان مستقر يساعدك على الاستقرار والتركيز على دراستك",
      whyTransport: "التنقل السهل يمنحك حرية ويساعدك على الشعور بأنك جزء من المدينة",
      building: "نُجهّز خطتك للانطلاق في إسطنبول...",
      matching: "نطابق أهدافك مع مصادر وموارد موثوقة ومجتمعات مناسبة.",
      noConnect: "لا توصيات تواصل لهذا الملف حاليًا. جرّب تعديل اهتماماتك.",
    },
    discover: {
      title: "اكتشف المجتمعات",
      subtitle: "أشخاص حقيقيون. دعم حقيقي. إسطنبول أكثر تواصلًا.",
      picked: "مختارة لك",
      filters: ["لك", "التقنية", "اللغة", "أكاديمي", "المسار المهني", "ريادة الأعمال", "اجتماعي", "الرياضة"],
      noFilter: "لا مجتمعات لهذا التصنيف. جرّب تصنيفًا آخر.",
      loading: "جاري تحميل المجتمعات...",
    },
    detail: {
      back: "العودة إلى الاستكشاف",
      about: "نبذة",
      who: "لمن هذا المجتمع",
      languages: "اللغات",
      details: "تفاصيل المجتمع",
      verified: "راجعه فريق وصل",
      reported: "مجتمع مُبلغ عنه",
      lastReviewed: "آخر مراجعة",
      why: "لماذا اختاره وصل لك",
      join: "الانضمام",
      external: "مجتمع خارجي — سيتم تحويلك إلى",
      open: "فتح الصفحة الرسمية",
      visit: "زيارة المجتمع",
      notFound: "المجتمع غير موجود",
      notFoundDesc: "المجتمع الذي تبحث عنه غير موجود أو تمت إزالته.",
      loading: "جاري التحميل...",
    },
    resources: {
      title: "الموارد",
      subtitle: "أدلة موثوقة لأسابيعك الأولى.",
      view: "عرض المصدر",
      loading: "جاري تحميل الموارد...",
      empty: "لا موارد حاليًا.",
    },
    common: {
      newcomer: "مناسب للقادمين الجدد",
      teamReviewed: "◆ راجعه فريق وصل",
    },
  },
};

type Dict = (typeof dict)["en"];

const LanguageContext = createContext<{
  lang: Lang;
  t: Dict;
  dir: "ltr" | "rtl";
  setLang: (l: Lang) => void;
  arrow: string;
} | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem("wasl_lang") as Lang | null : null;
    return saved === "ar" || saved === "en" ? saved : "en";
  });
  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem("wasl_lang", l);
  };
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);
  const t = dict[lang];
  const dir = lang === "ar" ? "rtl" : "ltr";
  const arrow = lang === "ar" ? "←" : "→";
  return <LanguageContext.Provider value={{ lang, t, dir, setLang, arrow }}>{children}</LanguageContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLang must be inside LanguageProvider");
  return ctx;
}

import { Link, useLocation } from "react-router-dom";
import { useLang } from "../context/LanguageContext";

export default function TopNav() {
  const { pathname } = useLocation();
  const { lang, t, setLang } = useLang();
  const nav = [
    { to: "/plan", label: t.nav.plan },
    { to: "/communities", label: t.nav.discover },
    { to: "/resources", label: t.nav.resources },
    { to: "/about", label: t.nav.about },
  ];
  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-[#e8ddd0]">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-8 h-[64px] flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-[#1e3a5f] flex items-center justify-center text-white font-bold text-sm">W</div>
          <span className="font-bold text-[#1e3a5f] text-xl tracking-tight" dir="ltr">WASL</span>
          <span className="hidden sm:inline text-[10px] leading-tight text-[#6b7a8a] ms-2">A BRIGHTER TOMORROW<br />IN ISTANBUL</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className={`pb-1 border-b-2 ${pathname === n.to ? "border-[#1e3a5f] text-[#1e3a5f] font-semibold" : "border-transparent text-[#6b7a8a] hover:text-[#1e3a5f]"}`}
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setLang(lang === "en" ? "ar" : "en")}
            className="text-sm text-[#1e3a5f] flex items-center gap-1 border border-[#e8ddd0] rounded-full px-3 py-1"
            aria-label="Toggle language"
          >
            <span className={lang === "ar" ? "font-bold" : ""}>العربية</span>
            <span className="text-[#c45a2e]">|</span>
            <span className={lang === "en" ? "font-bold" : ""}>EN</span>
          </button>
          <div className="w-8 h-8 rounded-full bg-[#e8ddd0] overflow-hidden">
            <img src="https://i.pravatar.cc/100?img=68" alt="profile" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>
    </header>
  );
}

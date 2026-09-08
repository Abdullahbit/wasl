import React from 'react'
import { Compass, Sparkles, Users, User, ArrowUpRight, LogIn, LogOut } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

interface ShellProps {
  currentTab: string
  onNavigate: (tab: string, param?: string) => void
  children: React.ReactNode
}

export const Shell: React.FC<ShellProps> = ({ currentTab, onNavigate, children }) => {
  const { user, accountType, loginDemoUser, logout } = useAuth()

  const navItems = [
    { id: 'landing', label: 'الرئيسية', icon: Compass },
    { id: 'plan', label: 'خطتي', icon: Sparkles },
    { id: 'communities', label: 'المجتمعات', icon: Users },
    { id: 'profile', label: 'الملف الشخصي', icon: User },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Top Navbar */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 40,
          backgroundColor: 'rgba(255, 255, 255, 0.94)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid var(--border)',
          transition: 'all 0.2s ease',
        }}
      >
        <div
          className="container"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '4.25rem',
          }}
        >
          {/* Logo / Brand */}
          <div
            onClick={() => onNavigate('landing')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.9rem',
              cursor: 'pointer',
              userSelect: 'none',
              padding: '0.4rem 0.6rem',
              borderRadius: 'var(--radius-md)',
              transition: 'all 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(15, 118, 110, 0.04)'
              e.currentTarget.style.transform = 'translateY(-1px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            {/* Custom Designed Wasl Vector Mark */}
            <div
              style={{
                width: '2.85rem',
                height: '2.85rem',
                borderRadius: '14px',
                background: 'linear-gradient(145deg, #0F766E 0%, #0d544f 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 16px rgba(15, 118, 110, 0.32), inset 0 1px 1.5px rgba(255, 255, 255, 0.3)',
                border: '1px solid rgba(255, 255, 255, 0.16)',
                position: 'relative',
                flexShrink: 0,
              }}
            >
              {/* Bespoke Geometric Calligraphic Monogram SVG */}
              <svg
                width="28"
                height="28"
                viewBox="0 0 28 28"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.2))' }}
              >
                {/* Connecting Bridge / Arc representing 'وصل' (Connection) */}
                <path
                  d="M6 19.5C6 15 9.5 11 14.5 11C18 11 21.5 13 22 17.5"
                  stroke="#E97C5F"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                />
                {/* Waw Letter Body with Elegant Loop */}
                <path
                  d="M17.5 7.5C15.8 7.5 14.5 8.8 14.5 10.5C14.5 12.2 15.8 13.5 17.5 13.5C19.2 13.5 20.5 12.2 20.5 10.5C20.5 8.8 19.2 7.5 17.5 7.5Z"
                  fill="#FFFFFF"
                />
                <path
                  d="M17.5 13.5C15 15.5 12 18.5 7 19.5"
                  stroke="#FFFFFF"
                  strokeWidth="2.8"
                  strokeLinecap="round"
                />
                {/* Connection Node Dot */}
                <circle cx="22" cy="17.5" r="2" fill="#E97C5F" />
              </svg>

              {/* Glowing active hub indicator */}
              <span
                style={{
                  position: 'absolute',
                  top: '-2px',
                  right: '-2px',
                  display: 'flex',
                  width: '9px',
                  height: '9px',
                }}
              >
                <span
                  style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    backgroundColor: 'var(--accent)',
                    opacity: 0.75,
                    animation: 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
                  }}
                />
                <span
                  style={{
                    position: 'relative',
                    width: '9px',
                    height: '9px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--accent)',
                    border: '1.5px solid var(--surface)',
                  }}
                />
              </span>
            </div>

            {/* Typography Stack */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                <span
                  style={{
                    fontSize: '1.45rem',
                    fontWeight: 900,
                    letterSpacing: '-0.03em',
                    color: 'var(--foreground)',
                    lineHeight: 1,
                  }}
                >
                  وَصْـل
                </span>
                <span
                  style={{
                    fontSize: '0.7rem',
                    fontFamily: 'var(--font-latin)',
                    fontWeight: 800,
                    color: 'var(--primary)',
                    backgroundColor: 'var(--primary-light)',
                    padding: '0.15rem 0.5rem',
                    borderRadius: '6px',
                    letterSpacing: '0.06em',
                    border: '1px solid var(--primary-border)',
                    lineHeight: 1.2,
                  }}
                >
                  WASL
                </span>
              </div>
              <span
                style={{
                  fontSize: '0.73rem',
                  color: 'var(--muted)',
                  fontWeight: 500,
                  letterSpacing: '-0.01em',
                  lineHeight: 1.2,
                }}
              >
                بوابة الطلاب والمغتربين في تركيا
              </span>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav
            style={{
              display: 'none',
              alignItems: 'center',
              gap: '0.5rem',
            }}
            className="desktop-nav"
          >
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = currentTab === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    paddingBlock: '0.55rem',
                    paddingInline: '1rem',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.95rem',
                    fontWeight: isActive ? 600 : 500,
                    color: isActive ? 'var(--primary)' : 'var(--muted)',
                    backgroundColor: isActive ? 'var(--primary-light)' : 'transparent',
                    transition: 'all 0.18s ease',
                  }}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </button>
              )
            })}

            {/* If community account or to access community hub */}
            {accountType === 'COMMUNITY' && (
              <button
                onClick={() => onNavigate('community-dashboard')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  paddingBlock: '0.55rem',
                  paddingInline: '1rem',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.95rem',
                  fontWeight: currentTab === 'community-dashboard' ? 700 : 500,
                  color: currentTab === 'community-dashboard' ? '#E97C5F' : 'var(--muted)',
                  backgroundColor: currentTab === 'community-dashboard' ? 'rgba(233, 124, 95, 0.1)' : 'transparent',
                  border: currentTab === 'community-dashboard' ? '1px solid rgba(233, 124, 95, 0.3)' : '1px transparent solid',
                  transition: 'all 0.18s ease',
                }}
              >
                <Users size={18} color="#E97C5F" />
                <span>لوحة المجتمع</span>
              </button>
            )}
          </nav>

          {/* User Status / Action Button */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {user ? (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                }}
              >
                <div
                  onClick={() => onNavigate('profile')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    cursor: 'pointer',
                    padding: '0.35rem 0.65rem',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: 'var(--surface)',
                    border: '1px solid var(--border)',
                  }}
                  title="الملف الشخصي"
                >
                  <div
                    style={{
                      width: '1.8rem',
                      height: '1.8rem',
                      borderRadius: '50%',
                      backgroundColor: 'var(--primary-light)',
                      color: 'var(--primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                    }}
                  >
                    {user.name.charAt(0)}
                  </div>
                  <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--foreground)' }}>
                    {user.name}
                  </span>
                </div>

                <button
                  onClick={async () => {
                    await logout()
                    onNavigate('landing')
                  }}
                  className="btn btn-ghost btn-xs"
                  style={{
                    color: 'var(--muted)',
                    padding: '0.35rem',
                    borderRadius: 'var(--radius-full)',
                  }}
                  title="تسجيل الخروج"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <button
                onClick={loginDemoUser}
                className="btn btn-secondary btn-sm"
                style={{ gap: '0.35rem' }}
              >
                <LogIn size={15} />
                <span>دخول تجريبي</span>
              </button>
            )}

            {accountType === 'COMMUNITY' ? (
              <button
                onClick={() => onNavigate('community-dashboard')}
                className="btn btn-secondary btn-sm"
                style={{
                  backgroundColor: 'rgba(233, 124, 95, 0.1)',
                  borderColor: 'rgba(233, 124, 95, 0.3)',
                  color: '#E97C5F',
                  fontWeight: 600,
                }}
              >
                <Users size={15} />
                <span>إدارة مجتمعي</span>
              </button>
            ) : (
              <button
                onClick={() => onNavigate('community-signup')}
                className="btn btn-secondary btn-sm"
                style={{
                  fontSize: '0.85rem',
                  gap: '0.35rem',
                  borderColor: 'var(--border)',
                  color: 'var(--foreground)',
                }}
                title="تسجيل مجتمع أو نادٍ طلابي"
              >
                <Users size={15} color="var(--primary)" />
                <span>تسجيل مجتمع</span>
              </button>
            )}

            <button
              onClick={() => onNavigate('onboarding')}
              className="btn btn-primary btn-sm"
              style={{ display: currentTab === 'onboarding' ? 'none' : 'flex' }}
            >
              <span>أنشئ خطتي</span>
              <ArrowUpRight size={16} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main style={{ flex: 1, paddingBottom: '5rem' }}>
        {children}
      </main>

      {/* Footer */}
      <footer
        style={{
          borderTop: '1px solid var(--border)',
          backgroundColor: 'var(--surface)',
          paddingBlock: '2.5rem',
          marginTop: 'auto',
          fontSize: '0.9rem',
          color: 'var(--muted)',
        }}
      >
        <div
          className="container"
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontWeight: 700, color: 'var(--primary)' }}>وصل (Wasl)</span>
            <span>—</span>
            <span>بوابة الطلاب والمغتربين العرب في الجمهورية التركية</span>
          </div>
          <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.85rem' }}>
            <span
              onClick={() => onNavigate('landing')}
              style={{ cursor: 'pointer', color: 'var(--muted)' }}
            >
              الرئيسية
            </span>
            <span
              onClick={() => onNavigate('plan')}
              style={{ cursor: 'pointer', color: 'var(--muted)' }}
            >
              خطتي المقترحة
            </span>
            <span
              onClick={() => onNavigate('communities')}
              style={{ cursor: 'pointer', color: 'var(--muted)' }}
            >
              دليل المجتمعات
            </span>
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Navigation Bar */}
      <nav
        style={{
          position: 'fixed',
          bottom: 0,
          insetInline: 0,
          zIndex: 50,
          backgroundColor: 'rgba(255, 255, 255, 0.96)',
          backdropFilter: 'blur(16px)',
          borderTop: '1px solid var(--border)',
          display: 'flex',
          justifyContent: 'space-around',
          paddingBlock: '0.55rem',
        }}
        className="mobile-bottom-nav"
      >
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = currentTab === item.id
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.2rem',
                color: isActive ? 'var(--primary)' : 'var(--muted)',
                fontSize: '0.78rem',
                fontWeight: isActive ? 600 : 500,
                padding: '0.25rem 0.5rem',
              }}
            >
              <Icon size={20} color={isActive ? 'var(--primary)' : 'currentColor'} />
              <span>{item.label}</span>
            </button>
          )
        })}
      </nav>

      <style>{`
        @media (min-width: 768px) {
          .desktop-nav {
            display: flex !important;
          }
          .mobile-bottom-nav {
            display: none !important;
          }
        }
      `}</style>
    </div>
  )
}

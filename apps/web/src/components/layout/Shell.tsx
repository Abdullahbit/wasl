import React from 'react'
import { Compass, Sparkles, Users, User, ArrowUpRight, LogIn } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

interface ShellProps {
  currentTab: string
  onNavigate: (tab: string, param?: string) => void
  children: React.ReactNode
}

export const Shell: React.FC<ShellProps> = ({ currentTab, onNavigate, children }) => {
  const { user, loginDemoUser, logout } = useAuth()

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
              gap: '0.65rem',
              cursor: 'pointer',
              userSelect: 'none',
            }}
          >
            <div
              style={{
                width: '2.4rem',
                height: '2.4rem',
                borderRadius: '10px',
                backgroundColor: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontWeight: 700,
                fontSize: '1.25rem',
                boxShadow: '0 2px 8px rgba(15, 118, 110, 0.25)',
              }}
            >
              و
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem' }}>
                <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--foreground)' }}>
                  وصل
                </span>
                <span style={{ fontSize: '0.85rem', color: 'var(--muted)', fontWeight: 500 }}>
                  Wasl
                </span>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: '-2px' }}>
                دليل الطلاب العرب في تركيا
              </p>
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

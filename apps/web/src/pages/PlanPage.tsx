import React, { useEffect, useState } from 'react'
import {
  Sparkles,
  CheckCircle2,
  Users,
  Compass,
  ArrowLeft,
  BookOpen,
  Briefcase,
  AlertCircle,
  ExternalLink,
  ChevronRight,
} from 'lucide-react'
import { recommendationsApi, type RecommendationData, type ApiCommunity } from '../lib/api'
import { CommunityCard } from '../components/community/CommunityCard'
import { WhyThisModal } from '../components/community/WhyThisModal'
import { useAuth } from '../context/AuthContext'
import { translate } from '../lib/translations'

interface PlanPageProps {
  onNavigate: (tab: string, param?: string) => void
}

export const PlanPage: React.FC<PlanPageProps> = ({ onNavigate }) => {
  const { profile, ensureAuthenticated } = useAuth()
  const [data, setData] = useState<RecommendationData | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  // Why this modal state
  const [activeWhyCommunity, setActiveWhyCommunity] = useState<ApiCommunity | null>(null)

  useEffect(() => {
    async function loadPlan() {
      setIsLoading(true)
      setErrorMsg(null)
      try {
        await ensureAuthenticated()
        const recs = await recommendationsApi.get()
        setData(recs)
      } catch (err: any) {
        console.error('Failed to load plan recommendations:', err)
        setErrorMsg(err.message || 'حدث خطأ أثناء إعداد خطتك المقترحة.')
      } finally {
        setIsLoading(false)
      }
    }
    loadPlan()
  }, [ensureAuthenticated])

  return (
    <div className="container animate-fade-in" style={{ paddingBlock: '2.5rem' }}>
      {/* Header Banner */}
      <div
        style={{
          backgroundColor: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding: '2rem',
          marginBottom: '2.5rem',
          boxShadow: 'var(--shadow-sm)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ maxWidth: '720px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              backgroundColor: 'var(--primary-light)',
              color: 'var(--primary)',
              padding: '0.3rem 0.8rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.82rem',
              fontWeight: 700,
              marginBottom: '0.85rem',
            }}
          >
            <Sparkles size={14} />
            <span>خطة البداية الذكية</span>
          </div>

          <h1
            style={{
              fontSize: 'clamp(1.75rem, 3.5vw, 2.35rem)',
              fontWeight: 800,
              color: 'var(--foreground)',
              lineHeight: 1.25,
              marginBottom: '0.75rem',
            }}
          >
            خطواتك القادمة في تركيا
          </h1>

          <p style={{ fontSize: '1rem', color: 'var(--muted)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
            بناءً على موقعك ({profile?.currentCity ? translate(profile.currentCity) : 'إسطنبول'})
            واهتماماتك التي حددتها، قمنا بترتيب أهم الخطوات والمجتمعات التي ستساعدك على الانطلاق بثقة وسرعة.
          </p>

          {/* User Quick Profile Badges */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--muted)', fontWeight: 600 }}>
              بيانات خطتك:
            </span>
            {profile?.currentCity && (
              <span className="badge badge-muted">المدينة: {translate(profile.currentCity)}</span>
            )}
            {profile?.interests?.slice(0, 3).map((i) => (
              <span key={i} className="badge badge-primary">
                {translate(i)}
              </span>
            ))}
            <button
              onClick={() => onNavigate('onboarding')}
              style={{
                fontSize: '0.82rem',
                color: 'var(--primary)',
                fontWeight: 600,
                textDecoration: 'underline',
                marginInlineStart: '0.5rem',
              }}
            >
              تعديل المدخلات
            </button>
          </div>
        </div>
      </div>

      {/* Loading Skeleton */}
      {isLoading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="card skeleton" style={{ height: '140px' }} />
          <div className="card skeleton" style={{ height: '320px' }} />
        </div>
      )}

      {/* Error state */}
      {errorMsg && (
        <div
          className="card"
          style={{
            backgroundColor: 'rgba(194, 65, 75, 0.05)',
            borderColor: 'rgba(194, 65, 75, 0.25)',
            textAlign: 'center',
            padding: '3rem',
          }}
        >
          <AlertCircle size={36} color="var(--danger)" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            تعذر تحميل خطتك المخصصة
          </h3>
          <p style={{ color: 'var(--muted)', fontSize: '0.92rem', marginBottom: '1.5rem' }}>
            {errorMsg}
          </p>
          <button
            onClick={() => onNavigate('onboarding')}
            className="btn btn-primary btn-sm"
            style={{ margin: '0 auto' }}
          >
            إعادة تعبئة الملف الشخصي
          </button>
        </div>
      )}

      {/* Core Categorized Journey Content */}
      {!isLoading && !errorMsg && data && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
          {/* 1. افعل أولاً (DO FIRST) */}
          <section>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                marginBottom: '1.25rem',
              }}
            >
              <div
                style={{
                  backgroundColor: 'var(--accent)',
                  color: '#fff',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  padding: '0.3rem 0.85rem',
                  borderRadius: 'var(--radius-full)',
                }}
              >
                افعل أولاً
              </div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--foreground)' }}>
                الأولويات والمعاملات الأساسية
              </h2>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '1.25rem',
              }}
            >
              {data.resources.slice(0, 3).map((res) => (
                <div
                  key={res.id}
                  className="card"
                  style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span className="badge badge-accent">دليل عملي</span>
                      {res.isVerified && (
                        <span className="badge badge-success">موثّق</span>
                      )}
                    </div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                      {res.title}
                    </h3>
                    <p style={{ fontSize: '0.88rem', color: 'var(--muted)', lineHeight: 1.5, marginBottom: '1rem' }}>
                      {res.description}
                    </p>
                  </div>
                  <a
                    href={res.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary btn-sm"
                    style={{ gap: '0.35rem', alignSelf: 'flex-start' }}
                  >
                    <span>فتح الدليل</span>
                    <ExternalLink size={14} />
                  </a>
                </div>
              ))}
            </div>
          </section>

          {/* 2. تواصل (CONNECT) — Top Scored Communities */}
          <section>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1.25rem',
                flexWrap: 'wrap',
                gap: '0.75rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div
                  style={{
                    backgroundColor: 'var(--primary)',
                    color: '#fff',
                    fontWeight: 800,
                    fontSize: '0.85rem',
                    padding: '0.3rem 0.85rem',
                    borderRadius: 'var(--radius-full)',
                  }}
                >
                  تواصل
                </div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--foreground)' }}>
                  المجتمعات الأقرب لملفك واهتماماتك
                </h2>
              </div>
              <button
                onClick={() => onNavigate('communities')}
                className="btn btn-ghost btn-sm"
                style={{ color: 'var(--primary)', gap: '0.3rem' }}
              >
                <span>استكشاف كل المجتمعات</span>
                <ArrowLeft size={14} />
              </button>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '1.5rem',
              }}
            >
              {data.communities.map((comm) => (
                <CommunityCard
                  key={comm.id}
                  community={comm}
                  score={comm.score}
                  onViewDetails={(id) => onNavigate('community-detail', id)}
                  onWhyThis={(community) => setActiveWhyCommunity(community)}
                />
              ))}
            </div>
          </section>

          {/* 3. تطور (DEVELOP) — Opportunities & Career Growth */}
          {data.opportunities.length > 0 && (
            <section>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  marginBottom: '1.25rem',
                }}
              >
                <div
                  style={{
                    backgroundColor: 'var(--foreground)',
                    color: '#fff',
                    fontWeight: 800,
                    fontSize: '0.85rem',
                    padding: '0.3rem 0.85rem',
                    borderRadius: 'var(--radius-full)',
                  }}
                >
                  تطور
                </div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--foreground)' }}>
                  فرص تدريب ومبادرات طلابية ذات صلة
                </h2>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
                  gap: '1.25rem',
                }}
              >
                {data.opportunities.map((opp) => (
                  <div
                    key={opp.id}
                    className="card"
                    style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span className="badge badge-primary">{opp.type}</span>
                        <span className="badge badge-muted">{opp.organizationName}</span>
                      </div>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                        {opp.title}
                      </h3>
                      <p style={{ fontSize: '0.88rem', color: 'var(--muted)', lineHeight: 1.5, marginBottom: '0.85rem' }}>
                        {opp.description}
                      </p>
                      {opp.requirements && (
                        <p style={{ fontSize: '0.8rem', color: 'var(--muted-light)', marginBottom: '1rem' }}>
                          <strong>الشروط:</strong> {opp.requirements}
                        </p>
                      )}
                    </div>
                    {opp.applicationUrl && (
                      <a
                        href={opp.applicationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-secondary btn-sm"
                        style={{ gap: '0.35rem', alignSelf: 'flex-start' }}
                      >
                        <span>التقديم والمزيد</span>
                        <ExternalLink size={14} />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      )}

      {/* Why This Explanation Modal */}
      <WhyThisModal
        community={activeWhyCommunity}
        profile={profile}
        isOpen={!!activeWhyCommunity}
        onClose={() => setActiveWhyCommunity(null)}
        onOpenCommunity={(id) => onNavigate('community-detail', id)}
      />
    </div>
  )
}

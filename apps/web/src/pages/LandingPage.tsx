import React, { useEffect, useState } from 'react'
import { ArrowLeft, CheckCircle2, Users, Compass, BookOpen, ShieldCheck, Sparkles } from 'lucide-react'
import { communitiesApi, type ApiCommunity } from '../lib/api'
import { CommunityCard } from '../components/community/CommunityCard'

import { SEEDED_COMMUNITIES_PREVIEW } from '../lib/seededFallback'

interface LandingPageProps {
  onNavigate: (tab: string, param?: string) => void
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  // Initialize immediately with the real seeded communities so load time is 0ms
  const [featured, setFeatured] = useState<ApiCommunity[]>(SEEDED_COMMUNITIES_PREVIEW)
  const [totalCommunities, setTotalCommunities] = useState<number>(15)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  useEffect(() => {
    async function loadFeatured() {
      try {
        const res = await communitiesApi.list({ limit: 3 })
        if (res.data && res.data.length > 0) {
          setFeatured(res.data)
        }
        if (res.meta?.total) setTotalCommunities(res.meta.total)
      } catch (err) {
        console.error('Failed to load live featured communities:', err)
      }
    }
    loadFeatured()
  }, [])

  const steps = [
    {
      num: '١',
      title: 'طالب جديد',
      desc: 'وصلت حديثاً إلى تركيا وتبحث عن نقطة انطلاق واضحة دون تشتت.',
    },
    {
      num: '٢',
      title: 'ملفك واهتماماتك',
      desc: 'تحدد مدينتك، مستواك في التركية، وتخصصك وما تبحث عنه بالتحديد.',
    },
    {
      num: '٣',
      title: 'خطوات مخصصة لك',
      desc: 'خريطة طريق واضحة تقسم أولوياتك بين الأوراق الرسمية والاندماج.',
    },
    {
      num: '٤',
      title: 'مجتمعات حقيقية',
      desc: 'اقتراحات لمجموعات طلابية ومهنية تناسب ملفك مع أسباب التوصية.',
    },
    {
      num: '٥',
      title: 'تواصل وانضمام',
      desc: 'روابط مباشرة وتواصل فوري مع زملائك من أول أسبوع.',
    },
  ]

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section
        style={{
          paddingBlock: '4rem 3.5rem',
          textAlign: 'center',
          position: 'relative',
        }}
      >
        <div className="container" style={{ maxWidth: '820px' }}>
          {/* Top Pill Tag */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              backgroundColor: 'var(--surface)',
              border: '1px solid var(--border)',
              padding: '0.35rem 0.95rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.85rem',
              fontWeight: 600,
              color: 'var(--primary)',
              boxShadow: 'var(--shadow-sm)',
              marginBottom: '1.5rem',
            }}
          >
            <Sparkles size={15} />
            <span>من طالب جديد إلى مجتمع متصل</span>
          </div>

          {/* Main Title */}
          <h1
            style={{
              fontSize: 'clamp(2.1rem, 5vw, 3.25rem)',
              fontWeight: 800,
              lineHeight: 1.25,
              color: 'var(--foreground)',
              marginBottom: '1.25rem',
              letterSpacing: '-0.02em',
            }}
          >
            اعرف خطوتك القادمة.
            <br />
            <span style={{ color: 'var(--primary)' }}>واكتشف المجتمعات</span> التي يمكنها مساعدتك.
          </h1>

          {/* Subtitle */}
          <p
            style={{
              fontSize: '1.15rem',
              color: 'var(--muted)',
              lineHeight: 1.65,
              marginBottom: '2.25rem',
              maxWidth: '680px',
              marginInline: 'auto',
            }}
          >
            المنصة الأولى الموجهة للطلاب العرب في تركيا. نساعدك على تنظيم بدايتك، معرفة أين تذهب أولاً،
            والارتباط بأشخاص يشاركونك تخصصك واهتماماتك.
          </p>

          {/* Action CTAs */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1rem',
              flexWrap: 'wrap',
            }}
          >
            <button
              onClick={() => onNavigate('onboarding')}
              className="btn btn-primary btn-lg"
              style={{ boxShadow: '0 4px 16px rgba(15, 118, 110, 0.28)' }}
            >
              <span>أنشئ خطتي المخصصة</span>
              <ArrowLeft size={18} />
            </button>

            <button
              onClick={() => onNavigate('communities')}
              className="btn btn-secondary btn-lg"
            >
              <Compass size={18} />
              <span>استكشف المجتمعات ({totalCommunities})</span>
            </button>
          </div>

          {/* Trust points */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1.5rem',
              marginTop: '2.5rem',
              fontSize: '0.86rem',
              color: 'var(--muted)',
              flexWrap: 'wrap',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <CheckCircle2 size={16} color="var(--primary)" />
              <span>بيانات ومجتمعات موثوقة</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <CheckCircle2 size={16} color="var(--primary)" />
              <span>خطة مخصصة لمرحلتك الحالية</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <CheckCircle2 size={16} color="var(--primary)" />
              <span>مجاني بالكامل للطلاب</span>
            </div>
          </div>
        </div>
      </section>

      {/* Visual Journey Roadmap */}
      <section
        style={{
          paddingBlock: '3.5rem',
          backgroundColor: 'var(--surface)',
          borderBlock: '1px solid var(--border)',
        }}
      >
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '2.75rem' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--primary)' }}>
              رحلة واضحة من اليوم الأول
            </span>
            <h2 style={{ fontSize: '1.85rem', fontWeight: 700, marginTop: '0.3rem' }}>
              كيف يعمل دليل «وصل» معك؟
            </h2>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1.25rem',
            }}
          >
            {steps.map((step, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: 'var(--bg)',
                  padding: '1.35rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.65rem',
                  position: 'relative',
                }}
              >
                <div
                  style={{
                    width: '2.2rem',
                    height: '2.2rem',
                    borderRadius: '50%',
                    backgroundColor: 'var(--primary)',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '1rem',
                  }}
                >
                  {step.num}
                </div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--foreground)' }}>
                  {step.title}
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--muted)', lineHeight: 1.5 }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Live Communities from DB */}
      <section style={{ paddingBlock: '4rem' }}>
        <div className="container">
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              marginBottom: '2rem',
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            <div>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--primary)' }}>
                مجتمعات نشطة في تركيا
              </span>
              <h2 style={{ fontSize: '1.85rem', fontWeight: 700, marginTop: '0.25rem' }}>
                نماذج من المجتمعات المسجلة
              </h2>
            </div>
            <button
              onClick={() => onNavigate('communities')}
              className="btn btn-secondary btn-sm"
              style={{ gap: '0.35rem' }}
            >
              <span>عرض كل المجتمعات ({totalCommunities})</span>
              <ArrowLeft size={15} />
            </button>
          </div>

          {isLoading ? (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '1.5rem',
              }}
            >
              {[1, 2, 3].map((n) => (
                <div key={n} className="card skeleton" style={{ height: '240px' }} />
              ))}
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '1.5rem',
              }}
            >
              {featured.map((comm) => (
                <CommunityCard
                  key={comm.id}
                  community={comm}
                  onViewDetails={(id) => onNavigate('community-detail', id)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section
        style={{
          paddingBlock: '3.5rem',
          backgroundColor: 'var(--primary)',
          color: '#FFFFFF',
          textAlign: 'center',
        }}
      >
        <div className="container" style={{ maxWidth: '650px' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.85rem' }}>
            جاهز لتبدأ تجربتك دون حيرة؟
          </h2>
          <p style={{ fontSize: '1.05rem', opacity: 0.9, marginBottom: '1.75rem', lineHeight: 1.6 }}>
            أجب على بضعة أسئلة بسيطة وسيقوم محرك التوصيات بإعداد خطتك واختيار المجتمعات المناسبة لك مباشرة.
          </p>
          <button
            onClick={() => onNavigate('onboarding')}
            className="btn btn-accent btn-lg"
            style={{ color: '#fff', fontWeight: 700 }}
          >
            <span>ابدأ الآن - أنشئ خطتي</span>
            <ArrowLeft size={18} />
          </button>
        </div>
      </section>
    </div>
  )
}

import React, { useEffect, useState } from 'react'
import {
  ArrowRight,
  ShieldCheck,
  Users,
  ExternalLink,
  Mail,
  Globe,
  Calendar,
  Languages,
  Sparkles,
  AlertCircle,
  MessageCircle,
  CheckCircle2,
  Share2,
  BookOpen,
  MapPin,
  Clock,
  HeartHandshake,
} from 'lucide-react'
import { communitiesApi, type ApiCommunity } from '../lib/api'
import { useAuth } from '../context/AuthContext'
import { translate } from '../lib/translations'

import { SEEDED_COMMUNITIES_BY_ID } from '../lib/seededFallback'
import { communityStore } from '../lib/communityStore'

interface CommunityDetailPageProps {
  communityId: string
  onBack: () => void
}

export const CommunityDetailPage: React.FC<CommunityDetailPageProps> = ({
  communityId,
  onBack,
}) => {
  const { profile } = useAuth()
  
  // Instant 0ms prewarmed render from preloaded database seeds
  const [community, setCommunity] = useState<ApiCommunity | null>(() => {
    return SEEDED_COMMUNITIES_BY_ID.get(communityId) || null
  })
  const [isLoading, setIsLoading] = useState<boolean>(!community)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [copied, setCopied] = useState<boolean>(false)

  useEffect(() => {
    async function load() {
      // If we don't have community prewarmed, show skeleton
      if (!community) {
        setIsLoading(true)
      }
      setErrorMsg(null)
      try {
        const data = await communitiesApi.getById(communityId)
        if (data) {
          setCommunity(data)
        }
      } catch (err: any) {
        console.error('Failed to load community details:', err)
        // If we already have fallback data, do NOT show error
        if (!community) {
          const fallback = SEEDED_COMMUNITIES_BY_ID.get(communityId)
          if (fallback) {
            setCommunity(fallback)
          } else {
            setErrorMsg('تعذر العثور على المجتمع المطلوب.')
          }
        }
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [communityId])

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    }
  }

  if (isLoading && !community) {
    return (
      <div className="container" style={{ maxWidth: '960px', paddingBlock: '3rem' }}>
        <div className="card skeleton" style={{ height: '240px', marginBottom: '1.5rem', borderRadius: 'var(--radius-lg)' }} />
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
          <div className="card skeleton" style={{ height: '380px', borderRadius: 'var(--radius-md)' }} />
          <div className="card skeleton" style={{ height: '380px', borderRadius: 'var(--radius-md)' }} />
        </div>
      </div>
    )
  }

  if (errorMsg || !community) {
    return (
      <div className="container" style={{ maxWidth: '600px', paddingBlock: '4rem', textAlign: 'center' }}>
        <div className="card" style={{ padding: '3rem' }}>
          <AlertCircle size={44} color="var(--danger)" style={{ margin: '0 auto 1.25rem' }} />
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            المجتمع غير موجود
          </h2>
          <p style={{ color: 'var(--muted)', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
            يبدو أن هذا المجتمع لم يعد متاحاً أو تم نقله.
          </p>
          <button onClick={onBack} className="btn btn-secondary btn-sm" style={{ margin: '0 auto' }}>
            العودة إلى المجتمعات
          </button>
        </div>
      </div>
    )
  }

  // Calculate matching overlap with user's profile
  const matchingLanguages = community.languages.filter((l) =>
    profile?.languages.includes(l.id) || profile?.languages.includes(l.code)
  )

  const matchingInterests = community.interests.filter((i) =>
    profile?.interests.includes(i.id) || profile?.interests.includes(i.name)
  )

  return (
    <div className="container animate-fade-in" style={{ maxWidth: '960px', paddingBlock: '2.5rem' }}>
      {/* Top Navigation Row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.5rem',
        }}
      >
        <button
          onClick={onBack}
          className="btn btn-ghost btn-sm"
          style={{ gap: '0.45rem', color: 'var(--muted)' }}
        >
          <ArrowRight size={16} />
          <span>العودة إلى دليل المجتمعات</span>
        </button>

        <button
          onClick={handleShare}
          className="btn btn-secondary btn-sm"
          style={{ gap: '0.45rem', fontSize: '0.85rem' }}
          title="مشاركة رابط المجتمع"
        >
          <Share2 size={14} />
          <span>{copied ? 'تم نسخ الرابط!' : 'مشاركة المجتمع'}</span>
        </button>
      </div>

      {/* Hero Header Card */}
      <div
        className="card"
        style={{
          padding: '2.5rem',
          marginBottom: '2rem',
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-md)',
          background: 'linear-gradient(to bottom right, var(--surface), var(--surface-hover))',
          borderRadius: 'var(--radius-lg)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Category & Verification Badges */}
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span className="badge badge-primary" style={{ fontSize: '0.88rem', padding: '0.35rem 0.85rem' }}>
              {translate(community.category?.name)}
            </span>
            {community.isVerified ? (
              <span className="badge badge-success" style={{ fontSize: '0.82rem', gap: '0.35rem' }}>
                <ShieldCheck size={15} />
                <span>مجتمع موثّق رسمياً</span>
              </span>
            ) : (
              <span className="badge badge-muted">قيد المراجعة</span>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            {community.memberCount && (
              <span className="badge badge-muted" style={{ gap: '0.35rem', fontSize: '0.85rem' }}>
                <Users size={15} />
                <span>{community.memberCount.toLocaleString()} عضو مسجّل</span>
              </span>
            )}
            <span className="badge badge-muted" style={{ gap: '0.35rem', fontSize: '0.85rem' }}>
              <MapPin size={15} />
              <span>تركيا (حضوري ورقمي)</span>
            </span>
          </div>
        </div>

        {/* Community Name */}
        <h1
          style={{
            fontSize: 'clamp(1.85rem, 4vw, 2.5rem)',
            fontWeight: 800,
            color: 'var(--foreground)',
            marginBottom: '1rem',
            lineHeight: 1.25,
          }}
        >
          {community.name}
        </h1>

        {/* Full Overview Description */}
        <p
          style={{
            fontSize: '1.1rem',
            color: 'var(--muted)',
            lineHeight: 1.75,
            marginBottom: '2rem',
            maxWidth: '820px',
          }}
        >
          {community.description}
        </p>

        {/* Main Action Bar */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            backgroundColor: 'var(--bg)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1.25rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                backgroundColor: 'var(--primary-light)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <MessageCircle size={22} />
            </div>
            <div>
              <div style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--foreground)' }}>
                الانضمام المباشر للمجتمع
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>
                رابط رسمي موثّق للتواصل المباشر والانضمام لمجموعات النقاش والفعاليات
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            {community.joinUrl && (
              <a
                href={community.joinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary btn-lg"
                style={{ gap: '0.5rem', fontWeight: 700 }}
              >
                <span>الانضمام الآن مجاناً</span>
                <ExternalLink size={18} />
              </a>
            )}
            {community.websiteUrl && (
              <a
                href={community.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary btn-lg"
                style={{ gap: '0.5rem' }}
              >
                <Globe size={18} />
                <span>الموقع الإلكتروني</span>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Main Grid: Details, Activities, Verification & Match Breakdown */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.75rem',
          marginBottom: '2rem',
        }}
      >
        {/* Column 1: Core Community Information */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          {/* About & Mission */}
          <div className="card" style={{ padding: '1.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <BookOpen size={20} color="var(--primary)" />
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>عن المجتمع ورسالته</h3>
            </div>
            <p style={{ color: 'var(--muted)', fontSize: '0.94rem', lineHeight: 1.7, marginBottom: '1.25rem' }}>
              يهدف هذا المجتمع إلى دعم ومساندة الطلاب والأفراد الناطقين بالعربية في تركيا لتسهيل مرحلة الاستقرار،
              بناء الصداقات المفيدة، وتبادل الخبرات الأكاديمية والعملية في بيئة آمنة وتشاركية.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.88rem' }}>
                <CheckCircle2 size={16} color="var(--success)" />
                <span>مناقشات تفاعلية مستمرة واستفسارات فورية</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.88rem' }}>
                <CheckCircle2 size={16} color="var(--success)" />
                <span>لقاءات دورية وورش عمل تخصصية</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.88rem' }}>
                <CheckCircle2 size={16} color="var(--success)" />
                <span>بيئة ترحيبية بالقادمين الجدد وتقديم النصح المجرب</span>
              </div>
            </div>
          </div>

          {/* Target Audience & Interests */}
          <div className="card" style={{ padding: '1.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <HeartHandshake size={20} color="var(--primary)" />
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>الفئة المستهدفة والمجالات</h3>
            </div>

            <p style={{ color: 'var(--muted)', fontSize: '0.92rem', marginBottom: '1rem' }}>
              المجالات والاهتمامات الأساسية التي يركز عليها هذا المجتمع:
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
              {community.interests.map((interest) => (
                <span
                  key={interest.id}
                  className="badge badge-secondary"
                  style={{ fontSize: '0.85rem', padding: '0.35rem 0.75rem' }}
                >
                  #{translate(interest.name)}
                </span>
              ))}
            </div>

            <div
              style={{
                backgroundColor: 'var(--surface-hover)',
                padding: '1rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border)',
                fontSize: '0.88rem',
                color: 'var(--muted)',
                lineHeight: 1.6,
              }}
            >
              💡 <strong>لمن هذا المجتمع؟</strong> مخصص لجميع الطلاب الجدد، المقيمين الباحثين عن فرص عمل أو شبكة علاقات،
              والمهتمين بالتطوير الشخصي والمهني في تركيا.
            </div>
          </div>
        </div>

        {/* Column 2: Compatibility Analysis & Contact Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          {/* Personalized Compatibility Match */}
          <div
            className="card"
            style={{
              padding: '1.75rem',
              border: '1px solid var(--border)',
              background: 'linear-gradient(to bottom, var(--surface), var(--bg))',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <Sparkles size={20} color="var(--accent)" />
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>تحليل التوافق مع ملفك</h3>
            </div>

            <p style={{ fontSize: '0.9rem', color: 'var(--muted)', marginBottom: '1.25rem', lineHeight: 1.6 }}>
              يقوم نظام التوافق الذكي في «وصل» بتحليل اهتماماتك ولغاتك مع بيانات المجتمع لضمان أفضل فائدة:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div
                style={{
                  padding: '0.85rem',
                  backgroundColor: 'var(--surface)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--foreground)', marginBottom: '0.25rem' }}>
                  اللغات المشتركة:
                </div>
                <div style={{ fontSize: '0.88rem', color: 'var(--primary)' }}>
                  {matchingLanguages.length > 0
                    ? matchingLanguages.map((l) => translate(l.name)).join('، ')
                    : 'يدعم اللغات الإقليمية الشائعة (العربية / الإنجليزية / التركية)'}
                </div>
              </div>

              <div
                style={{
                  padding: '0.85rem',
                  backgroundColor: 'var(--surface)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--foreground)', marginBottom: '0.25rem' }}>
                  الاهتمامات المتقاطعة:
                </div>
                <div style={{ fontSize: '0.88rem', color: 'var(--accent)' }}>
                  {matchingInterests.length > 0
                    ? matchingInterests.map((i) => translate(i.name)).join('، ')
                    : 'يتطابق مع احتياجات الاستقرار والاندماج العام'}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--muted)' }}>
                <Clock size={15} />
                <span>تحديثات وتفاعل يومي نشط</span>
              </div>

              {/* AI Advice Button */}
              <button
                onClick={() => {
                  window.dispatchEvent(
                    new CustomEvent('open_ai_chat', {
                      detail: {
                        query: `أنا مهتم بمجتمع "${community.name}". كيف أستفيد منه بأفضل شكل وكيف يساعدني في تحقيق أهدافي ودراستي في تركيا؟`,
                      },
                    })
                  )
                }}
                className="btn btn-secondary btn-sm"
                style={{
                  marginTop: '0.5rem',
                  gap: '0.45rem',
                  borderColor: 'var(--accent)',
                  color: 'var(--accent)',
                  justifyContent: 'center',
                }}
              >
                <Sparkles size={15} />
                <span>استشر الذكاء الاصطناعي حول هذا المجتمع</span>
              </button>
            </div>
          </div>

          {/* Official Verification & Contact Info */}
          <div className="card" style={{ padding: '1.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <ShieldCheck size={20} color="var(--primary)" />
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>بيانات التحقق والتواصل</h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.9rem' }}>
              {community.websiteUrl && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Globe size={16} />
                    <span>الموقع الرسمي:</span>
                  </span>
                  <a
                    href={community.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: 'var(--primary)', fontWeight: 600, direction: 'ltr' }}
                  >
                    {community.websiteUrl.replace('https://', '')}
                  </a>
                </div>
              )}

              {community.contactEmail && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Mail size={16} />
                    <span>البريد المعتمد:</span>
                  </span>
                  <a
                    href={`mailto:${community.contactEmail}`}
                    style={{ color: 'var(--foreground)', direction: 'ltr' }}
                  >
                    {community.contactEmail}
                  </a>
                </div>
              )}

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Languages size={16} />
                  <span>اللغات المعتمدة:</span>
                </span>
                <span style={{ fontWeight: 600 }}>
                  {community.languages.map((l) => translate(l.name)).join('، ')}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Calendar size={16} />
                  <span>تاريخ الاعتماد:</span>
                </span>
                <span style={{ color: 'var(--muted)' }}>
                  {new Date(community.createdAt).toLocaleDateString('ar-EG', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Activities & Events Section */}
      <div style={{ marginTop: '3rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <Calendar size={22} color="var(--primary)" />
              <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--foreground)' }}>
                الفعاليات والأنشطة القادمة لهذا المجتمع
              </h2>
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--muted)' }}>
              لقاءات دورية وورش عمل تفاعلية مفتوحة لانضمام ومشاركة الطلاب
            </p>
          </div>

          <span className="badge badge-primary" style={{ padding: '0.35rem 0.85rem', fontSize: '0.85rem' }}>
            {communityStore.getPublishedActivities(community.id).length} فعاليات مجدولة
          </span>
        </div>

        {communityStore.getPublishedActivities(community.id).length === 0 ? (
          <div
            className="card"
            style={{
              padding: '2.5rem 1.5rem',
              textAlign: 'center',
              backgroundColor: 'var(--surface)',
              border: '1px dashed var(--border)',
            }}
          >
            <Calendar size={36} color="var(--muted)" style={{ margin: '0 auto 0.75rem', opacity: 0.6 }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.35rem' }}>
              لا توجد فعاليات معلنة حالياً
            </h3>
            <p style={{ color: 'var(--muted)', fontSize: '0.88rem', maxWidth: '420px', marginInline: 'auto' }}>
              لم يعلن هذا المجتمع عن فعاليات قادمة في الوقت الحالي. يمكنك الانضمام مباشرة إلى مجموعة المحادثة الرسمية للمجتمع لمعرفة المواعيد الجديدة فور صدورها.
            </p>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
              gap: '1.25rem',
            }}
          >
            {communityStore.getPublishedActivities(community.id).map((act) => (
              <div
                key={act.id}
                className="card"
                style={{
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  border: '1px solid var(--border)',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
                    <span className="badge badge-accent" style={{ fontSize: '0.82rem' }}>
                      {act.activityType}
                    </span>
                    {act.isNewcomerFriendly && (
                      <span className="badge badge-success" style={{ fontSize: '0.78rem' }}>
                        مرحب بالمستجدين
                      </span>
                    )}
                  </div>

                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--foreground)', marginBottom: '0.5rem', lineHeight: 1.4 }}>
                    {act.title}
                  </h3>

                  <p style={{ fontSize: '0.88rem', color: 'var(--muted)', lineHeight: 1.6, marginBottom: '1rem' }}>
                    {act.description}
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '0.84rem', color: 'var(--muted)', marginBottom: '1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Calendar size={15} color="var(--primary)" />
                      <span>{act.date} ({act.startTime} {act.endTime ? `- ${act.endTime}` : ''})</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <MapPin size={15} color="var(--primary)" />
                      <span>{act.location}</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Languages size={15} color="var(--primary)" />
                      <span>اللغة: {act.language}</span>
                    </div>
                  </div>
                </div>

                <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
                  {act.registrationUrl ? (
                    <a
                      href={act.registrationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary btn-sm"
                      style={{ width: '100%', justifyContent: 'center', gap: '0.4rem' }}
                    >
                      <span>التسجيل / حضور الفعالية</span>
                      <ExternalLink size={14} />
                    </a>
                  ) : (
                    <span className="badge badge-muted" style={{ display: 'block', textAlign: 'center' }}>
                      حضور مباشر ومجاني
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

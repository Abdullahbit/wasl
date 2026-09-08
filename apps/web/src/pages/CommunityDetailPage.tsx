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
} from 'lucide-react'
import { communitiesApi, type ApiCommunity } from '../lib/api'
import { useAuth } from '../context/AuthContext'
import { translate } from '../lib/translations'

interface CommunityDetailPageProps {
  communityId: string
  onBack: () => void
}

export const CommunityDetailPage: React.FC<CommunityDetailPageProps> = ({
  communityId,
  onBack,
}) => {
  const { profile } = useAuth()
  const [community, setCommunity] = useState<ApiCommunity | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      setIsLoading(true)
      setErrorMsg(null)
      try {
        const data = await communitiesApi.getById(communityId)
        setCommunity(data)
      } catch (err: any) {
        console.error('Failed to load community details:', err)
        setErrorMsg('تعذر العثور على المجتمع المطلوب.')
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [communityId])

  if (isLoading) {
    return (
      <div className="container" style={{ maxWidth: '800px', paddingBlock: '3rem' }}>
        <div className="card skeleton" style={{ height: '360px' }} />
      </div>
    )
  }

  if (errorMsg || !community) {
    return (
      <div className="container" style={{ maxWidth: '600px', paddingBlock: '4rem', textAlign: 'center' }}>
        <div className="card" style={{ padding: '3rem' }}>
          <AlertCircle size={40} color="var(--danger)" style={{ margin: '0 auto 1rem' }} />
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
    <div className="container animate-fade-in" style={{ maxWidth: '880px', paddingBlock: '2.5rem' }}>
      {/* Back Button */}
      <button
        onClick={onBack}
        className="btn btn-ghost btn-sm"
        style={{ marginBottom: '1.5rem', gap: '0.35rem', color: 'var(--muted)' }}
      >
        <ArrowRight size={16} />
        <span>العودة للمجتمعات</span>
      </button>

      {/* Main Profile Header Card */}
      <div
        className="card"
        style={{
          padding: '2.25rem',
          marginBottom: '2rem',
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        {/* Category & Verified Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1rem',
            flexWrap: 'wrap',
            gap: '0.5rem',
          }}
        >
          <span className="badge badge-primary" style={{ fontSize: '0.85rem' }}>
            {translate(community.category?.name)}
          </span>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {community.isVerified ? (
              <span className="badge badge-success">
                <ShieldCheck size={14} />
                <span>مجتمع موثّق</span>
              </span>
            ) : (
              <span className="badge badge-muted">قيد المراجعة</span>
            )}
            {community.memberCount && (
              <span className="badge badge-muted">
                <Users size={14} />
                <span>{community.memberCount.toLocaleString()} عضو</span>
              </span>
            )}
          </div>
        </div>

        {/* Community Name */}
        <h1
          style={{
            fontSize: 'clamp(1.75rem, 4vw, 2.35rem)',
            fontWeight: 800,
            color: 'var(--foreground)',
            marginBottom: '1rem',
            lineHeight: 1.3,
          }}
        >
          {community.name}
        </h1>

        {/* Full Description */}
        <p
          style={{
            fontSize: '1.05rem',
            color: 'var(--muted)',
            lineHeight: 1.7,
            marginBottom: '2rem',
          }}
        >
          {community.description}
        </p>

        {/* Primary CTA: Join / Visit */}
        {community.joinUrl && (
          <div
            style={{
              padding: '1.25rem',
              backgroundColor: 'var(--bg)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            <div>
              <span style={{ fontSize: '0.92rem', fontWeight: 700, display: 'block', color: 'var(--foreground)' }}>
                الانضمام والتواصل مع الأعضاء
              </span>
              <span style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>
                رابط مباشر إلى مجموعة المحادثة أو بوابة المجتمع الرسمية
              </span>
            </div>

            <a
              href={community.joinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary btn-lg"
              style={{ gap: '0.45rem' }}
            >
              <span>انضم / زيارة المجتمع</span>
              <ExternalLink size={18} />
            </a>
          </div>
        )}
      </div>

      {/* Grid: Why Recommended & Metadata */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.5rem',
        }}
      >
        {/* Why this matches you */}
        <div className="card" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '1.25rem' }}>
            <Sparkles size={18} color="var(--primary)" />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>
              سبب التوافق مع ملفك
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div style={{ fontSize: '0.9rem', color: 'var(--muted)', lineHeight: 1.5 }}>
              ✓ <strong>اللغات المشتركة:</strong>{' '}
              {matchingLanguages.length > 0
                ? matchingLanguages.map((l) => translate(l.name)).join('، ')
                : 'يدعم اللغات الإقليمية'}
            </div>

            <div style={{ fontSize: '0.9rem', color: 'var(--muted)', lineHeight: 1.5 }}>
              ✓ <strong>الاهتمامات المتقاطعة:</strong>{' '}
              {matchingInterests.length > 0
                ? matchingInterests.map((i) => translate(i.name)).join('، ')
                : 'مناسب لجميع القادمين الجدد'}
            </div>

            <div style={{ fontSize: '0.9rem', color: 'var(--muted)', lineHeight: 1.5 }}>
              ✓ <strong>المستوى والبيئة:</strong> يتيح لك التواصل المباشر وطرح استفساراتك اليومية دون قيود.
            </div>
          </div>
        </div>

        {/* Community Technical Details */}
        <div className="card" style={{ padding: '1.75rem' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1.25rem' }}>
            تفاصيل وبيانات المجتمع
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.9rem' }}>
            {community.websiteUrl && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Globe size={16} color="var(--muted)" />
                <span style={{ color: 'var(--muted)' }}>الموقع:</span>
                <a
                  href={community.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'var(--primary)', direction: 'ltr' }}
                >
                  {community.websiteUrl.replace('https://', '')}
                </a>
              </div>
            )}

            {community.contactEmail && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Mail size={16} color="var(--muted)" />
                <span style={{ color: 'var(--muted)' }}>البريد:</span>
                <span style={{ color: 'var(--foreground)', direction: 'ltr' }}>
                  {community.contactEmail}
                </span>
              </div>
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Languages size={16} color="var(--muted)" />
              <span style={{ color: 'var(--muted)' }}>اللغات:</span>
              <span>{community.languages.map((l) => translate(l.name)).join('، ')}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Calendar size={16} color="var(--muted)" />
              <span style={{ color: 'var(--muted)' }}>تاريخ التوثيق:</span>
              <span>{new Date(community.createdAt).toLocaleDateString('ar-EG')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

import React from 'react'
import { X, CheckCircle2, Shield, Languages, Sparkles } from 'lucide-react'
import type { ApiCommunity, ApiProfile } from '../../lib/api'
import { translate } from '../../lib/translations'

interface WhyThisModalProps {
  community: ApiCommunity | null
  profile: ApiProfile | null
  isOpen: boolean
  onClose: () => void
  onOpenCommunity: (id: string) => void
}

export const WhyThisModal: React.FC<WhyThisModalProps> = ({
  community,
  profile,
  isOpen,
  onClose,
  onOpenCommunity,
}) => {
  if (!isOpen || !community) return null

  // Compute real reasons based on actual matching data
  const reasons: { title: string; desc: string; icon: any }[] = []

  // 1. Language overlap
  const matchingLanguages = community.languages.filter((l) =>
    profile?.languages.includes(l.id) ||
    profile?.languages.includes(l.code) ||
    profile?.languages.includes(l.name)
  )

  if (matchingLanguages.length > 0) {
    reasons.push({
      title: 'توافق لغوي مباشر',
      desc: `يدعم المجتمع اللغات التي تفضلها (${matchingLanguages.map((l) => translate(l.name)).join('، ')})، مما يسهل تواصلك دون عوائق.`,
      icon: Languages,
    })
  }

  // 2. Interest overlap
  const matchingInterests = community.interests.filter((i) =>
    profile?.interests.includes(i.id) ||
    profile?.interests.includes(i.name) ||
    profile?.interests.includes(i.slug)
  )

  if (matchingInterests.length > 0) {
    reasons.push({
      title: 'اهتمامات مشتركة وأهداف متوافقة',
      desc: `يركز هذا المجتمع على مجالات توافق ما حددته في خطتك: (${matchingInterests.map((i) => translate(i.name)).join('، ')}).`,
      icon: Sparkles,
    })
  }

  // 3. Verification & Safety
  if (community.isVerified) {
    reasons.push({
      title: 'مجتمع موثوق ومعتمد',
      desc: 'تمت مراجعة نشاط هذا المجتمع والتحقق من مصداقيته ومناسبته للطلاب الجدد من قبل الإدارة.',
      icon: Shield,
    })
  }

  // 4. Member community support
  if (community.memberCount && community.memberCount > 100) {
    reasons.push({
      title: 'شبكة نشطة تضم طلاباً وخريجين',
      desc: `يضم أكثر من ${community.memberCount.toLocaleString()} عضو يشاركون تجاربهم، نصائحهم اليومية وفرص التعاون.`,
      icon: CheckCircle2,
    })
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        backgroundColor: 'rgba(0, 0, 0, 0.45)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.25rem',
      }}
      onClick={onClose}
    >
      <div
        className="animate-fade-in"
        style={{
          backgroundColor: 'var(--surface)',
          borderRadius: 'var(--radius-lg)',
          maxWidth: '540px',
          width: '100%',
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-lg)',
          overflow: 'hidden',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 700 }}>
              شفافية التوصية الذكية
            </span>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--foreground)' }}>
              لماذا نوصي بهذا المجتمع لك؟
            </h3>
          </div>
          <button
            onClick={onClose}
            style={{
              color: 'var(--muted)',
              padding: '0.4rem',
              borderRadius: '50%',
              display: 'flex',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Community Quick Preview */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            backgroundColor: 'var(--bg)',
            borderBottom: '1px solid var(--border-subtle)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700 }}>{community.name}</h4>
            <span className="badge badge-primary">{translate(community.category?.name)}</span>
          </div>
          <p style={{ fontSize: '0.86rem', color: 'var(--muted)', lineHeight: 1.5 }}>
            {community.description}
          </p>
        </div>

        {/* Matching Points List */}
        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <p style={{ fontSize: '0.9rem', color: 'var(--foreground)', fontWeight: 600 }}>
            وفقاً لملفك واحتياجاتك الحالية:
          </p>

          {reasons.length > 0 ? (
            reasons.map((r, idx) => {
              const Icon = r.icon
              return (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.85rem',
                    backgroundColor: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.9rem 1rem',
                  }}
                >
                  <div
                    style={{
                      width: '2rem',
                      height: '2rem',
                      borderRadius: '50%',
                      backgroundColor: 'var(--primary-light)',
                      color: 'var(--primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      marginTop: '2px',
                    }}
                  >
                    <Icon size={16} />
                  </div>
                  <div>
                    <h5 style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--foreground)', marginBottom: '0.2rem' }}>
                      {r.title}
                    </h5>
                    <p style={{ fontSize: '0.85rem', color: 'var(--muted)', lineHeight: 1.45 }}>
                      {r.desc}
                    </p>
                  </div>
                </div>
              )
            })
          ) : (
            <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--muted)', fontSize: '0.9rem' }}>
              تم اقتراح هذا المجتمع لأنه أحد المجتمعات الأكثر نشاطاً وترحيباً بالقادمين الجدد.
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div
          style={{
            padding: '1rem 1.5rem',
            borderTop: '1px solid var(--border)',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '0.75rem',
            backgroundColor: 'var(--bg)',
          }}
        >
          <button onClick={onClose} className="btn btn-secondary btn-sm">
            إغلاق
          </button>
          <button
            onClick={() => {
              onClose()
              onOpenCommunity(community.id)
            }}
            className="btn btn-primary btn-sm"
          >
            زيارة صفحة المجتمع
          </button>
        </div>
      </div>
    </div>
  )
}

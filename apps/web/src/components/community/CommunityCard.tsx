import React from 'react'
import { ShieldCheck, Users, ExternalLink, ArrowLeft, Languages } from 'lucide-react'
import type { ApiCommunity } from '../../lib/api'
import { translate } from '../../lib/translations'

interface CommunityCardProps {
  community: ApiCommunity
  score?: number
  onViewDetails: (id: string) => void
  onWhyThis?: (community: ApiCommunity) => void
}

export const CommunityCard: React.FC<CommunityCardProps> = ({
  community,
  score,
  onViewDetails,
  onWhyThis,
}) => {
  return (
    <div
      className="card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
        position: 'relative',
      }}
    >
      <div>
        {/* Top Header: Category & Badges */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '0.85rem',
            gap: '0.5rem',
          }}
        >
          <span className="badge badge-primary">
            {translate(community.category?.name || 'مجتمع')}
          </span>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            {community.isVerified && (
              <span className="badge badge-success" title="مجتمع تم التحقق منه وتوثيقه">
                <ShieldCheck size={13} />
                <span>موثّق</span>
              </span>
            )}
            {score !== undefined && (
              <span
                className="badge badge-accent"
                style={{ fontWeight: 700 }}
                title="نسبة التوافق مع ملفك واهتماماتك"
              >
                تطابق {score * 10}%
              </span>
            )}
          </div>
        </div>

        {/* Community Name */}
        <h3
          style={{
            fontSize: '1.2rem',
            fontWeight: 700,
            color: 'var(--foreground)',
            marginBottom: '0.5rem',
            lineHeight: 1.35,
          }}
        >
          {community.name}
        </h3>

        {/* Short Description */}
        <p
          style={{
            fontSize: '0.9rem',
            color: 'var(--muted)',
            lineHeight: 1.55,
            marginBottom: '1.1rem',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {community.description}
        </p>

        {/* Tags / Languages & Interests */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.35rem',
            marginBottom: '1.25rem',
          }}
        >
          {community.languages.map((l) => (
            <span
              key={l.id}
              className="badge badge-muted"
              style={{ fontSize: '0.74rem', padding: '0.15rem 0.5rem' }}
            >
              <Languages size={12} style={{ marginInlineEnd: '2px' }} />
              {translate(l.name)}
            </span>
          ))}

          {community.interests.slice(0, 3).map((i) => (
            <span
              key={i.id}
              className="badge badge-muted"
              style={{ fontSize: '0.74rem', padding: '0.15rem 0.5rem' }}
            >
              {translate(i.name)}
            </span>
          ))}
        </div>
      </div>

      {/* Footer Meta & Actions */}
      <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.9rem' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '0.85rem',
            fontSize: '0.82rem',
            color: 'var(--muted)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Users size={14} />
            <span>
              {community.memberCount ? `${community.memberCount.toLocaleString()} عضو` : 'مجتمع نشط'}
            </span>
          </div>

          {community.joinUrl && (
            <a
              href={community.joinUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem',
                color: 'var(--primary)',
                fontWeight: 600,
                fontSize: '0.82rem',
              }}
            >
              <span>رابط الانضمام</span>
              <ExternalLink size={13} />
            </a>
          )}
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => onViewDetails(community.id)}
            className="btn btn-secondary btn-sm"
            style={{ flex: 1 }}
          >
            <span>عرض المجتمع</span>
            <ArrowLeft size={14} />
          </button>

          {onWhyThis && (
            <button
              onClick={() => onWhyThis(community)}
              className="btn btn-ghost btn-sm"
              style={{
                backgroundColor: 'var(--primary-light)',
                color: 'var(--primary)',
                fontWeight: 600,
                fontSize: '0.82rem',
                paddingInline: '0.75rem',
              }}
            >
              لماذا هذا؟
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

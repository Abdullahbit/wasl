import React, { useState } from 'react'
import { User, MapPin, Languages, Sparkles, LogOut, RotateCcw, Check, CheckCircle2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { profileApi } from '../lib/api'
import { translate } from '../lib/translations'

interface ProfilePageProps {
  onNavigate: (tab: string, param?: string) => void
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ onNavigate }) => {
  const { user, profile, refreshProfile, logout } = useAuth()
  const [isResetting, setIsResetting] = useState<boolean>(false)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  const handleResetJourney = async () => {
    setIsResetting(true)
    try {
      // Re-initialize profile with default newcomer values
      await profileApi.update({
        currentCity: 'Istanbul',
        targetCountry: 'Turkey',
        originCountry: 'Syria',
        bio: 'طالب عربي جديد يبحث عن مجتمعات وزملاء دراسة في تركيا',
        languages: ['lang_arabic', 'lang_english'],
        interests: ['int_employment', 'int_networking', 'int_language_learning'],
        goals: 'الاندماج السريع وتكوين صداقات وممارسة اللغة التركية',
        immigrationStatus: 'STUDENT_VISA',
      })
      await refreshProfile()
      setSuccessMsg('تمت إعادة ضبط الملف الشخصي بنجاح!')
      setTimeout(() => setSuccessMsg(null), 3000)
    } catch (err) {
      console.error(err)
    } finally {
      setIsResetting(false)
    }
  }

  return (
    <div className="container animate-fade-in" style={{ maxWidth: '680px', paddingBlock: '2.5rem' }}>
      {/* Header Profile Card */}
      <div
        className="card"
        style={{
          padding: '2rem',
          marginBottom: '2rem',
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1.5rem' }}>
          <div
            style={{
              width: '4rem',
              height: '4rem',
              borderRadius: '50%',
              backgroundColor: 'var(--primary-light)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.75rem',
              fontWeight: 800,
            }}
          >
            {user?.name ? user.name.charAt(0) : 'ط'}
          </div>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--foreground)' }}>
              {user?.name || 'طالب جديد'}
            </h1>
            <p style={{ fontSize: '0.9rem', color: 'var(--muted)' }}>
              {user?.email || 'user@platform.test'}
            </p>
            <span className="badge badge-success" style={{ marginTop: '0.35rem' }}>
              حساب تجريبي موثق
            </span>
          </div>
        </div>

        {successMsg && (
          <div
            style={{
              padding: '0.75rem 1rem',
              backgroundColor: 'var(--success-light)',
              color: 'var(--success)',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.88rem',
              marginBottom: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
            }}
          >
            <CheckCircle2 size={16} />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Profile Attributes List */}
        <div
          style={{
            backgroundColor: 'var(--bg)',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            fontSize: '0.92rem',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--muted)', fontWeight: 600 }}>المدينة الحالية:</span>
            <span style={{ fontWeight: 700 }}>
              {profile?.currentCity ? translate(profile.currentCity) : 'إسطنبول'}
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--muted)', fontWeight: 600 }}>البلد المستهدف:</span>
            <span style={{ fontWeight: 700 }}>
              {profile?.targetCountry ? translate(profile.targetCountry) : 'تركيا'}
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--muted)', fontWeight: 600 }}>حالة الإقامة:</span>
            <span style={{ fontWeight: 700 }}>
              {translate(profile?.immigrationStatus || 'STUDENT_VISA')}
            </span>
          </div>

          <div>
            <span style={{ color: 'var(--muted)', fontWeight: 600, display: 'block', marginBottom: '0.4rem' }}>
              اللغات المختارة:
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
              {profile?.languages?.map((lang) => (
                <span key={lang} className="badge badge-muted">
                  {translate(lang)}
                </span>
              ))}
            </div>
          </div>

          <div>
            <span style={{ color: 'var(--muted)', fontWeight: 600, display: 'block', marginBottom: '0.4rem' }}>
              الاهتمامات المسجلة:
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
              {profile?.interests?.map((interest) => (
                <span key={interest} className="badge badge-primary">
                  {translate(interest)}
                </span>
              ))}
            </div>
          </div>

          {profile?.goals && (
            <div>
              <span style={{ color: 'var(--muted)', fontWeight: 600, display: 'block', marginBottom: '0.2rem' }}>
                الهدف الحالي:
              </span>
              <p style={{ color: 'var(--foreground)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                {profile.goals}
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '1.75rem',
            flexWrap: 'wrap',
            gap: '0.75rem',
          }}
        >
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => onNavigate('onboarding')}
              className="btn btn-primary btn-sm"
            >
              <span>تعديل الملف الشخصي</span>
            </button>
            <button
              onClick={handleResetJourney}
              disabled={isResetting}
              className="btn btn-secondary btn-sm"
              style={{ gap: '0.35rem' }}
            >
              <RotateCcw size={14} />
              <span>إعادة ضبط التجربة</span>
            </button>
          </div>

          <button
            onClick={async () => {
              await logout()
              onNavigate('landing')
            }}
            className="btn btn-ghost btn-sm"
            style={{ color: 'var(--danger)', gap: '0.35rem' }}
          >
            <LogOut size={14} />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </div>
    </div>
  )
}

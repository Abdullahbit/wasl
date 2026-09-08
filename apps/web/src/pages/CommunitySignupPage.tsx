import React, { useState } from 'react'
import {
  Users,
  GraduationCap,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Mail,
  Lock,
  Building2,
  ShieldCheck,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'

interface CommunitySignupPageProps {
  onSuccess: (targetTab: string) => void
  onCancel: () => void
}

export const CommunitySignupPage: React.FC<CommunitySignupPageProps> = ({
  onSuccess,
  onCancel,
}) => {
  const { loginAsCommunity, switchAccountType } = useAuth()
  const [selectedRole, setSelectedRole] = useState<'STUDENT' | 'COMMUNITY'>('COMMUNITY')
  const [name, setName] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !email.trim() || !password.trim()) {
      setError('يرجى ملء جميع الحقول المطلوبة للمتابعة.')
      return
    }

    setIsSubmitting(true)
    setError(null)
    try {
      if (selectedRole === 'COMMUNITY') {
        await loginAsCommunity(name, email)
        onSuccess('community-profile-setup')
      } else {
        switchAccountType('STUDENT')
        onSuccess('onboarding')
      }
    } catch (err: any) {
      setError(err.message || 'تعذر إنشاء الحساب، يرجى المحاولة مرة أخرى.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container animate-fade-in" style={{ maxWidth: '640px', paddingBlock: '3rem' }}>
      <button
        onClick={onCancel}
        className="btn btn-ghost btn-sm"
        style={{ marginBottom: '1.5rem', gap: '0.4rem', color: 'var(--muted)' }}
      >
        <ArrowRight size={16} />
        <span>العودة للرئيسية</span>
      </button>

      <div
        className="card"
        style={{
          padding: '2.5rem',
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-md)',
          borderRadius: 'var(--radius-lg)',
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              backgroundColor: 'var(--primary-light)',
              color: 'var(--primary)',
              padding: '0.35rem 0.9rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.84rem',
              fontWeight: 700,
              marginBottom: '0.85rem',
            }}
          >
            <Sparkles size={14} />
            <span>انضمام لمنظومة وصل</span>
          </div>

          <h1
            style={{
              fontSize: '1.85rem',
              fontWeight: 800,
              color: 'var(--foreground)',
              marginBottom: '0.5rem',
            }}
          >
            إنشاء حساب جديد
          </h1>
          <p style={{ fontSize: '0.94rem', color: 'var(--muted)', lineHeight: 1.6 }}>
            اختر نوع حسابك للبدء، سواء كنت طالباً تبحث عن الإرشاد أو مجتمعاً طلابياً/مهنياً يرغب في نشر أنشطته
          </p>
        </div>

        {/* Account Type Selector (Student vs Community) */}
        <div style={{ marginBottom: '2rem' }}>
          <label style={{ display: 'block', fontWeight: 700, fontSize: '0.92rem', marginBottom: '0.75rem' }}>
            نوع الحساب:
          </label>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {/* Community Choice (Recommended) */}
            <div
              onClick={() => setSelectedRole('COMMUNITY')}
              style={{
                border: selectedRole === 'COMMUNITY' ? '2px solid var(--primary)' : '1px solid var(--border)',
                backgroundColor: selectedRole === 'COMMUNITY' ? 'var(--primary-light)' : 'var(--surface)',
                borderRadius: 'var(--radius-md)',
                padding: '1.25rem',
                cursor: 'pointer',
                transition: 'all 0.18s ease',
                position: 'relative',
              }}
            >
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  backgroundColor: selectedRole === 'COMMUNITY' ? 'var(--primary)' : 'var(--surface-hover)',
                  color: selectedRole === 'COMMUNITY' ? '#fff' : 'var(--muted)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '0.75rem',
                }}
              >
                <Users size={20} />
              </div>
              <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--foreground)', marginBottom: '0.25rem' }}>
                حساب مجتمع
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--muted)', lineHeight: 1.45 }}>
                للأندية الطلابية، المجموعات التطوعية، والشبكات المهنية لنشر الفعاليات
              </div>
            </div>

            {/* Student Choice */}
            <div
              onClick={() => setSelectedRole('STUDENT')}
              style={{
                border: selectedRole === 'STUDENT' ? '2px solid var(--primary)' : '1px solid var(--border)',
                backgroundColor: selectedRole === 'STUDENT' ? 'var(--primary-light)' : 'var(--surface)',
                borderRadius: 'var(--radius-md)',
                padding: '1.25rem',
                cursor: 'pointer',
                transition: 'all 0.18s ease',
              }}
            >
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  backgroundColor: selectedRole === 'STUDENT' ? 'var(--primary)' : 'var(--surface-hover)',
                  color: selectedRole === 'STUDENT' ? '#fff' : 'var(--muted)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '0.75rem',
                }}
              >
                <GraduationCap size={20} />
              </div>
              <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--foreground)', marginBottom: '0.25rem' }}>
                حساب طالب
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--muted)', lineHeight: 1.45 }}>
                للقادمين الجدد والطلاب الباحثين عن التوجيه وخطة بداية مخصصة
              </div>
            </div>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div
            style={{
              padding: '0.75rem 1rem',
              backgroundColor: 'rgba(194, 65, 75, 0.08)',
              border: '1px solid rgba(194, 65, 75, 0.25)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--danger)',
              fontSize: '0.88rem',
              marginBottom: '1.5rem',
            }}
          >
            {error}
          </div>
        )}

        {/* Quick Demo Autofill Button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
          <button
            type="button"
            id="btn-quick-fill-community"
            onClick={() => {
              setSelectedRole('COMMUNITY')
              setName('نادي البرمجة والذكاء الاصطناعي')
              setEmail('tech-club@wasl-community.org')
              setPassword('CommunityPass2026!')
            }}
            style={{
              background: 'none',
              border: '1px dashed var(--primary)',
              borderRadius: 'var(--radius-sm)',
              padding: '0.35rem 0.75rem',
              color: 'var(--primary)',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
            }}
          >
            <Sparkles size={13} />
            <span>ملء بيانات تجريبية سريعة لمجتمع</span>
          </button>
        </div>

        {/* Signup Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, marginBottom: '0.4rem' }}>
              {selectedRole === 'COMMUNITY' ? 'اسم المجتمع أو النادي الطلابي' : 'الاسم الكامل'}
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={selectedRole === 'COMMUNITY' ? 'مثال: ملتقى المهندسين العرب في إسطنبول' : 'مثال: أحمد مصطفى'}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border)',
                backgroundColor: 'var(--bg)',
                fontSize: '0.92rem',
                outline: 'none',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, marginBottom: '0.4rem' }}>
              البريد الإلكتروني الرسمي
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@organization.org"
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border)',
                backgroundColor: 'var(--bg)',
                fontSize: '0.92rem',
                direction: 'ltr',
                outline: 'none',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, marginBottom: '0.4rem' }}>
              كلمة المرور
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border)',
                backgroundColor: 'var(--bg)',
                fontSize: '0.92rem',
                direction: 'ltr',
                outline: 'none',
              }}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-primary btn-lg"
            style={{ marginTop: '0.5rem', width: '100%', justifyContent: 'center', gap: '0.5rem' }}
          >
            <span>{isSubmitting ? 'جاري الإنشاء...' : selectedRole === 'COMMUNITY' ? 'متابعة وإعداد ملف المجتمع' : 'متابعة وإعداد خطتي'}</span>
            <ArrowLeft size={18} />
          </button>
        </form>
      </div>
    </div>
  )
}

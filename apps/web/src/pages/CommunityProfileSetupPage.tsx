import React, { useState } from 'react'
import {
  Users,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Building2,
  Globe,
  Mail,
  MapPin,
  CheckCircle2,
  AlertCircle,
  FileText,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { communityStore, type CommunityUserProfile } from '../lib/communityStore'

interface CommunityProfileSetupPageProps {
  onComplete: (tab: string) => void
  onCancel: () => void
}

const CATEGORIES = [
  { id: 'cat_student_community', name: 'مجتمع ونادي طلابي' },
  { id: 'cat_professional_development', name: 'تطوير مهني وفرص عمل' },
  { id: 'cat_social_integration', name: 'اندماج اجتماعي وثقافي' },
  { id: 'cat_immigration_support', name: 'دعم قانوني وهجرة' },
  { id: 'cat_language_exchange', name: 'تبادل لغات ومحادثة' },
]

const LANGUAGES_LIST = [
  { id: 'lang_arabic', name: 'العربية', code: 'ar' },
  { id: 'lang_turkish', name: 'التركية', code: 'tr' },
  { id: 'lang_english', name: 'الإنجليزية', code: 'en' },
]

const INTERESTS_LIST = [
  { id: 'int_education', name: 'التعليم والأكاديميا', slug: 'education' },
  { id: 'int_employment', name: 'التوظيف والمهنة', slug: 'employment' },
  { id: 'int_networking', name: 'الشبكات والتعارف', slug: 'networking' },
  { id: 'int_language_learning', name: 'تعلم اللغات', slug: 'language-learning' },
  { id: 'int_cultural_events', name: 'الفعاليات الثقافية', slug: 'cultural-events' },
  { id: 'int_legal_aid', name: 'المساعدة القانونية', slug: 'legal-aid' },
  { id: 'int_housing', name: 'السكن والمعيشة', slug: 'housing' },
]

export const CommunityProfileSetupPage: React.FC<CommunityProfileSetupPageProps> = ({
  onComplete,
  onCancel,
}) => {
  const { user, refreshCommunityProfile } = useAuth()

  const [communityName, setCommunityName] = useState<string>(user?.name || '')
  const [shortDescription, setShortDescription] = useState<string>('')
  const [fullDescription, setFullDescription] = useState<string>('')
  const [categoryId, setCategoryId] = useState<string>(CATEGORIES[0].id)
  const [universityAffiliation, setUniversityAffiliation] = useState<string>('')
  const [city, setCity] = useState<string>('إسطنبول')
  const [targetAudience, setTargetAudience] = useState<string>(
    'الطلاب العرب الجدد والمقيمون المهتمون بتطوير مهاراتهم في تركيا'
  )
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(['lang_arabic', 'lang_turkish'])
  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    'int_education',
    'int_networking',
  ])
  const [contactEmail, setContactEmail] = useState<string>(user?.email || '')
  const [websiteUrl, setWebsiteUrl] = useState<string>('')
  const [joinUrl, setJoinUrl] = useState<string>('')
  const [isNewcomerFriendly, setIsNewcomerFriendly] = useState<boolean>(true)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const toggleLanguage = (id: string) => {
    setSelectedLanguages((prev) =>
      prev.includes(id) ? prev.filter((l) => l !== id) : [...prev, id]
    )
  }

  const toggleInterest = (id: string) => {
    setSelectedInterests((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!communityName.trim() || !shortDescription.trim() || !fullDescription.trim()) {
      setError('يرجى كتابة اسم المجتمع والوصف الموجز والكامل.')
      return
    }

    if (selectedLanguages.length === 0) {
      setError('يرجى تحديد لغة واحدة على الأقل يدعمها المجتمع.')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const categoryObj = CATEGORIES.find((c) => c.id === categoryId)
      const newProfile: CommunityUserProfile = {
        id: `com_cust_${Date.now()}`,
        userId: user?.id || 'default_user',
        communityName,
        shortDescription,
        fullDescription,
        categoryId,
        categoryName: categoryObj?.name || 'عام',
        universityAffiliation: universityAffiliation.trim() || undefined,
        city,
        languages: LANGUAGES_LIST.filter((l) => selectedLanguages.includes(l.id)),
        targetAudience,
        interests: INTERESTS_LIST.filter((i) => selectedInterests.includes(i.id)),
        contactEmail,
        websiteUrl: websiteUrl.trim() || undefined,
        joinUrl: joinUrl.trim() || undefined,
        isNewcomerFriendly,
        verificationStatus: 'PENDING', // Communities cannot self-assign VERIFIED
        isPublished: true,
        memberCount: 1,
        lastReviewedDate: new Date().toLocaleDateString('ar-EG'),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      communityStore.saveCommunityProfile(newProfile)
      refreshCommunityProfile()
      onComplete('community-dashboard')
    } catch (err: any) {
      setError(err.message || 'حدث خطأ أثناء حفظ الملف.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container animate-fade-in" style={{ maxWidth: '780px', paddingBlock: '3rem' }}>
      <button
        onClick={onCancel}
        className="btn btn-ghost btn-sm"
        style={{ marginBottom: '1.5rem', gap: '0.4rem', color: 'var(--muted)' }}
      >
        <ArrowRight size={16} />
        <span>العودة</span>
      </button>

      <div
        className="card"
        style={{
          padding: '2.5rem',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-md)',
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              backgroundColor: 'var(--primary-light)',
              color: 'var(--primary)',
              padding: '0.35rem 0.85rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.84rem',
              fontWeight: 700,
              marginBottom: '0.75rem',
            }}
          >
            <Sparkles size={14} />
            <span>إعداد وتوثيق ملف المجتمع</span>
          </div>

          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--foreground)', marginBottom: '0.5rem' }}>
            معلومات المجتمع والظهور للطلاب
          </h1>
          <p style={{ fontSize: '0.94rem', color: 'var(--muted)', lineHeight: 1.6 }}>
            أكمل هذه البيانات لتظهر في دليل المجتمعات وخوارزمية التوصيات الذكية لآلاف الطلاب العرب في تركيا.
          </p>
        </div>

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

        {/* Quick Demo Autofill Helper */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
          <button
            type="button"
            id="btn-quick-fill-profile"
            onClick={() => {
              setCommunityName('نادي البرمجة والذكاء الاصطناعي')
              setShortDescription('مجتمع تقني طلابي يهدف لتأهيل المطورين والمهندسين العرب لسوق العمل التركي والعالمي.')
              setFullDescription('نادي طلابي تقني تأسس لمساعدة الطلاب العرب في الجامعات التركية على تعلم أحدث تقنيات البرمجة، والذكاء الاصطناعي، وتطوير الويب وتطبيقات الهواتف، بالإضافة لتنظيم هاكاثونات ومشاريع تخرج مشتركة وورش عمل مع خبراء الصناعة.')
              setCategoryId('cat_student_community')
              setUniversityAffiliation('جامعة اسطنبول التقنية - ITU')
              setCity('إسطنبول')
              setTargetAudience('طلاب كليات الهندسة وعلوم الحاسوب والمهتمين بالبرمجة والذكاء الاصطناعي')
              setSelectedLanguages(['lang_arabic', 'lang_turkish', 'lang_english'])
              setSelectedInterests(['int_education', 'int_employment', 'int_networking'])
              setContactEmail('tech-club@wasl-community.org')
              setWebsiteUrl('https://itu-tech-club.org')
              setJoinUrl('https://t.me/wasl_tech_club')
              setIsNewcomerFriendly(true)
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
            <span>ملء ملف تجريبي متكامل بنقرة واحدة</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Section 1: Basic Information */}
          <div>
            <label style={{ display: 'block', fontWeight: 700, fontSize: '0.92rem', marginBottom: '0.4rem' }}>
              اسم المجتمع الرسمي *
            </label>
            <input
              type="text"
              required
              value={communityName}
              onChange={(e) => setCommunityName(e.target.value)}
              placeholder="مثال: نادي الطلاب العرب في جامعة إسطنبول"
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

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontWeight: 700, fontSize: '0.92rem', marginBottom: '0.4rem' }}>
                تصنيف المجتمع *
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border)',
                  backgroundColor: 'var(--bg)',
                  fontSize: '0.92rem',
                  outline: 'none',
                }}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: 700, fontSize: '0.92rem', marginBottom: '0.4rem' }}>
                المدينة الرئيسية *
              </label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border)',
                  backgroundColor: 'var(--bg)',
                  fontSize: '0.92rem',
                  outline: 'none',
                }}
              >
                <option value="إسطنبول">إسطنبول</option>
                <option value="أنقرة">أنقرة</option>
                <option value="إزمير">إزمير</option>
                <option value="بورصة">بورصة</option>
                <option value="قونية">قونية</option>
                <option value="غازي عنتاب">غازي عنتاب</option>
                <option value="حضوري ورقمي">عموم تركيا (رقمي)</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 700, fontSize: '0.92rem', marginBottom: '0.4rem' }}>
              التبعية الجامعية (اختياري)
            </label>
            <input
              type="text"
              value={universityAffiliation}
              onChange={(e) => setUniversityAffiliation(e.target.value)}
              placeholder="مثال: جامعة إسطنبول التقنية (İTÜ) أو مستقل"
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
            <label style={{ display: 'block', fontWeight: 700, fontSize: '0.92rem', marginBottom: '0.4rem' }}>
              وصف موجز (يظهر في بطاقة المجتمع) *
            </label>
            <input
              type="text"
              required
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              placeholder="سطر يلخص دور المجتمع في جملة واحدة واضحة"
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
            <label style={{ display: 'block', fontWeight: 700, fontSize: '0.92rem', marginBottom: '0.4rem' }}>
              الوصف الكامل والرسالة *
            </label>
            <textarea
              required
              rows={4}
              value={fullDescription}
              onChange={(e) => setFullDescription(e.target.value)}
              placeholder="اشرح بالتفصيل أهداف المجتمع، أنواع الأنشطة واللقاءات الدورية، وكيف يساعد الطلاب الجدد..."
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border)',
                backgroundColor: 'var(--bg)',
                fontSize: '0.92rem',
                outline: 'none',
                resize: 'vertical',
              }}
            />
          </div>

          {/* Section 2: Languages & Interests */}
          <div>
            <label style={{ display: 'block', fontWeight: 700, fontSize: '0.92rem', marginBottom: '0.5rem' }}>
              اللغات المعتمدة في اللقاءات والتواصل *
            </label>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {LANGUAGES_LIST.map((l) => {
                const isSelected = selectedLanguages.includes(l.id)
                return (
                  <button
                    type="button"
                    key={l.id}
                    onClick={() => toggleLanguage(l.id)}
                    className={`badge ${isSelected ? 'badge-primary' : 'badge-muted'}`}
                    style={{
                      padding: '0.4rem 0.9rem',
                      fontSize: '0.88rem',
                      cursor: 'pointer',
                      border: isSelected ? '1px solid var(--primary)' : '1px solid var(--border)',
                    }}
                  >
                    {isSelected ? '✓ ' : ''}{l.name}
                  </button>
                )
              })}
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 700, fontSize: '0.92rem', marginBottom: '0.5rem' }}>
              اهتمامات ومجالات تركيز المجتمع
            </label>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {INTERESTS_LIST.map((item) => {
                const isSelected = selectedInterests.includes(item.id)
                return (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => toggleInterest(item.id)}
                    className={`badge ${isSelected ? 'badge-primary' : 'badge-muted'}`}
                    style={{
                      padding: '0.4rem 0.85rem',
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      border: isSelected ? '1px solid var(--primary)' : '1px solid var(--border)',
                    }}
                  >
                    {isSelected ? '✓ ' : ''}{item.name}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Section 3: Contact and Join Links */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontWeight: 700, fontSize: '0.92rem', marginBottom: '0.4rem' }}>
                بريد التواصل الرسمي *
              </label>
              <input
                type="email"
                required
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="info@community.org"
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
              <label style={{ display: 'block', fontWeight: 700, fontSize: '0.92rem', marginBottom: '0.4rem' }}>
                رابط الانضمام المباشر (تلغرام/واتساب)
              </label>
              <input
                type="url"
                value={joinUrl}
                onChange={(e) => setJoinUrl(e.target.value)}
                placeholder="https://t.me/community_link"
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
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 700, fontSize: '0.92rem', marginBottom: '0.4rem' }}>
              الموقع الإلكتروني الرسمي (اختياري)
            </label>
            <input
              type="url"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              placeholder="https://community.org"
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

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginTop: '0.5rem' }}>
            <input
              type="checkbox"
              id="newcomerFriendly"
              checked={isNewcomerFriendly}
              onChange={(e) => setIsNewcomerFriendly(e.target.checked)}
              style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }}
            />
            <label htmlFor="newcomerFriendly" style={{ fontSize: '0.92rem', fontWeight: 600, cursor: 'pointer' }}>
              يرحب بالقادمين الجدد ويوفر جلسات توجيه للمستجدين
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-primary btn-lg"
            style={{ marginTop: '1rem', width: '100%', justifyContent: 'center', gap: '0.5rem' }}
          >
            <span>{isSubmitting ? 'جاري الحفظ...' : 'حفظ ونشر ملف المجتمع في وصل'}</span>
            <ArrowLeft size={18} />
          </button>
        </form>
      </div>
    </div>
  )
}

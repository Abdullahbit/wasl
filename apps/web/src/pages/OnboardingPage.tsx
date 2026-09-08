import React, { useState } from 'react'
import { ArrowLeft, ArrowRight, Check, MapPin, BookOpen, Languages, Sparkles } from 'lucide-react'
import { profileApi } from '../lib/api'
import { useAuth } from '../context/AuthContext'

interface OnboardingPageProps {
  onComplete: () => void
}

export const OnboardingPage: React.FC<OnboardingPageProps> = ({ onComplete }) => {
  const { ensureAuthenticated, refreshProfile } = useAuth()
  const [step, setStep] = useState<number>(1)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  // Form Fields mapped to backend Profile schema
  const [city, setCity] = useState<string>('Istanbul')
  const [university, setUniversity] = useState<string>('جامعة إسطنبول التقنية (ITU)')
  const [major, setMajor] = useState<string>('هندسة الحاسوب')
  const [arrivalPhase, setArrivalPhase] = useState<string>('الشهر الأول')
  const [targetCountry, setTargetCountry] = useState<string>('Turkey')
  const [originCountry, setOriginCountry] = useState<string>('Syria')

  // Languages supported by backend seed
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([
    'lang_arabic',
    'lang_english',
  ])

  // Interests supported by backend seed
  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    'int_employment',
    'int_networking',
    'int_language_learning',
  ])

  const [goals, setGoals] = useState<string>('بناء شبكة علاقات طلابية ومهنية وتحسين لغتي التركية')

  const availableCities = [
    { id: 'Istanbul', label: 'إسطنبول' },
    { id: 'Ankara', label: 'أنقرة' },
    { id: 'Izmir', label: 'إزمير' },
    { id: 'Bursa', label: 'بورصة' },
    { id: 'Antalya', label: 'أنطاليا' },
    { id: 'Konya', label: 'قونية' },
  ]

  const arrivalPhases = [
    'أستعد للوصول',
    'الأسبوع الأول',
    'الشهر الأول',
    'الفصل الدراسي الأول',
    'أعيش في تركيا منذ فترة',
  ]

  const availableLanguages = [
    { id: 'lang_arabic', label: 'العربية' },
    { id: 'lang_turkish', label: 'التركية (Türkçe)' },
    { id: 'lang_english', label: 'الإنجليزية (English)' },
  ]

  const availableInterests = [
    { id: 'int_employment', label: 'التطوير الوظيفي وفرص العمل' },
    { id: 'int_networking', label: 'الشبكات والتعارف الطلابي' },
    { id: 'int_language_learning', label: 'ممارسة وتعلم اللغات' },
    { id: 'int_cultural_events', label: 'الفعاليات الثقافية والاجتماعية' },
    { id: 'int_education', label: 'المجموعات الدراسية والأكاديمية' },
    { id: 'int_legal_aid', label: 'الإقامات والمساعدة القانونية' },
    { id: 'int_housing', label: 'السكن وشؤون المعيشة' },
    { id: 'int_healthcare', label: 'التأمين الصحي والخدمات الطبية' },
  ]

  const toggleLanguage = (id: string) => {
    if (selectedLanguages.includes(id)) {
      if (selectedLanguages.length > 1) {
        setSelectedLanguages(selectedLanguages.filter((l) => l !== id))
      }
    } else {
      setSelectedLanguages([...selectedLanguages, id])
    }
  }

  const toggleInterest = (id: string) => {
    if (selectedInterests.includes(id)) {
      if (selectedInterests.length > 1) {
        setSelectedInterests(selectedInterests.filter((i) => i !== id))
      }
    } else {
      setSelectedInterests([...selectedInterests, id])
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    setErrorMsg(null)

    try {
      await ensureAuthenticated()

      // Update profile with real fields supported by backend
      await profileApi.update({
        originCountry: originCountry || 'Syria',
        targetCountry: targetCountry || 'Turkey',
        currentCity: city,
        bio: `طالب في ${university} - تخصص ${major}. مرحلة الوصول: ${arrivalPhase}`,
        languages: selectedLanguages,
        interests: selectedInterests,
        goals: goals,
        immigrationStatus: 'STUDENT_VISA',
      })

      // Complete onboarding
      try {
        await profileApi.complete()
      } catch {
        // Continue even if already complete
      }

      await refreshProfile()
      onComplete()
    } catch (err: any) {
      console.error('Error submitting onboarding:', err)
      setErrorMsg(err.message || 'حدث خطأ أثناء حفظ الملف. يرجى المحاولة ثانية.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container" style={{ maxWidth: '640px', paddingBlock: '3rem' }}>
      <div
        className="card"
        style={{
          boxShadow: 'var(--shadow-md)',
          padding: '2rem',
          border: '1px solid var(--border)',
        }}
      >
        {/* Progress header */}
        <div style={{ marginBottom: '1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)' }}>
              إعداد خطتك الشخصية
            </span>
            <span style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>
              الخطوة {step} من 3
            </span>
          </div>

          <div
            style={{
              height: '6px',
              backgroundColor: 'var(--border)',
              borderRadius: 'var(--radius-full)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${(step / 3) * 100}%`,
                backgroundColor: 'var(--primary)',
                transition: 'width 0.3s ease',
              }}
            />
          </div>
        </div>

        {errorMsg && (
          <div
            style={{
              padding: '0.75rem 1rem',
              backgroundColor: 'rgba(194, 65, 75, 0.1)',
              color: 'var(--danger)',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.88rem',
              marginBottom: '1.25rem',
            }}
          >
            {errorMsg}
          </div>
        )}

        {/* STEP 1: City & Academic details */}
        {step === 1 && (
          <div className="animate-fade-in">
            <h2 style={{ fontSize: '1.45rem', fontWeight: 800, marginBottom: '0.4rem' }}>
              أين تستقر حالياً؟
            </h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--muted)', marginBottom: '1.5rem' }}>
              نحدد موقعك ومرحلتك لنقترح لك المجتمعات الأقرب إليك جغرافياً وأكاديمياً.
            </p>

            <div className="form-group">
              <label className="form-label">المدينة في تركيا</label>
              <select
                className="form-select"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              >
                {availableCities.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">الجامعة أو المعهد</label>
              <input
                type="text"
                className="form-input"
                value={university}
                onChange={(e) => setUniversity(e.target.value)}
                placeholder="مثال: جامعة إسطنبول، جامعة الشرق الأوسط التقنية"
              />
            </div>

            <div className="form-group">
              <label className="form-label">التخصص الدراسي</label>
              <input
                type="text"
                className="form-input"
                value={major}
                onChange={(e) => setMajor(e.target.value)}
                placeholder="مثال: هندسة البرمجيات، إدارة الأعمال، الطب"
              />
            </div>

            <div className="form-group">
              <label className="form-label">مرحلة الوصول الحالية</label>
              <select
                className="form-select"
                value={arrivalPhase}
                onChange={(e) => setArrivalPhase(e.target.value)}
              >
                {arrivalPhases.map((phase) => (
                  <option key={phase} value={phase}>
                    {phase}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* STEP 2: Languages */}
        {step === 2 && (
          <div className="animate-fade-in">
            <h2 style={{ fontSize: '1.45rem', fontWeight: 800, marginBottom: '0.4rem' }}>
              لغات التواصل التي تفضلها
            </h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--muted)', marginBottom: '1.5rem' }}>
              اختر اللغات التي تستطيع التواصل بها لربطك مع مجتمعات تشعر فيها بالراحة.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem', marginBottom: '1.75rem' }}>
              {availableLanguages.map((lang) => {
                const isSelected = selectedLanguages.includes(lang.id)
                return (
                  <div
                    key={lang.id}
                    onClick={() => toggleLanguage(lang.id)}
                    style={{
                      padding: '0.95rem 1rem',
                      borderRadius: 'var(--radius-md)',
                      border: `1.5px solid ${isSelected ? 'var(--primary)' : 'var(--border)'}`,
                      backgroundColor: isSelected ? 'var(--primary-light)' : 'var(--surface)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <span style={{ fontWeight: 600, fontSize: '0.95rem', color: isSelected ? 'var(--primary)' : 'var(--foreground)' }}>
                      {lang.label}
                    </span>
                    {isSelected && <Check size={18} color="var(--primary)" />}
                  </div>
                )
              })}
            </div>

            <div className="form-group">
              <label className="form-label">بلد المنشأ</label>
              <input
                type="text"
                className="form-input"
                value={originCountry}
                onChange={(e) => setOriginCountry(e.target.value)}
                placeholder="مثال: سوريا، مصر، اليمن، الأردن"
              />
            </div>
          </div>
        )}

        {/* STEP 3: Interests & Goals */}
        {step === 3 && (
          <div className="animate-fade-in">
            <h2 style={{ fontSize: '1.45rem', fontWeight: 800, marginBottom: '0.4rem' }}>
              ما هي اهتماماتك وأهدافك؟
            </h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--muted)', marginBottom: '1.5rem' }}>
              حدد المجالات التي ترغب بالتركيز عليها خلال هذه الفترة لبناء خطة خطواتك المقترحة.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '1.5rem' }}>
              {availableInterests.map((interest) => {
                const isSelected = selectedInterests.includes(interest.id)
                return (
                  <div
                    key={interest.id}
                    onClick={() => toggleInterest(interest.id)}
                    style={{
                      padding: '0.85rem 1rem',
                      borderRadius: 'var(--radius-md)',
                      border: `1.5px solid ${isSelected ? 'var(--primary)' : 'var(--border)'}`,
                      backgroundColor: isSelected ? 'var(--primary-light)' : 'var(--surface)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <span style={{ fontWeight: 600, fontSize: '0.92rem', color: isSelected ? 'var(--primary)' : 'var(--foreground)' }}>
                      {interest.label}
                    </span>
                    {isSelected && <Check size={18} color="var(--primary)" />}
                  </div>
                )
              })}
            </div>

            <div className="form-group">
              <label className="form-label">هدفك الأساسي حالياً</label>
              <textarea
                className="form-input"
                rows={2}
                value={goals}
                onChange={(e) => setGoals(e.target.value)}
                placeholder="أخبرنا باختصار عن أهم ما تسعى لتحقيقه..."
              />
            </div>
          </div>
        )}

        {/* Action Controls */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '2rem',
            paddingTop: '1.25rem',
            borderTop: '1px solid var(--border)',
          }}
        >
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="btn btn-secondary btn-sm"
              disabled={isSubmitting}
            >
              <ArrowRight size={16} />
              <span>السابق</span>
            </button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="btn btn-primary"
            >
              <span>متابعة</span>
              <ArrowLeft size={16} />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="btn btn-accent btn-lg"
              style={{ color: '#fff', fontWeight: 700 }}
            >
              <span>{isSubmitting ? 'جاري إعداد خطتك...' : 'إنهاء واستعراض خطتي'}</span>
              <Sparkles size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

import React, { useState } from 'react'
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  Download,
  Share2,
  FileText,
  AlertTriangle,
  Clock,
  MapPin,
  HelpCircle,
  ChevronRight,
  Copy,
  ExternalLink,
} from 'lucide-react'
import { translate } from '../lib/translations'

interface GuideDetailPageProps {
  guideId?: string | null
  onBack: () => void
}

interface GuideData {
  id: string
  title: string
  category: string
  estimatedTime: string
  lastUpdated: string
  isOfficial: string
  overview: string
  targetAudience: string
  prerequisites: string[]
  steps: {
    stepNumber: number
    title: string
    description: string
    tips?: string
    documents?: string[]
  }[]
  faqs: {
    q: string
    a: string
  }[]
}

const DEMO_GUIDES: Record<string, GuideData> = {
  default: {
    id: 'res_e_ikamet_guide',
    title: 'دليل التقديم على الإقامة الطلابية في تركيا (e-İkamet)',
    category: 'الدعم القانوني والمعاملات الرسمية',
    estimatedTime: '١٥ دقيقة للقراءة • ٢-٣ أسابيع للإجراءات',
    lastUpdated: 'سبتمبر ٢٠٢٦ (محدّث وفق آخر قرارات رئاسة إدارة الهجرة GÖÇ)',
    isOfficial: 'موثّق ومعتمد وفق إجراءات مديرية الهجرة التركية',
    overview:
      'الدليل الإرشادي التفاعلي المباشر للطلاب الدوليين في تركيا؛ يغطي بالتفصيل كيفية حجز موعد المراجعة، استخراج وثيقة الطالب (Öğrenci Belgesi)، وتجهيز الملف الورقي الكامل لتجنب رفض المعاملة أو التأخير.',
    targetAudience:
      'الطلاب المقبولون في الجامعات التركية (حكومية وخاصة) وحملة تأشيرة الدخول أو الموجودون ضمن فترة الإعفاء القانوني.',
    prerequisites: [
      'جواز سفر ساري المفعول لمدة تزيد عن مدة الإقامة المطلوبة بـ ٦٠ يوماً على الأقل.',
      'الرقم الضريبي التركي (Vergi Numarası) يمكن استخراجه إلكترونياً خلال دقيقتين.',
      'تأمين صحي تركي ساري للطلاب (Öğrenci Sağlık Sigortası).',
      'وثيقة طالب حديثة ومختومة أو مشفّرة عبر e-Devlet.',
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'استخراج وثيقة الطالب الرسمية (Öğrenci Belgesi)',
        description:
          'فور إتمام قيدك الجامعي، احصل على وثيقة قيد الطالب من شؤون الطلاب (Öğrenci İşleri) أو حمّلها مباشرة بصيغة PDF مشفرة بباركود رسمي من تطبيق الحكومة الإلكترونية e-Devlet.',
        tips: 'تأكد أن الوثيقة لم يمضِ على إصدارها أكثر من شهر عند تسليم الملف.',
        documents: ['وثيقة الطالب المختومة الأصلية أو مستخرجة من بوابة e-Devlet'],
      },
      {
        stepNumber: 2,
        title: 'التسجيل الإلكتروني وحجز الموعد عبر بوابة e-İkamet',
        description:
          'ادخل إلى الموقع الرسمي لإدارة الهجرة واختر (التقديم لأول مرة / İlk Kez İkamet İzni). املأ بياناتك الشخصية وبيانات السكن بدقة، ثم اختر نوع الإقامة "طالب" (Öğrenci).',
        tips: 'احفظ ملف استمارة الطلب (İkamet Başvuru Formu) فور صدوره واطبعه على ورق ملون.',
        documents: ['استمارة التسجيل المطبوعة الموقّعة في الصفحة الأخيرة'],
      },
      {
        stepNumber: 3,
        title: 'دفع رسوم كرت الإقامة والضريبة',
        description:
          'سدد رسوم بطاقة الإقامة عبر مكاتب الضرائب الرسمية (Vergi Dairesi) أو الدفع الإلكتروني المباشر ببطاقة مصرفية عبر موقع İnteraktif Vergi Dairesi برقم التتبع المعطى لك.',
        tips: 'احتفظ بإيصال الدفع البنكي الرسمي مع الختم؛ فهو جزء أساسي من الملف.',
        documents: ['إيصال سداد رسوم كرت الإقامة'],
      },
      {
        stepNumber: 4,
        title: 'إيداع الملف وتسليم الأوراق (عبر الجامعة أو إدارة الهجرة)',
        description:
          'وفق النظام المعتمد، تقوم معظم الجامعات باستلام ملفات الإقامة الطلابية وفحصها في مكتب شؤون الطلاب الدوليين لتسليمها لإدارة الهجرة مباشرة، أو إرسالها عبر البريد PTT بحسب مدينتك.',
        tips: 'ضع كافة المستندات داخل ملف ورقي منفصل واحتفظ بنسخة إلكترونية مصورة على هاتفك.',
        documents: [
          '٤ صور شخصية بيومترية حديثة (خلفية بيضاء)',
          'صورة ملونة عن جواز السفر وصفحة ختم الدخول',
          'عقد إيجار موثق (Noter) أو ورقة إقامة السكن الجامعي الرسمي',
        ],
      },
    ],
    faqs: [
      {
        q: 'ماذا أفعل في حال تأخر صدور بطاقة الإقامة؟',
        a: 'استمارة التقديم المختومة تعتبر وثيقة إقامة مؤقتة قانونية (Müracaat Belgesi) تسمح لك بالتواجد القانوني داخل الأراضي التركية لحين استلام البطاقة بالبريد.',
      },
      {
        q: 'هل يشترط حساب بنكي لطلاب البكالوريوس؟',
        a: 'في الغالب لا يُطلب كشف حساب مالي لطلاب الجامعات طالما أن الطالب مسجل نظامياً ووثيقة القيد سارية، ما لم تطلب إدارة الهجرة مستندات إضافية.',
      },
      {
        q: 'كيف أتابع حالة طلبي؟',
        a: 'يمكنك متابعة حالة الطلب مباشرة بإدخال رقم الطلب ورقم الهاتف عبر موقع e-ikamet الرسمي أو بالاتصال على مركز خدمة الأجانب YİMER 157 (متوفر باللغة العربية).',
      },
    ],
  },
  res_istanbulkart_student: {
    id: 'res_istanbulkart_student',
    title: 'دليل استخراج وتفعيل كرت المواصلات الطلابي المخفض (İndirimli Kart)',
    category: 'المواصلات والحياة اليومية',
    estimatedTime: '١٠ دقائق للقراءة • استلام فوري أو خلال يومين',
    lastUpdated: 'سبتمبر ٢٠٢٦',
    isOfficial: 'موثّق وفق هيئة النقل العام في إسطنبول (İBB / BELBİM)',
    overview:
      'يوفر كرت الطالب في تركيا تخفيضاً ضخماً يتجاوز ٨٠٪ على جميع خطوط المترو، المتروبوس، الترام، والعبّارات البحرية. يشرح هذا الدليل طريقة التقديم الإلكتروني أو الاستلام الفوري من مراكز الخدمة.',
    targetAudience: 'جميع طلاب الجامعات والمعاهد المرخصين من وزارة التعليم العالي YÖK.',
    prerequisites: [
      'رقم وطني تركي للأجانب (99) أو رقم ضريبي مسجل.',
      'رقم الهاتف التركي الفعّال لاستقبال كود التفعيل.',
      'صورة شخصية حديثة بصيغة رقمية.',
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'التقديم عبر الموقع الرسمي لـ İstanbulkart',
        description: 'ادخل إلى bireysel.istanbulkart.istanbul وأنشئ حساباً شخصياً باستخدام رقمك.',
        tips: 'يقوم النظام بالربط التلقائي بقاعدة بيانات YÖK للتحقق من قيدك الجامعي.',
      },
      {
        stepNumber: 2,
        title: 'اختيار طريقة الاستلام (PTT أو مركز الحلول Çözüm Merkezi)',
        description: 'يمكنك اختيار التوصيل إلى عنوان سكنك أو استلام الكرت فوراً من أي كشك İBB.',
        tips: 'الاستلام المباشر فوري ولا يتطلب الانتظار.',
      },
      {
        stepNumber: 3,
        title: 'شحن الاشتراك الشهري (Abonman)',
        description: 'قم بتفعيل الاشتراك الشهري المخفض عبر أجهزة Biletmatik أو تطبيق İstanbulkart للهاتف.',
        tips: 'الاشتراك الشهري يمنحك عدداً كبيراً من الرحلات بسعر رمزي جداً.',
      },
    ],
    faqs: [
      {
        q: 'هل يمكنني استخراج الكرت قبل صدور الإقامة؟',
        a: 'نعم، في حال كان قيدك الجامعي مسجلاً في نظام YÖKSİS، يمكنك التقديم برقم جواز السفر أو الرقم الضريبي.',
      },
    ],
  },
  res_turkish_practice_resources: {
    id: 'res_turkish_practice_resources',
    title: 'دليل مصادر ومسارات تعلم وممارسة اللغة التركية للطلاب',
    category: 'التطوير الأكاديمي واللغات',
    estimatedTime: '١٢ دقيقة للقراءة • مسار مستمر',
    lastUpdated: 'سبتمبر ٢٠٢٦',
    isOfficial: 'إعداد مجتمعي معتمد من معلمي اللغة ومعهد التومي TÖMER',
    overview:
      'دليل منهجي شامل يرشدك لأفضل المنصات المجانية، نوادي المحادثة الأسبوعية، والمواد التعليمية الموجهة للطلاب الناطقين بالعربية لتجاوز عائق اللغة في المحاضرات والحياة العامة.',
    targetAudience: 'الطلاب في مرحلة التحضيري (TÖMER) والطلاب الراغبين في تقوية مهارات الحديث.',
    prerequisites: ['الرغبة في الممارسة اليومية والالتزام بساعة أسبوعية في نوادي التحدث.'],
    steps: [
      {
        stepNumber: 1,
        title: 'التسجيل في دورات İSMEK البلدية المجانية',
        description: 'توفر بلدية إسطنبول (وغيرها من البلديات) كورسات تركية احترافية مجانية تماماً بمستويات A1 إلى C1.',
        tips: 'يبدأ التسجيل في شهري سبتمبر وفبراير من كل عام.',
      },
      {
        stepNumber: 2,
        title: 'الانضمام إلى دوائر تبادل اللغات (Language Exchange)',
        description: 'شارك في الجلسات الأسبوعية لمجموعات التبادل الثقافي ومارس اللغة مع طلاب أتراك يتعلمون العربية.',
        tips: 'يمكنك إيجاد هذه المجموعات مباشرة من تبويب "المجتمعات" في المنصة.',
      },
    ],
    faqs: [
      {
        q: 'كم يحتاج الطالب للوصول إلى مستوى المحادثة اليومية B1؟',
        a: 'مع الممارسة والاحتكاك المباشر، يصل أغلب الطلاب إلى مستوى B1 خلال ٤ إلى ٦ أشهر من الدراسة المنتظمة.',
      },
    ],
  },
}

export const GuideDetailPage: React.FC<GuideDetailPageProps> = ({ guideId, onBack }) => {
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [copied, setCopied] = useState<boolean>(false)

  // Select matching guide data or default
  const guideKey = guideId && DEMO_GUIDES[guideId] ? guideId : 'default'
  const guide = DEMO_GUIDES[guideKey]

  const toggleStep = (stepNumber: number) => {
    setCompletedSteps((prev) =>
      prev.includes(stepNumber) ? prev.filter((s) => s !== stepNumber) : [...prev, stepNumber]
    )
  }

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="container animate-fade-in" style={{ maxWidth: '920px', paddingBlock: '2.5rem' }}>
      {/* Navigation Top Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
          gap: '0.75rem',
        }}
      >
        <button
          onClick={onBack}
          className="btn btn-ghost btn-sm"
          style={{ gap: '0.45rem', color: 'var(--muted)' }}
        >
          <ArrowRight size={16} />
          <span>العودة إلى خطتي المقترحة</span>
        </button>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={handleCopyLink}
            className="btn btn-secondary btn-sm"
            style={{ gap: '0.4rem', fontSize: '0.85rem' }}
          >
            <Share2 size={14} />
            <span>{copied ? 'تم نسخ الرابط!' : 'مشاركة الدليل'}</span>
          </button>
        </div>
      </div>

      {/* Guide Header Banner */}
      <div
        className="card"
        style={{
          padding: '2.5rem',
          marginBottom: '2rem',
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-md)',
          background: 'linear-gradient(to bottom right, var(--surface), var(--surface-hover))',
          borderRadius: 'var(--radius-lg)',
        }}
      >
        {/* Badges */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1.25rem',
            flexWrap: 'wrap',
            gap: '0.65rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span className="badge badge-accent" style={{ fontSize: '0.85rem', padding: '0.35rem 0.8rem' }}>
              <BookOpen size={14} style={{ marginInlineEnd: '0.3rem' }} />
              <span>{guide.category}</span>
            </span>
            <span className="badge badge-success" style={{ fontSize: '0.82rem', gap: '0.35rem' }}>
              <ShieldCheck size={14} />
              <span>{guide.isOfficial}</span>
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--muted)', fontSize: '0.84rem' }}>
            <Clock size={15} />
            <span>{guide.estimatedTime}</span>
          </div>
        </div>

        {/* Title */}
        <h1
          style={{
            fontSize: 'clamp(1.75rem, 3.8vw, 2.35rem)',
            fontWeight: 800,
            color: 'var(--foreground)',
            marginBottom: '1rem',
            lineHeight: 1.3,
          }}
        >
          {guide.title}
        </h1>

        {/* Overview */}
        <p
          style={{
            fontSize: '1.05rem',
            color: 'var(--muted)',
            lineHeight: 1.7,
            marginBottom: '1.5rem',
          }}
        >
          {guide.overview}
        </p>

        {/* Info Meta Banner */}
        <div
          style={{
            padding: '1rem 1.25rem',
            backgroundColor: 'var(--bg)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.85rem',
            fontSize: '0.88rem',
          }}
        >
          <div>
            <span style={{ color: 'var(--muted)' }}>تاريخ التحديث: </span>
            <span style={{ fontWeight: 600, color: 'var(--foreground)' }}>{guide.lastUpdated}</span>
          </div>

          <div>
            <span style={{ color: 'var(--muted)' }}>الفئة المستفيدة: </span>
            <span style={{ fontWeight: 600, color: 'var(--primary)' }}>{guide.targetAudience}</span>
          </div>
        </div>
      </div>

      {/* Prerequisites Section */}
      <div
        className="card"
        style={{
          padding: '1.75rem',
          marginBottom: '2rem',
          border: '1px solid var(--border)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <FileText size={20} color="var(--primary)" />
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>المتطلبات الأساسية قبل البدء</h2>
        </div>

        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {guide.prerequisites.map((req, idx) => (
            <li
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.65rem',
                fontSize: '0.92rem',
                color: 'var(--foreground)',
                lineHeight: 1.6,
              }}
            >
              <div
                style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--primary-light)',
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  flexShrink: 0,
                  marginTop: '2px',
                }}
              >
                ✓
              </div>
              <span>{req}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Step-by-Step Interactive Workflow */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--foreground)' }}>
              خطوات تنفيذ المعاملة
            </h2>
            <p style={{ fontSize: '0.88rem', color: 'var(--muted)', marginTop: '0.2rem' }}>
              اضغط على كل خطوة بعد إنجازها لتتبع تقدمك العملي
            </p>
          </div>

          <div className="badge badge-primary" style={{ fontSize: '0.85rem' }}>
            المكتمل: {completedSteps.length} من {guide.steps.length}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {guide.steps.map((step) => {
            const isDone = completedSteps.includes(step.stepNumber)
            return (
              <div
                key={step.stepNumber}
                className="card"
                style={{
                  padding: '1.75rem',
                  border: isDone ? '1px solid var(--success)' : '1px solid var(--border)',
                  backgroundColor: isDone ? 'rgba(46, 125, 50, 0.03)' : 'var(--surface)',
                  transition: 'all 0.2s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                  <button
                    onClick={() => toggleStep(step.stepNumber)}
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      backgroundColor: isDone ? 'var(--success)' : 'var(--surface-hover)',
                      border: isDone ? 'none' : '2px solid var(--border)',
                      color: isDone ? '#ffffff' : 'var(--foreground)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '0.95rem',
                      cursor: 'pointer',
                      flexShrink: 0,
                      transition: 'all 0.18s ease',
                    }}
                    title={isDone ? 'اضغط لإلغاء التحديد' : 'اضغط للتحديد كمكتمل'}
                  >
                    {isDone ? '✓' : step.stepNumber}
                  </button>

                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontSize: '1.15rem',
                        fontWeight: 700,
                        color: isDone ? 'var(--success)' : 'var(--foreground)',
                        marginBottom: '0.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <span>{step.title}</span>
                      {isDone && <span style={{ fontSize: '0.78rem', color: 'var(--success)', fontWeight: 600 }}>مكتملة</span>}
                    </div>

                    <p style={{ fontSize: '0.94rem', color: 'var(--muted)', lineHeight: 1.7, marginBottom: '0.85rem' }}>
                      {step.description}
                    </p>

                    {step.tips && (
                      <div
                        style={{
                          backgroundColor: 'var(--surface-hover)',
                          padding: '0.75rem 1rem',
                          borderRadius: 'var(--radius-sm)',
                          borderRight: '3px solid var(--accent)',
                          fontSize: '0.86rem',
                          color: 'var(--foreground)',
                          lineHeight: 1.5,
                          marginBottom: '0.75rem',
                        }}
                      >
                        💡 <strong>نصيحة مهمة:</strong> {step.tips}
                      </div>
                    )}

                    {step.documents && (
                      <div style={{ marginTop: '0.65rem' }}>
                        <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--muted)' }}>
                          المستندات المطلوبة في هذه الخطوة:
                        </span>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.35rem' }}>
                          {step.documents.map((doc, dIdx) => (
                            <span key={dIdx} className="badge badge-secondary" style={{ fontSize: '0.82rem' }}>
                              📎 {doc}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div className="card" style={{ padding: '2rem', marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
          <HelpCircle size={20} color="var(--primary)" />
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>أسئلة شائعة حول هذا الإجراء</h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {guide.faqs.map((faq, idx) => (
            <div
              key={idx}
              style={{
                padding: '1.1rem',
                backgroundColor: 'var(--bg)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <h3 style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--foreground)', marginBottom: '0.45rem' }}>
                س: {faq.q}
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--muted)', lineHeight: 1.6 }}>
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Floating Ask AI Bar */}
      <div
        className="card"
        style={{
          padding: '1.5rem',
          backgroundColor: 'var(--surface)',
          border: '1px solid var(--primary-light)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--foreground)' }}>
            هل تواجه حالة خاصة أو لديك استفسار إضافي حول هذا الدليل؟
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>
            يمكنك استشارة «مستشار وصل الذكي» مباشرة للإجابة على استفساراتك حول شروط حالتك.
          </div>
        </div>

        <button
          onClick={() => {
            window.dispatchEvent(
              new CustomEvent('open_ai_chat', {
                detail: {
                  query: `لدي استفسار بخصوص "${guide.title}". هل يمكنك إرشادي حول الخطوات المناسبة لحالتي؟`,
                },
              })
            )
          }}
          className="btn btn-primary btn-md"
          style={{ gap: '0.45rem' }}
        >
          <Sparkles size={16} />
          <span>استفسر من المستشار الذكي</span>
        </button>
      </div>
    </div>
  )
}

import React, { useState, useEffect } from 'react'
import {
  Users,
  Plus,
  Calendar,
  Clock,
  MapPin,
  ExternalLink,
  Edit2,
  Trash2,
  Eye,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  AlertCircle,
  X,
  Globe,
  Radio,
  FileText,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import {
  communityStore,
  type CommunityActivity,
  type CommunityUserProfile,
} from '../lib/communityStore'
import { translate } from '../lib/translations'

interface CommunityDashboardPageProps {
  onNavigate: (tab: string, param?: string) => void
}

export const CommunityDashboardPage: React.FC<CommunityDashboardPageProps> = ({
  onNavigate,
}) => {
  const { user, communityProfile, refreshCommunityProfile, switchAccountType } = useAuth()
  const [activities, setActivities] = useState<CommunityActivity[]>([])
  const [filterTab, setFilterTab] = useState<'UPCOMING' | 'PAST' | 'DRAFT'>('UPCOMING')

  // Create / Edit Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [editingActivity, setEditingActivity] = useState<CommunityActivity | null>(null)

  // Form fields
  const [title, setTitle] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [activityType, setActivityType] = useState<string>('ورشة عمل وتطوير مهارات')
  const [date, setDate] = useState<string>('')
  const [startTime, setStartTime] = useState<string>('18:00')
  const [endTime, setEndTime] = useState<string>('20:00')
  const [location, setLocation] = useState<string>('')
  const [isOnline, setIsOnline] = useState<boolean>(false)
  const [language, setLanguage] = useState<string>('العربية والتركية')
  const [targetAudience, setTargetAudience] = useState<string>('الطلاب الجدد والمقيمون في تركيا')
  const [registrationUrl, setRegistrationUrl] = useState<string>('')
  const [capacity, setCapacity] = useState<string>('30')
  const [isNewcomerFriendly, setIsNewcomerFriendly] = useState<boolean>(true)
  const [status, setStatus] = useState<'DRAFT' | 'PUBLISHED'>('PUBLISHED')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const loadActivities = () => {
    const commId = communityProfile?.id || user?.id || 'com_default'
    const list = communityStore.getActivities(commId)
    setActivities(list)
  }

  useEffect(() => {
    loadActivities()
  }, [communityProfile, user])

  const openCreateModal = () => {
    setEditingActivity(null)
    setTitle('')
    setDescription('')
    setActivityType('ورشة عمل وتطوير مهارات')
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 2)
    setDate(tomorrow.toISOString().split('T')[0])
    setStartTime('18:00')
    setEndTime('20:00')
    setLocation('إسطنبول - المركز الثقافي أو عبر Zoom')
    setIsOnline(false)
    setLanguage('العربية والتركية')
    setTargetAudience('الطلاب الجدد والمقيمون في تركيا')
    setRegistrationUrl('')
    setCapacity('30')
    setIsNewcomerFriendly(true)
    setStatus('PUBLISHED')
    setErrorMsg(null)
    setIsModalOpen(true)
  }

  const openEditModal = (act: CommunityActivity) => {
    setEditingActivity(act)
    setTitle(act.title)
    setDescription(act.description)
    setActivityType(act.activityType)
    setDate(act.date)
    setStartTime(act.startTime)
    setEndTime(act.endTime || '')
    setLocation(act.location)
    setIsOnline(act.isOnline)
    setLanguage(act.language)
    setTargetAudience(act.targetAudience)
    setRegistrationUrl(act.registrationUrl || '')
    setCapacity(act.capacity ? String(act.capacity) : '')
    setIsNewcomerFriendly(act.isNewcomerFriendly)
    setStatus(act.status === 'DRAFT' ? 'DRAFT' : 'PUBLISHED')
    setErrorMsg(null)
    setIsModalOpen(true)
  }

  const handleSaveActivity = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !date.trim() || !location.trim()) {
      setErrorMsg('يرجى ملء عنوان الفعالية، التاريخ، والمكان.')
      return
    }

    const commId = communityProfile?.id || user?.id || 'com_default'

    communityStore.saveActivity({
      id: editingActivity?.id,
      communityId: commId,
      title,
      description,
      activityType,
      date,
      startTime,
      endTime: endTime || undefined,
      location,
      isOnline,
      language,
      targetAudience,
      registrationUrl: registrationUrl.trim() || undefined,
      capacity: capacity ? Number(capacity) : undefined,
      isNewcomerFriendly,
      status,
    })

    setIsModalOpen(false)
    loadActivities()
  }

  const handleDeleteActivity = (id: string) => {
    if (window.confirm('هل أنت متأكد من رغبتك في حذف هذه الفعالية؟')) {
      communityStore.deleteActivity(id)
      loadActivities()
    }
  }

  // Filter activities
  const todayStr = new Date().toISOString().split('T')[0]
  const upcomingList = activities.filter((a) => a.status === 'PUBLISHED' && a.date >= todayStr)
  const pastList = activities.filter((a) => a.status === 'COMPLETED' || (a.status === 'PUBLISHED' && a.date < todayStr))
  const draftList = activities.filter((a) => a.status === 'DRAFT' || a.status === 'CANCELLED')

  const displayedList =
    filterTab === 'UPCOMING' ? upcomingList : filterTab === 'PAST' ? pastList : draftList

  return (
    <div className="container animate-fade-in" style={{ paddingBlock: '2.5rem' }}>
      {/* Top Banner: Community Overview & Switcher */}
      <div
        className="card"
        style={{
          padding: '2.25rem',
          marginBottom: '2.5rem',
          border: '1px solid var(--border)',
          background: 'linear-gradient(to bottom right, var(--surface), var(--surface-hover))',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.25rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.75rem' }}>
              <span className="badge badge-primary" style={{ padding: '0.35rem 0.85rem' }}>
                {communityProfile?.categoryName || 'مجتمع طلابي ومهني'}
              </span>
              <span className="badge badge-muted">
                {communityProfile?.verificationStatus === 'VERIFIED'
                  ? 'موثّق رسمياً'
                  : 'قيد المراجعة والاعتماد (Verification Pending)'}
              </span>
            </div>

            <h1 style={{ fontSize: '2.1rem', fontWeight: 800, color: 'var(--foreground)', marginBottom: '0.5rem' }}>
              {communityProfile?.communityName || user?.name || 'لوحة تحكم المجتمع'}
            </h1>
            <p style={{ color: 'var(--muted)', fontSize: '0.96rem', maxWidth: '680px', lineHeight: 1.6 }}>
              {communityProfile?.shortDescription ||
                'قم بإدارة ملف مجتمعك، نشر الفعاليات الأكاديمية والمهنية، والتواصل المباشر مع الطلاب العرب في تركيا.'}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => onNavigate('community-profile-setup')}
              className="btn btn-secondary btn-md"
              style={{ gap: '0.45rem' }}
            >
              <Edit2 size={16} />
              <span>تعديل ملف المجتمع</span>
            </button>

            {communityProfile && (
              <button
                onClick={() => onNavigate('community-detail', communityProfile.id)}
                className="btn btn-ghost btn-md"
                style={{ gap: '0.45rem' }}
                title="معاينة الصفحة العامة كما يراها الطلاب"
              >
                <Eye size={16} />
                <span>معاينة صفحة المجتمع للطلاب</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Activities Management Section */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--foreground)' }}>
            الفعاليات والأنشطة الطلابية
          </h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--muted)' }}>
            تظهر الفعاليات المنشورة فوراً للطلاب في صفحة المجتمع التفصيلية وخريطة الانطلاق
          </p>
        </div>

        <button onClick={openCreateModal} className="btn btn-primary btn-md" style={{ gap: '0.5rem', fontWeight: 700 }}>
          <Plus size={18} />
          <span>إنشاء فعالية جديدة</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
        <button
          onClick={() => setFilterTab('UPCOMING')}
          className={`btn ${filterTab === 'UPCOMING' ? 'btn-primary' : 'btn-ghost'} btn-sm`}
          style={{ gap: '0.4rem' }}
        >
          <span>الفعاليات القادمة ({upcomingList.length})</span>
        </button>

        <button
          onClick={() => setFilterTab('DRAFT')}
          className={`btn ${filterTab === 'DRAFT' ? 'btn-primary' : 'btn-ghost'} btn-sm`}
          style={{ gap: '0.4rem' }}
        >
          <span>المسودات ({draftList.length})</span>
        </button>

        <button
          onClick={() => setFilterTab('PAST')}
          className={`btn ${filterTab === 'PAST' ? 'btn-primary' : 'btn-ghost'} btn-sm`}
          style={{ gap: '0.4rem' }}
        >
          <span>الفعاليات السابقة ({pastList.length})</span>
        </button>
      </div>

      {/* Activities List or Empty State */}
      {displayedList.length === 0 ? (
        <div
          className="card"
          style={{
            padding: '3.5rem 2rem',
            textAlign: 'center',
            backgroundColor: 'var(--surface)',
            border: '1px dashed var(--border)',
          }}
        >
          <Calendar size={44} color="var(--primary)" style={{ margin: '0 auto 1rem', opacity: 0.8 }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            لا توجد فعاليات في هذا القسم حالياً
          </h3>
          <p style={{ color: 'var(--muted)', fontSize: '0.92rem', marginBottom: '1.5rem', maxWidth: '480px', marginInline: 'auto' }}>
            قم بإنشاء فعاليتك الأولى (لقاء طلابي، ورشة عمل، نادي محادثة) لتساعد الطلاب في اكتشاف مجتمعك وبناء شبكة علاقاتهم.
          </p>
          <button onClick={openCreateModal} className="btn btn-primary btn-sm" style={{ margin: '0 auto', gap: '0.4rem' }}>
            <Plus size={16} />
            <span>إنشاء أول فعالية الآن</span>
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {displayedList.map((act) => (
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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span className="badge badge-primary">{act.activityType}</span>
                  <span className={`badge ${act.status === 'PUBLISHED' ? 'badge-success' : 'badge-muted'}`}>
                    {act.status === 'PUBLISHED' ? 'منشورة' : 'مسودة'}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--foreground)', marginBottom: '0.5rem', lineHeight: 1.4 }}>
                  {act.title}
                </h3>

                <p style={{ fontSize: '0.88rem', color: 'var(--muted)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                  {act.description}
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.84rem', color: 'var(--muted)', marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                    <Calendar size={15} color="var(--primary)" />
                    <span>{act.date} ({act.startTime} {act.endTime ? `- ${act.endTime}` : ''})</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                    <MapPin size={15} color="var(--primary)" />
                    <span>{act.location}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                    <Users size={15} color="var(--primary)" />
                    <span>اللغة: {act.language}</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => openEditModal(act)}
                    className="btn btn-ghost btn-xs"
                    style={{ gap: '0.35rem', color: 'var(--foreground)' }}
                  >
                    <Edit2 size={14} />
                    <span>تعديل</span>
                  </button>

                  <button
                    onClick={() => handleDeleteActivity(act.id)}
                    className="btn btn-ghost btn-xs"
                    style={{ gap: '0.35rem', color: 'var(--danger)' }}
                  >
                    <Trash2 size={14} />
                    <span>حذف</span>
                  </button>
                </div>

                {act.registrationUrl && (
                  <a
                    href={act.registrationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary btn-xs"
                    style={{ gap: '0.3rem' }}
                  >
                    <span>رابط التسجيل</span>
                    <ExternalLink size={12} />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Modal Dialog */}
      {isModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
        >
          <div
            className="card animate-fade-in"
            style={{
              width: '100%',
              maxWidth: '620px',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '2rem',
              borderRadius: 'var(--radius-lg)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800 }}>
                {editingActivity ? 'تعديل الفعالية' : 'إنشاء فعالية جديدة'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="btn btn-ghost btn-xs"
                style={{ padding: '0.25rem' }}
              >
                <X size={20} />
              </button>
            </div>

            {errorMsg && (
              <div
                style={{
                  padding: '0.75rem',
                  backgroundColor: 'rgba(194, 65, 75, 0.08)',
                  color: 'var(--danger)',
                  fontSize: '0.88rem',
                  borderRadius: 'var(--radius-sm)',
                  marginBottom: '1rem',
                }}
              >
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSaveActivity} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                  عنوان الفعالية *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="مثال: ورشة كتابة السيرة الذاتية لطلاب الهندسة"
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border)',
                    backgroundColor: 'var(--bg)',
                    outline: 'none',
                    fontSize: '0.9rem',
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                    نوع الفعالية
                  </label>
                  <select
                    value={activityType}
                    onChange={(e) => setActivityType(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border)',
                      backgroundColor: 'var(--bg)',
                      outline: 'none',
                      fontSize: '0.9rem',
                    }}
                  >
                    <option value="ورشة عمل وتطوير مهارات">ورشة عمل وتطوير مهارات</option>
                    <option value="لقاء تعارفي ونادي محادثة">لقاء تعارفي ونادي محادثة</option>
                    <option value="جلسة توجيه أكاديمي">جلسة توجيه أكاديمي</option>
                    <option value="ندوة قانونية وإرشادية">ندوة قانونية وإرشادية</option>
                    <option value="فعالية ثقافية وترفيهية">فعالية ثقافية وترفيهية</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                    تاريخ الفعالية *
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border)',
                      backgroundColor: 'var(--bg)',
                      outline: 'none',
                      fontSize: '0.9rem',
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                    وقت البدء *
                  </label>
                  <input
                    type="time"
                    required
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border)',
                      backgroundColor: 'var(--bg)',
                      outline: 'none',
                      fontSize: '0.9rem',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                    وقت الانتهاء (اختياري)
                  </label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border)',
                      backgroundColor: 'var(--bg)',
                      outline: 'none',
                      fontSize: '0.9rem',
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                  المكان أو الرابط *
                </label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="مثال: إسطنبول - مكتبة الجامعة أو عبر Zoom"
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border)',
                    backgroundColor: 'var(--bg)',
                    outline: 'none',
                    fontSize: '0.9rem',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                  وصف وتفاصيل الفعالية
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="ما الذي سيتعلمه الطالب أو يستفيده من حضور هذه الفعالية..."
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border)',
                    backgroundColor: 'var(--bg)',
                    outline: 'none',
                    fontSize: '0.9rem',
                    resize: 'vertical',
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                    رابط التسجيل / الانضمام (اختياري)
                  </label>
                  <input
                    type="url"
                    value={registrationUrl}
                    onChange={(e) => setRegistrationUrl(e.target.value)}
                    placeholder="https://forms.gle/example"
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border)',
                      backgroundColor: 'var(--bg)',
                      direction: 'ltr',
                      outline: 'none',
                      fontSize: '0.9rem',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                    حالة النشر
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border)',
                      backgroundColor: 'var(--bg)',
                      outline: 'none',
                      fontSize: '0.9rem',
                    }}
                  >
                    <option value="PUBLISHED">نشر مباشر (يظهر للطلاب فوراً)</option>
                    <option value="DRAFT">حفظ كمسودة (غير ظاهر)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn btn-secondary btn-md"
                >
                  إلغاء
                </button>
                <button type="submit" className="btn btn-primary btn-md">
                  {editingActivity ? 'تحديث الفعالية' : 'نشر الفعالية'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

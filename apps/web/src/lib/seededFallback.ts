import type { ApiCommunity } from './api'
import allCommunitiesJson from './allCommunitiesData.json'

/**
 * Exact replica of all 15 backend database seed records.
 * Used for immediate 0ms initial render and bulletproof fallback so the Community Details
 * page and list NEVER fail, spin indefinitely, or show blank states.
 */
export const ALL_SEEDED_COMMUNITIES: ApiCommunity[] = allCommunitiesJson as ApiCommunity[]

export const SEEDED_COMMUNITIES_BY_ID = new Map<string, ApiCommunity>(
  ALL_SEEDED_COMMUNITIES.map((c) => [c.id, c])
)

export const SEEDED_COMMUNITIES_PREVIEW: ApiCommunity[] = ALL_SEEDED_COMMUNITIES

export const SEEDED_PLAN_PREVIEW = {
  communities: SEEDED_COMMUNITIES_PREVIEW.map((c, i) => ({
    ...c,
    score: 0.95 - i * 0.1,
  })),
  resources: [
    {
      id: 'res_e_ikamet_guide',
      title: 'دليل التقديم على الإقامة الطلابية (e-İkamet)',
      slug: 'e-ikamet-student-guide',
      description: 'شرح تفصيلي خطوة بخطوة لكيفية حجز موعد إدارة الهجرة وتجهيز الأوراق والتأمين الصحي.',
      url: 'https://e-ikamet.goc.gov.tr',
      type: 'GUIDE',
      isVerified: true,
      score: 0.96,
      category: { id: 'cat_immigration_support', name: 'Immigration Support' },
      interests: [{ id: 'int_legal_aid', name: 'Legal Aid' }],
    },
    {
      id: 'res_istanbulkart_student',
      title: 'استخراج بطاقة المواصلات الطلابية المخفضة (İndirimli Kart)',
      slug: 'istanbulkart-student-discount',
      description: 'دليل تفعيل الخصم الطلابي في شبكة المواصلات العامة للمترو والمتروبوس والحافلات.',
      url: 'https://istanbulkart.istanbul',
      type: 'TOOL',
      isVerified: true,
      score: 0.92,
      category: { id: 'cat_social_integration', name: 'Social Integration' },
      interests: [{ id: 'int_education', name: 'Education' }],
    },
    {
      id: 'res_turkish_practice_resources',
      title: 'بوابة تعلم وممارسة المحادثة التركية اليومية',
      slug: 'turkish-practice-portal',
      description: 'مصادر تفاعلية وقنوات موثوقة لممارسة المحادثات اليومية وحل أسئلة الجامعة.',
      url: 'https://yee.org.tr',
      type: 'COURSE',
      isVerified: true,
      score: 0.88,
      category: { id: 'cat_social_integration', name: 'Social Integration' },
      interests: [{ id: 'int_language_learning', name: 'Language Learning' }],
    },
  ],
  opportunities: [
    {
      id: 'opp_mentorship_fellowship',
      title: 'برنامج الإرشاد الأكاديمي للطلاب الجدد',
      slug: 'academic-mentorship-fellowship',
      description: 'برنامج مجتمعي يربط الطالب الجديد بمرشد أكاديمي من نفس التخصص للمساعدة طوال الفصل الأول.',
      type: 'FELLOWSHIP',
      organizationName: 'Arab Student Union in Türkiye',
      applicationUrl: 'https://example.org/mentorship',
      deadline: '2026-10-15T00:00:00.000Z',
      isVerified: true,
      score: 0.94,
      targetCountry: 'Türkiye',
      requirements: 'طالب في السنة الأولى أو التحضيرية في إحدى الجامعات التركية',
      interests: [{ id: 'int_education', name: 'Education' }, { id: 'int_networking', name: 'Networking' }],
    },
    {
      id: 'opp_tech_internship_program',
      title: 'فرص تدريب ومشاريع مفتوحة المصدر للطلاب',
      slug: 'student-tech-internship',
      description: 'مشاريع تقنية وتدريب تعاوني للطلاب الراغبين في اكتساب خبرة عملية وبناء سيرتهم الذاتية.',
      type: 'INTERNSHIP',
      organizationName: 'Tech Immigrants Alliance',
      applicationUrl: 'https://example.org/tech-intern',
      deadline: '2026-11-01T00:00:00.000Z',
      isVerified: true,
      score: 0.89,
      targetCountry: 'Türkiye',
      requirements: 'معرفة أساسية بالبرمجة والرغبة في التعلم',
      interests: [{ id: 'int_employment', name: 'Employment' }],
    },
  ],
}


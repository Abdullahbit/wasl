import type { ApiCommunity } from './api'

/**
 * Exact replica of the backend database seed records.
 * Used for immediate 0ms initial render so users never stare at blank skeletons,
 * then silently synchronized with the live API in the background.
 */
export const SEEDED_COMMUNITIES_PREVIEW: ApiCommunity[] = [
  {
    id: 'com_tech_immigrants_network',
    name: 'Tech Immigrants Network',
    slug: 'tech-immigrants-network',
    description: 'مجتمع للمهندسين والمبرمجين القادمين الجدد للتواصل وتبادل الخبرات وبناء مشاريع تقنية وفرص التوظيف.',
    websiteUrl: 'https://techimmigrants.example.org',
    contactEmail: 'hi@techimmigrants.example.org',
    joinUrl: 'https://techimmigrants.example.org/join',
    memberCount: 3200,
    isVerified: true,
    verificationStatus: 'VERIFIED',
    category: {
      id: 'cat_professional_development',
      name: 'Professional Development',
      slug: 'professional-development',
    },
    languages: [
      { id: 'lang_english', code: 'en', name: 'English' },
      { id: 'lang_arabic', code: 'ar', name: 'Arabic' },
    ],
    interests: [
      { id: 'int_employment', name: 'Employment', slug: 'employment' },
      { id: 'int_networking', name: 'Networking', slug: 'networking' },
      { id: 'int_education', name: 'Education', slug: 'education' },
    ],
    createdAt: '2026-09-08T11:27:10.327Z',
    updatedAt: '2026-09-08T11:27:10.327Z',
  },
  {
    id: 'com_language_exchange_circle',
    name: 'Language Exchange Circle',
    slug: 'language-exchange-circle',
    description: 'جلسات ولقاءات أسبوعية لتبادل وممارسة اللغة التركية والإنجليزية مع طلاب وناطقين محليين.',
    websiteUrl: 'https://languageexchangecircle.example.org',
    contactEmail: 'practice@languageexchangecircle.example.org',
    joinUrl: 'https://languageexchangecircle.example.org/join',
    memberCount: 2400,
    isVerified: true,
    verificationStatus: 'VERIFIED',
    category: {
      id: 'cat_social_integration',
      name: 'Social Integration',
      slug: 'social-integration',
    },
    languages: [
      { id: 'lang_arabic', code: 'ar', name: 'Arabic' },
      { id: 'lang_english', code: 'en', name: 'English' },
    ],
    interests: [
      { id: 'int_language_learning', name: 'Language Learning', slug: 'language-learning' },
      { id: 'int_cultural_events', name: 'Cultural Events', slug: 'cultural-events' },
    ],
    createdAt: '2026-09-08T11:27:10.327Z',
    updatedAt: '2026-09-08T11:27:10.327Z',
  },
  {
    id: 'com_newcomer_legal_network',
    name: 'Newcomer Legal Network',
    slug: 'newcomer-legal-network',
    description: 'شبكة دعم قانوني مجتمعية لمساعدة الطلاب والمقيمين الجدد في إجراءات الإقامة والأوراق الرسمية.',
    websiteUrl: 'https://newcomerlegalnetwork.example.org',
    contactEmail: 'hello@newcomerlegalnetwork.example.org',
    joinUrl: 'https://newcomerlegalnetwork.example.org/join',
    memberCount: 1240,
    isVerified: true,
    verificationStatus: 'VERIFIED',
    category: {
      id: 'cat_immigration_support',
      name: 'Immigration Support',
      slug: 'immigration-support',
    },
    languages: [
      { id: 'lang_arabic', code: 'ar', name: 'Arabic' },
      { id: 'lang_english', code: 'en', name: 'English' },
    ],
    interests: [
      { id: 'int_legal_aid', name: 'Legal Aid', slug: 'legal-aid' },
      { id: 'int_housing', name: 'Housing', slug: 'housing' },
    ],
    createdAt: '2026-09-08T11:27:10.327Z',
    updatedAt: '2026-09-08T11:27:10.327Z',
  },
]

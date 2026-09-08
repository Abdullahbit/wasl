import { PrismaClient } from '@prisma/client'
import { hashPassword } from 'better-auth/crypto'

const prisma = new PrismaClient()

// ─── Fixed deterministic IDs for reproducibility ──────────────────────────

const CATEGORY_IDS = {
  immigration: 'cat_immigration_support',
  professional: 'cat_professional_development',
  social: 'cat_social_integration',
} as const

const LANGUAGE_IDS = {
  en: 'lang_english',
  ar: 'lang_arabic',
  es: 'lang_spanish',
  fr: 'lang_french',
  zh: 'lang_mandarin',
} as const

const INTEREST_IDS = {
  housing: 'int_housing',
  employment: 'int_employment',
  legalAid: 'int_legal_aid',
  healthcare: 'int_healthcare',
  education: 'int_education',
  networking: 'int_networking',
  culturalEvents: 'int_cultural_events',
  languageLearning: 'int_language_learning',
} as const

const ADMIN_USER_ID = 'user_admin_seed'
const TEST_USER_ID = 'user_test_seed'
const ADMIN_ACCOUNT_ID = 'account_admin_seed'
const TEST_ACCOUNT_ID = 'account_test_seed'

async function main() {
  console.log('Seeding database...')

  // ─── Categories ──────────────────────────────────────────────────────────
  const categories = [
    {
      id: CATEGORY_IDS.immigration,
      name: 'Immigration Support',
      slug: 'immigration-support',
      description: 'Resources and communities for navigating visas, residency, and legal immigration processes.',
    },
    {
      id: CATEGORY_IDS.professional,
      name: 'Professional Development',
      slug: 'professional-development',
      description: 'Career growth, job search, upskilling, and networking resources for newcomers.',
    },
    {
      id: CATEGORY_IDS.social,
      name: 'Social Integration',
      slug: 'social-integration',
      description: 'Community groups and cultural events that help newcomers settle and connect.',
    },
  ]
  for (const c of categories) {
    await prisma.category.upsert({ where: { id: c.id }, update: c, create: c })
  }

  // ─── Languages ───────────────────────────────────────────────────────────
  const languages = [
    { id: LANGUAGE_IDS.en, code: 'en', name: 'English' },
    { id: LANGUAGE_IDS.ar, code: 'ar', name: 'Arabic' },
    { id: LANGUAGE_IDS.es, code: 'es', name: 'Spanish' },
    { id: LANGUAGE_IDS.fr, code: 'fr', name: 'French' },
    { id: LANGUAGE_IDS.zh, code: 'zh', name: 'Mandarin' },
  ]
  for (const l of languages) {
    await prisma.language.upsert({ where: { id: l.id }, update: l, create: l })
  }

  // ─── Interests ───────────────────────────────────────────────────────────
  const interests = [
    { id: INTEREST_IDS.housing, name: 'Housing', slug: 'housing' },
    { id: INTEREST_IDS.employment, name: 'Employment', slug: 'employment' },
    { id: INTEREST_IDS.legalAid, name: 'Legal Aid', slug: 'legal-aid' },
    { id: INTEREST_IDS.healthcare, name: 'Healthcare', slug: 'healthcare' },
    { id: INTEREST_IDS.education, name: 'Education', slug: 'education' },
    { id: INTEREST_IDS.networking, name: 'Networking', slug: 'networking' },
    { id: INTEREST_IDS.culturalEvents, name: 'Cultural Events', slug: 'cultural-events' },
    { id: INTEREST_IDS.languageLearning, name: 'Language Learning', slug: 'language-learning' },
  ]
  for (const i of interests) {
    await prisma.interest.upsert({ where: { id: i.id }, update: i, create: i })
  }

  // ─── Communities ─────────────────────────────────────────────────────────
  type CommunitySeed = {
    id: string
    name: string
    slug: string
    description: string
    categoryId: string
    websiteUrl: string
    contactEmail: string
    joinUrl: string
    memberCount: number
    isVerified: boolean
    languages: string[]
    interests: string[]
  }

  const communities: CommunitySeed[] = [
    {
      id: 'com_newcomer_legal_network',
      name: 'Newcomer Legal Network',
      slug: 'newcomer-legal-network',
      description: 'Peer-support group connecting newcomers with pro-bono immigration lawyers and paralegals.',
      categoryId: CATEGORY_IDS.immigration,
      websiteUrl: 'https://newcomerlegalnetwork.example.org',
      contactEmail: 'hello@newcomerlegalnetwork.example.org',
      joinUrl: 'https://newcomerlegalnetwork.example.org/join',
      memberCount: 1240,
      isVerified: true,
      languages: [LANGUAGE_IDS.en, LANGUAGE_IDS.ar],
      interests: [INTEREST_IDS.legalAid, INTEREST_IDS.housing],
    },
    {
      id: 'com_visa_pathways_circle',
      name: 'Visa Pathways Circle',
      slug: 'visa-pathways-circle',
      description: 'A discussion circle sharing first-hand experiences on work, study, and family visa pathways.',
      categoryId: CATEGORY_IDS.immigration,
      websiteUrl: 'https://visapathwayscircle.example.org',
      contactEmail: 'contact@visapathwayscircle.example.org',
      joinUrl: 'https://visapathwayscircle.example.org/join',
      memberCount: 860,
      isVerified: true,
      languages: [LANGUAGE_IDS.en, LANGUAGE_IDS.es],
      interests: [INTEREST_IDS.legalAid, INTEREST_IDS.education],
    },
    {
      id: 'com_refugee_rights_collective',
      name: 'Refugee Rights Collective',
      slug: 'refugee-rights-collective',
      description: 'Advocacy and mutual aid collective supporting refugees through the asylum process.',
      categoryId: CATEGORY_IDS.immigration,
      websiteUrl: 'https://refugeerightscollective.example.org',
      contactEmail: 'support@refugeerightscollective.example.org',
      joinUrl: 'https://refugeerightscollective.example.org/join',
      memberCount: 2100,
      isVerified: true,
      languages: [LANGUAGE_IDS.en, LANGUAGE_IDS.ar, LANGUAGE_IDS.fr],
      interests: [INTEREST_IDS.legalAid, INTEREST_IDS.healthcare],
    },
    {
      id: 'com_housing_helpline_group',
      name: 'Housing Helpline Group',
      slug: 'housing-helpline-group',
      description: 'Volunteers helping newcomers find affordable, safe housing and understand tenant rights.',
      categoryId: CATEGORY_IDS.immigration,
      websiteUrl: 'https://housinghelpline.example.org',
      contactEmail: 'help@housinghelpline.example.org',
      joinUrl: 'https://housinghelpline.example.org/join',
      memberCount: 640,
      isVerified: false,
      languages: [LANGUAGE_IDS.en, LANGUAGE_IDS.es],
      interests: [INTEREST_IDS.housing],
    },
    {
      id: 'com_new_immigrant_healthcare_hub',
      name: 'New Immigrant Healthcare Hub',
      slug: 'new-immigrant-healthcare-hub',
      description: 'Guidance on enrolling in health coverage and finding culturally competent providers.',
      categoryId: CATEGORY_IDS.immigration,
      websiteUrl: 'https://immigranthealthcarehub.example.org',
      contactEmail: 'info@immigranthealthcarehub.example.org',
      joinUrl: 'https://immigranthealthcarehub.example.org/join',
      memberCount: 980,
      isVerified: true,
      languages: [LANGUAGE_IDS.en, LANGUAGE_IDS.zh],
      interests: [INTEREST_IDS.healthcare],
    },
    {
      id: 'com_global_talent_job_club',
      name: 'Global Talent Job Club',
      slug: 'global-talent-job-club',
      description: 'Job search accountability group with resume reviews and mock interviews for skilled migrants.',
      categoryId: CATEGORY_IDS.professional,
      websiteUrl: 'https://globaltalentjobclub.example.org',
      contactEmail: 'team@globaltalentjobclub.example.org',
      joinUrl: 'https://globaltalentjobclub.example.org/join',
      memberCount: 1530,
      isVerified: true,
      languages: [LANGUAGE_IDS.en],
      interests: [INTEREST_IDS.employment, INTEREST_IDS.networking],
    },
    {
      id: 'com_tech_immigrants_network',
      name: 'Tech Immigrants Network',
      slug: 'tech-immigrants-network',
      description: 'Community for immigrant software engineers and IT professionals to network and mentor.',
      categoryId: CATEGORY_IDS.professional,
      websiteUrl: 'https://techimmigrants.example.org',
      contactEmail: 'hi@techimmigrants.example.org',
      joinUrl: 'https://techimmigrants.example.org/join',
      memberCount: 3200,
      isVerified: true,
      languages: [LANGUAGE_IDS.en, LANGUAGE_IDS.zh],
      interests: [INTEREST_IDS.employment, INTEREST_IDS.networking, INTEREST_IDS.education],
    },
    {
      id: 'com_credential_recognition_support',
      name: 'Credential Recognition Support',
      slug: 'credential-recognition-support',
      description: 'Peer group helping internationally trained professionals get credentials recognized.',
      categoryId: CATEGORY_IDS.professional,
      websiteUrl: 'https://credentialsupport.example.org',
      contactEmail: 'ask@credentialsupport.example.org',
      joinUrl: 'https://credentialsupport.example.org/join',
      memberCount: 710,
      isVerified: false,
      languages: [LANGUAGE_IDS.en, LANGUAGE_IDS.fr],
      interests: [INTEREST_IDS.education, INTEREST_IDS.employment],
    },
    {
      id: 'com_entrepreneurs_abroad',
      name: 'Entrepreneurs Abroad',
      slug: 'entrepreneurs-abroad',
      description: 'Network for immigrant founders building startups and small businesses in a new country.',
      categoryId: CATEGORY_IDS.professional,
      websiteUrl: 'https://entrepreneursabroad.example.org',
      contactEmail: 'founders@entrepreneursabroad.example.org',
      joinUrl: 'https://entrepreneursabroad.example.org/join',
      memberCount: 540,
      isVerified: true,
      languages: [LANGUAGE_IDS.en, LANGUAGE_IDS.es],
      interests: [INTEREST_IDS.employment, INTEREST_IDS.networking],
    },
    {
      id: 'com_womens_career_circle',
      name: "Women's Career Circle",
      slug: 'womens-career-circle',
      description: 'Support and mentorship network for immigrant women re-entering the workforce.',
      categoryId: CATEGORY_IDS.professional,
      websiteUrl: 'https://womenscareercircle.example.org',
      contactEmail: 'connect@womenscareercircle.example.org',
      joinUrl: 'https://womenscareercircle.example.org/join',
      memberCount: 890,
      isVerified: true,
      languages: [LANGUAGE_IDS.en, LANGUAGE_IDS.ar],
      interests: [INTEREST_IDS.employment, INTEREST_IDS.networking],
    },
    {
      id: 'com_cultural_exchange_meetup',
      name: 'Cultural Exchange Meetup',
      slug: 'cultural-exchange-meetup',
      description: 'Monthly meetups celebrating food, music, and traditions from around the world.',
      categoryId: CATEGORY_IDS.social,
      websiteUrl: 'https://culturalexchangemeetup.example.org',
      contactEmail: 'events@culturalexchangemeetup.example.org',
      joinUrl: 'https://culturalexchangemeetup.example.org/join',
      memberCount: 1780,
      isVerified: true,
      languages: [LANGUAGE_IDS.en, LANGUAGE_IDS.fr, LANGUAGE_IDS.es],
      interests: [INTEREST_IDS.culturalEvents],
    },
    {
      id: 'com_language_exchange_circle',
      name: 'Language Exchange Circle',
      slug: 'language-exchange-circle',
      description: 'Weekly conversation practice pairing newcomers with local language partners.',
      categoryId: CATEGORY_IDS.social,
      websiteUrl: 'https://languageexchangecircle.example.org',
      contactEmail: 'practice@languageexchangecircle.example.org',
      joinUrl: 'https://languageexchangecircle.example.org/join',
      memberCount: 2400,
      isVerified: true,
      languages: [LANGUAGE_IDS.en, LANGUAGE_IDS.ar, LANGUAGE_IDS.zh, LANGUAGE_IDS.es],
      interests: [INTEREST_IDS.languageLearning, INTEREST_IDS.culturalEvents],
    },
    {
      id: 'com_new_parents_newcomer_group',
      name: 'New Parents Newcomer Group',
      slug: 'new-parents-newcomer-group',
      description: 'Support group for immigrant parents navigating schools, childcare, and pediatric care.',
      categoryId: CATEGORY_IDS.social,
      websiteUrl: 'https://newparentsnewcomer.example.org',
      contactEmail: 'families@newparentsnewcomer.example.org',
      joinUrl: 'https://newparentsnewcomer.example.org/join',
      memberCount: 460,
      isVerified: false,
      languages: [LANGUAGE_IDS.en, LANGUAGE_IDS.es],
      interests: [INTEREST_IDS.education, INTEREST_IDS.healthcare],
    },
    {
      id: 'com_faith_and_community_alliance',
      name: 'Faith and Community Alliance',
      slug: 'faith-and-community-alliance',
      description: 'Interfaith alliance offering fellowship, translation help, and settlement support.',
      categoryId: CATEGORY_IDS.social,
      websiteUrl: 'https://faithcommunityalliance.example.org',
      contactEmail: 'welcome@faithcommunityalliance.example.org',
      joinUrl: 'https://faithcommunityalliance.example.org/join',
      memberCount: 1120,
      isVerified: true,
      languages: [LANGUAGE_IDS.en, LANGUAGE_IDS.ar, LANGUAGE_IDS.fr],
      interests: [INTEREST_IDS.culturalEvents, INTEREST_IDS.networking],
    },
    {
      id: 'com_neighborhood_welcome_committee',
      name: 'Neighborhood Welcome Committee',
      slug: 'neighborhood-welcome-committee',
      description: 'Grassroots volunteers who welcome new arrivals with local orientation tours and meals.',
      categoryId: CATEGORY_IDS.social,
      websiteUrl: 'https://neighborhoodwelcome.example.org',
      contactEmail: 'volunteer@neighborhoodwelcome.example.org',
      joinUrl: 'https://neighborhoodwelcome.example.org/join',
      memberCount: 330,
      isVerified: false,
      languages: [LANGUAGE_IDS.en],
      interests: [INTEREST_IDS.culturalEvents, INTEREST_IDS.housing],
    },
  ]

  for (const community of communities) {
    const { languages: langIds, interests: interestIds, ...data } = community
    await prisma.community.upsert({ where: { id: data.id }, update: data, create: data })

    for (const languageId of langIds) {
      await prisma.communityLanguage.upsert({
        where: { communityId_languageId: { communityId: data.id, languageId } },
        update: {},
        create: { communityId: data.id, languageId },
      })
    }
    for (const interestId of interestIds) {
      await prisma.communityInterest.upsert({
        where: { communityId_interestId: { communityId: data.id, interestId } },
        update: {},
        create: { communityId: data.id, interestId },
      })
    }
  }

  // ─── Resources ───────────────────────────────────────────────────────────
  type ResourceSeed = {
    id: string
    title: string
    slug: string
    description: string
    url: string
    type: string
    categoryId: string
    isVerified: boolean
    interests: string[]
  }

  const resources: ResourceSeed[] = [
    {
      id: 'res_visa_application_guide',
      title: 'Complete Guide to Visa Applications',
      slug: 'complete-guide-to-visa-applications',
      description: 'Step-by-step walkthrough of common visa application processes and required documents.',
      url: 'https://resources.example.org/visa-application-guide',
      type: 'guide',
      categoryId: CATEGORY_IDS.immigration,
      isVerified: true,
      interests: [INTEREST_IDS.legalAid],
    },
    {
      id: 'res_tenant_rights_handbook',
      title: 'Tenant Rights Handbook for Newcomers',
      slug: 'tenant-rights-handbook-for-newcomers',
      description: 'Plain-language explanation of tenant rights, lease terms, and how to spot rental scams.',
      url: 'https://resources.example.org/tenant-rights-handbook',
      type: 'guide',
      categoryId: CATEGORY_IDS.immigration,
      isVerified: true,
      interests: [INTEREST_IDS.housing, INTEREST_IDS.legalAid],
    },
    {
      id: 'res_healthcare_enrollment_tool',
      title: 'Healthcare Enrollment Wizard',
      slug: 'healthcare-enrollment-wizard',
      description: 'Interactive tool to determine health coverage eligibility and enrollment steps.',
      url: 'https://resources.example.org/healthcare-enrollment-tool',
      type: 'tool',
      categoryId: CATEGORY_IDS.immigration,
      isVerified: true,
      interests: [INTEREST_IDS.healthcare],
    },
    {
      id: 'res_resume_localization_article',
      title: 'How to Localize Your Resume for a New Job Market',
      slug: 'how-to-localize-your-resume',
      description: 'Article covering resume formatting, tone, and keyword conventions by region.',
      url: 'https://resources.example.org/resume-localization-article',
      type: 'article',
      categoryId: CATEGORY_IDS.professional,
      isVerified: true,
      interests: [INTEREST_IDS.employment],
    },
    {
      id: 'res_credential_evaluation_directory',
      title: 'Directory of Credential Evaluation Services',
      slug: 'credential-evaluation-services-directory',
      description: 'Curated list of agencies that evaluate foreign degrees and professional licenses.',
      url: 'https://resources.example.org/credential-evaluation-directory',
      type: 'guide',
      categoryId: CATEGORY_IDS.professional,
      isVerified: true,
      interests: [INTEREST_IDS.education, INTEREST_IDS.employment],
    },
    {
      id: 'res_networking_events_tool',
      title: 'Professional Networking Events Finder',
      slug: 'professional-networking-events-finder',
      description: 'Tool that surfaces local networking events tailored to your industry and language.',
      url: 'https://resources.example.org/networking-events-tool',
      type: 'tool',
      categoryId: CATEGORY_IDS.professional,
      isVerified: false,
      interests: [INTEREST_IDS.networking],
    },
    {
      id: 'res_small_business_startup_article',
      title: 'Starting a Small Business as a New Immigrant',
      slug: 'starting-a-small-business-as-a-new-immigrant',
      description: 'Overview of licensing, taxes, and funding options for immigrant entrepreneurs.',
      url: 'https://resources.example.org/small-business-startup-article',
      type: 'article',
      categoryId: CATEGORY_IDS.professional,
      isVerified: true,
      interests: [INTEREST_IDS.employment, INTEREST_IDS.education],
    },
    {
      id: 'res_language_learning_apps_guide',
      title: 'Best Language Learning Apps Compared',
      slug: 'best-language-learning-apps-compared',
      description: 'Comparison of free and paid language-learning apps for adult learners.',
      url: 'https://resources.example.org/language-learning-apps-guide',
      type: 'guide',
      categoryId: CATEGORY_IDS.social,
      isVerified: true,
      interests: [INTEREST_IDS.languageLearning],
    },
    {
      id: 'res_cultural_orientation_article',
      title: 'Cultural Orientation: What to Expect in Your First Year',
      slug: 'cultural-orientation-first-year',
      description: 'Article on cultural norms, etiquette, and common adjustment challenges.',
      url: 'https://resources.example.org/cultural-orientation-article',
      type: 'article',
      categoryId: CATEGORY_IDS.social,
      isVerified: false,
      interests: [INTEREST_IDS.culturalEvents],
    },
    {
      id: 'res_school_enrollment_tool',
      title: 'School Enrollment Checklist Tool',
      slug: 'school-enrollment-checklist-tool',
      description: 'Interactive checklist for enrolling children in local schools, by grade level.',
      url: 'https://resources.example.org/school-enrollment-tool',
      type: 'tool',
      categoryId: CATEGORY_IDS.social,
      isVerified: true,
      interests: [INTEREST_IDS.education, INTEREST_IDS.healthcare],
    },
  ]

  for (const resource of resources) {
    const { interests: interestIds, ...data } = resource
    await prisma.resource.upsert({ where: { id: data.id }, update: data, create: data })
    for (const interestId of interestIds) {
      await prisma.resourceInterest.upsert({
        where: { resourceId_interestId: { resourceId: data.id, interestId } },
        update: {},
        create: { resourceId: data.id, interestId },
      })
    }
  }

  // ─── Opportunities ───────────────────────────────────────────────────────
  type OpportunitySeed = {
    id: string
    title: string
    slug: string
    description: string
    type: string
    organizationName: string
    applicationUrl: string
    deadline: Date
    isVerified: boolean
    targetCountry?: string
    requirements?: string
    interests: string[]
  }

  const opportunities: OpportunitySeed[] = [
    {
      id: 'opp_new_futures_scholarship',
      title: 'New Futures Scholarship',
      slug: 'new-futures-scholarship',
      description: 'Merit-based scholarship for immigrant students pursuing undergraduate degrees.',
      type: 'scholarship',
      organizationName: 'New Futures Foundation',
      applicationUrl: 'https://opportunities.example.org/new-futures-scholarship',
      deadline: new Date('2026-03-15'),
      isVerified: true,
      targetCountry: 'US',
      requirements: 'Enrolled full-time, GPA 3.0+, proof of immigration status.',
      interests: [INTEREST_IDS.education],
    },
    {
      id: 'opp_tech_bridge_fellowship',
      title: 'Tech Bridge Fellowship',
      slug: 'tech-bridge-fellowship',
      description: 'Six-month paid fellowship helping internationally trained engineers re-enter tech careers.',
      type: 'program',
      organizationName: 'Tech Bridge Institute',
      applicationUrl: 'https://opportunities.example.org/tech-bridge-fellowship',
      deadline: new Date('2026-02-01'),
      isVerified: true,
      targetCountry: 'CA',
      requirements: 'Bachelor\'s degree in a technical field, work authorization.',
      interests: [INTEREST_IDS.employment, INTEREST_IDS.education],
    },
    {
      id: 'opp_junior_developer_role',
      title: 'Junior Developer (Immigrant Talent Program)',
      slug: 'junior-developer-immigrant-talent-program',
      description: 'Entry-level developer role with mentorship for recent immigrants to the tech sector.',
      type: 'job',
      organizationName: 'Horizon Software Co.',
      applicationUrl: 'https://opportunities.example.org/junior-developer-role',
      deadline: new Date('2026-01-31'),
      isVerified: true,
      targetCountry: 'US',
      requirements: 'Basic proficiency in JavaScript or Python, work authorization.',
      interests: [INTEREST_IDS.employment],
    },
    {
      id: 'opp_healthcare_worker_grant',
      title: 'Healthcare Worker Requalification Grant',
      slug: 'healthcare-worker-requalification-grant',
      description: 'Grant covering exam and licensing fees for internationally trained healthcare workers.',
      type: 'grant',
      organizationName: 'Global Health Access Fund',
      applicationUrl: 'https://opportunities.example.org/healthcare-worker-grant',
      deadline: new Date('2026-04-30'),
      isVerified: true,
      targetCountry: 'US',
      requirements: 'Prior healthcare credential from country of origin.',
      interests: [INTEREST_IDS.healthcare, INTEREST_IDS.employment],
    },
    {
      id: 'opp_small_business_microloan',
      title: 'Immigrant Small Business Microloan',
      slug: 'immigrant-small-business-microloan',
      description: 'Low-interest microloans for immigrant entrepreneurs launching small businesses.',
      type: 'grant',
      organizationName: 'Community Capital Partners',
      applicationUrl: 'https://opportunities.example.org/small-business-microloan',
      deadline: new Date('2026-05-15'),
      isVerified: false,
      targetCountry: 'US',
      requirements: 'Business plan, residency in program area.',
      interests: [INTEREST_IDS.employment],
    },
    {
      id: 'opp_esl_teaching_assistant_job',
      title: 'ESL Teaching Assistant',
      slug: 'esl-teaching-assistant',
      description: 'Part-time role assisting adult ESL classes at a community learning center.',
      type: 'job',
      organizationName: 'Riverside Community Learning Center',
      applicationUrl: 'https://opportunities.example.org/esl-teaching-assistant',
      deadline: new Date('2026-02-20'),
      isVerified: true,
      targetCountry: 'US',
      requirements: 'Fluency in English and one additional language.',
      interests: [INTEREST_IDS.languageLearning, INTEREST_IDS.education],
    },
    {
      id: 'opp_womens_leadership_program',
      title: "Women's Leadership Accelerator",
      slug: 'womens-leadership-accelerator',
      description: 'Twelve-week leadership development program for immigrant women professionals.',
      type: 'program',
      organizationName: 'Rise Together Network',
      applicationUrl: 'https://opportunities.example.org/womens-leadership-program',
      deadline: new Date('2026-03-01'),
      isVerified: true,
      targetCountry: 'CA',
      requirements: '2+ years professional experience, current work authorization.',
      interests: [INTEREST_IDS.employment, INTEREST_IDS.networking],
    },
    {
      id: 'opp_graduate_studies_scholarship',
      title: 'Graduate Studies Scholarship for New Immigrants',
      slug: 'graduate-studies-scholarship-new-immigrants',
      description: 'Partial tuition scholarship for immigrants pursuing graduate degrees.',
      type: 'scholarship',
      organizationName: 'Pathways Education Trust',
      applicationUrl: 'https://opportunities.example.org/graduate-studies-scholarship',
      deadline: new Date('2026-06-01'),
      isVerified: false,
      targetCountry: 'US',
      requirements: 'Accepted into an accredited graduate program.',
      interests: [INTEREST_IDS.education],
    },
  ]

  for (const opportunity of opportunities) {
    const { interests: interestIds, ...data } = opportunity
    await prisma.opportunity.upsert({ where: { id: data.id }, update: data, create: data })
    for (const interestId of interestIds) {
      await prisma.opportunityInterest.upsert({
        where: { opportunityId_interestId: { opportunityId: data.id, interestId } },
        update: {},
        create: { opportunityId: data.id, interestId },
      })
    }
  }

  // ─── Users (Better Auth compatible) ────────────────────────────────────────
  const adminPasswordHash = await hashPassword('AdminPass123!')
  const userPasswordHash = await hashPassword('UserPass123!')

  await prisma.user.upsert({
    where: { id: ADMIN_USER_ID },
    update: {},
    create: {
      id: ADMIN_USER_ID,
      email: 'admin@platform.test',
      emailVerified: true,
      name: 'Platform Admin',
      role: 'admin',
    },
  })

  await prisma.account.upsert({
    where: { providerId_accountId: { providerId: 'credential', accountId: ADMIN_USER_ID } },
    update: { password: adminPasswordHash },
    create: {
      id: ADMIN_ACCOUNT_ID,
      userId: ADMIN_USER_ID,
      accountId: ADMIN_USER_ID,
      providerId: 'credential',
      password: adminPasswordHash,
    },
  })

  await prisma.user.upsert({
    where: { id: TEST_USER_ID },
    update: {},
    create: {
      id: TEST_USER_ID,
      email: 'user@platform.test',
      emailVerified: true,
      name: 'Test User',
      role: 'user',
    },
  })

  await prisma.account.upsert({
    where: { providerId_accountId: { providerId: 'credential', accountId: TEST_USER_ID } },
    update: { password: userPasswordHash },
    create: {
      id: TEST_ACCOUNT_ID,
      userId: TEST_USER_ID,
      accountId: TEST_USER_ID,
      providerId: 'credential',
      password: userPasswordHash,
    },
  })

  // ─── Profile for test user ─────────────────────────────────────────────────
  await prisma.profile.upsert({
    where: { userId: TEST_USER_ID },
    update: {},
    create: {
      id: 'profile_test_seed',
      userId: TEST_USER_ID,
      bio: 'Recently relocated software developer looking to build a new professional and social network.',
      originCountry: 'Syria',
      targetCountry: 'US',
      currentCity: 'Chicago',
      languages: [LANGUAGE_IDS.en, LANGUAGE_IDS.ar],
      interests: [
        INTEREST_IDS.employment,
        INTEREST_IDS.networking,
        INTEREST_IDS.languageLearning,
        INTEREST_IDS.education,
      ],
      goals: 'Find a job in software engineering and build a local support network.',
      immigrationStatus: 'permanent_resident',
      visaType: 'EB-2',
      arrivalDate: new Date('2025-01-10'),
      profileComplete: true,
    },
  })

  // ─── Verification records ──────────────────────────────────────────────────
  const verificationRecords = [
    {
      entityType: 'community',
      entityId: 'com_newcomer_legal_network',
      status: 'VERIFIED',
      verifiedBy: ADMIN_USER_ID,
      notes: 'Confirmed registered non-profit status and active lawyer network.',
    },
    {
      entityType: 'community',
      entityId: 'com_tech_immigrants_network',
      status: 'VERIFIED',
      verifiedBy: ADMIN_USER_ID,
      notes: 'Verified via LinkedIn organization page and member testimonials.',
    },
    {
      entityType: 'community',
      entityId: 'com_housing_helpline_group',
      status: 'PENDING',
      verifiedBy: null,
      notes: 'Awaiting confirmation of volunteer organization registration.',
    },
    {
      entityType: 'resource',
      entityId: 'res_visa_application_guide',
      status: 'VERIFIED',
      verifiedBy: ADMIN_USER_ID,
      notes: 'Reviewed for accuracy against current immigration guidance.',
    },
    {
      entityType: 'resource',
      entityId: 'res_networking_events_tool',
      status: 'PENDING',
      verifiedBy: null,
      notes: 'Tool functionality under review.',
    },
  ]

  for (const record of verificationRecords) {
    await prisma.verificationRecord.upsert({
      where: { entityId: record.entityId },
      update: record,
      create: record,
    })
  }

  console.log('Seed complete.')
  console.log(`  Categories: ${categories.length}`)
  console.log(`  Languages: ${languages.length}`)
  console.log(`  Interests: ${interests.length}`)
  console.log(`  Communities: ${communities.length}`)
  console.log(`  Resources: ${resources.length}`)
  console.log(`  Opportunities: ${opportunities.length}`)
  console.log('  Users: 2 (admin@platform.test, user@platform.test)')
}

main()
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())

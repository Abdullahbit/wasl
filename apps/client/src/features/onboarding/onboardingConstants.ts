/**
 * Defines selectable options and step metadata for the guided onboarding flow.
 *
 * Values stay aligned with the shared ProfileInput contract, while labels
 * provide friendly, localized wording for the UI. Constants for display limits
 * and timing are also centralized here so business meaning stays explicit
 * instead of hiding behind unexplained numbers.
 */

export const arrivalStageOptions = [
  { value: 'Preparing' as const, label: 'Planning to arrive', description: 'Not yet in Türkiye' },
  { value: 'First Week' as const, label: 'First week', description: 'Arrived within the last 7 days' },
  { value: 'First Month' as const, label: 'Less than one month', description: 'Here for a few weeks' },
  { value: 'Settled' as const, label: 'More than one month', description: 'One month or longer in Türkiye' },
] as const;

export const turkishLevelOptions = [
  { value: 'None' as const, label: 'No Turkish', description: 'Just starting' },
  { value: 'Beginner' as const, label: 'Beginner', description: 'Basic phrases and greetings' },
  { value: 'Intermediate' as const, label: 'Intermediate', description: 'Everyday conversations' },
  { value: 'Advanced' as const, label: 'Advanced', description: 'Fluent in most settings' },
  { value: 'Native' as const, label: 'Fluent', description: 'Native or near-native' },
] as const;

export const MAX_VISIBLE_SUGGESTIONS = 8;
export const SUCCESS_NAVIGATION_DELAY_MS = 600;
export const DROPDOWN_CLOSE_DELAY_MS = 150;
export const MAX_MULTI_SELECTIONS = 20;

export const cityOptions = [
  'Istanbul',
  'Ankara',
  'Izmir',
  'Bursa',
  'Antalya',
  'Adana',
  'Konya',
  'Gaziantep',
  'Kayseri',
  'Mersin',
  'Eskisehir',
  'Diyarbakir',
  'Sanliurfa',
  'Malatya',
  'Erzurum',
  'Trabzon',
  'Samsun',
  'Denizli',
  'Sakarya',
] as const;

export const universityOptions = [
  'Beykoz University',
  'Istanbul University',
  'Bogazici University',
  'Istanbul Technical University',
  'Marmara University',
  'Yildiz Technical University',
  'Koc University',
  'Sabanci University',
  'Bilkent University',
  'Middle East Technical University',
  'Ankara University',
  'Hacettepe University',
  'Ege University',
  'Dokuz Eylul University',
  'Gazi University',
  'Ozyegin University',
  'Bahcesehir University',
  'Anadolu University',
  'Akdeniz University',
  'Erciyes University',
] as const;

export const specializationSuggestions = [
  'Computer Engineering',
  'Software Engineering',
  'Artificial Intelligence',
  'Information Systems',
  'Business Administration',
  'Economics',
  'Architecture',
  'Mechanical Engineering',
  'Electrical Engineering',
  'Civil Engineering',
  'Medicine',
  'Law',
  'Education',
  'Psychology',
  'International Relations',
  'Graphic Design',
  'Industrial Engineering',
] as const;

export const interestOptions = [
  'Software',
  'Artificial Intelligence',
  'Entrepreneurship',
  'Design',
  'Business',
  'Education',
  'Culture',
  'Sports',
  'Volunteering',
  'Social Activities',
] as const;

export const goalOptions = [
  'Make friends',
  'Build a professional network',
  'Find career opportunities',
  'Improve Turkish',
  'Adapt to life in Türkiye',
  'Join student communities',
  'Find study support',
  'Discover useful events',
] as const;

export const onboardingSteps = [
  {
    id: 'situation',
    title: 'Your current situation',
    description: 'Tell us where you are based and how long you have been in Türkiye.',
    fields: ['city', 'university', 'arrivalStage'] as const,
  },
  {
    id: 'background',
    title: 'Your background',
    description: 'Share your Turkish level and field of study so we can tailor resources.',
    fields: ['turkishLevel', 'specialization'] as const,
  },
  {
    id: 'interests',
    title: 'Your interests',
    description: 'Select topics you enjoy. Choose at least one if they matter to you.',
    fields: ['interests'] as const,
  },
  {
    id: 'goals',
    title: 'Your goals',
    description: 'What would you like to achieve with WASL? Select all that apply.',
    fields: ['goals'] as const,
  },
  {
    id: 'review',
    title: 'Review and submit',
    description: 'Check your answers before we prepare your personal plan.',
    fields: [] as const,
  },
] as const;

export type OnboardingStepId = (typeof onboardingSteps)[number]['id'];

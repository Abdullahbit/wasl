/**
 * Translation dictionary and mapping helpers for Wasl (وصل)
 * Natural Arabic UX wording with English fallback.
 */

export const ARABIC_MAPPINGS: Record<string, string> = {
  // Categories from backend seed
  cat_immigration_support: 'الدعم القانوني والهجرة',
  cat_professional_development: 'التطوير المهني والعمل',
  cat_social_integration: 'الاندماج الاجتماعي والأنشطة',
  'Immigration Support': 'الدعم القانوني والهجرة',
  'Professional Development': 'التطوير المهني والعمل',
  'Social Integration': 'الاندماج الاجتماعي والأنشطة',

  // Interests from backend seed
  int_housing: 'السكن والإقامة',
  int_employment: 'فرص العمل والتوظيف',
  int_legal_aid: 'المساعدة القانونية والإقامات',
  int_healthcare: 'التأمين والصحة',
  int_education: 'الدراسة والتعليم العالي',
  int_networking: 'بناء شبكة علاقات ومهنيين',
  int_cultural_events: 'الفعاليات الثقافية واللقاءات',
  int_language_learning: 'تعلم وممارسة اللغات',
  Housing: 'السكن والإقامة',
  Employment: 'فرص العمل والتوظيف',
  'Legal Aid': 'المساعدة القانونية والإقامات',
  Healthcare: 'التأمين والصحة',
  Education: 'الدراسة والتعليم العالي',
  Networking: 'بناء شبكة علاقات ومهنيين',
  'Cultural Events': 'الفعاليات الثقافية واللقاءات',
  'Language Learning': 'تعلم وممارسة اللغات',

  // Languages (Arabic, Turkish, English only)
  lang_arabic: 'العربية',
  lang_turkish: 'التركية',
  lang_english: 'الإنجليزية',
  Arabic: 'العربية',
  Turkish: 'التركية',
  English: 'الإنجليزية',

  // Cities
  Istanbul: 'إسطنبول',
  Ankara: 'أنقرة',
  Izmir: 'إزمير',
  Bursa: 'بورصة',
  Antalya: 'أنطاليا',
  Konya: 'قونية',
  Gaziantep: 'غازي عنتاب',
  Chicago: 'إسطنبول (البيئة التجريبية)',

  // Visa / Status
  student_visa: 'إقامة طلابية',
  STUDENT_VISA: 'إقامة طلابية',
  permanent_resident: 'إقامة دائمة / عمل',
  WORK_VISA: 'إقامة عمل',
  TOURIST: 'إقامة سياحية',
}

export function translate(key: string | null | undefined): string {
  if (!key) return ''
  return ARABIC_MAPPINGS[key] || key
}

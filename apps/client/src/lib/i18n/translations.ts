/**
 * Centralizes all user-facing copy for English and Arabic.
 *
 * This file is the single source of truth for translations. Components
 * must use these keys via useTranslation instead of hardcoding English
 * or Arabic strings. Zod validation messages are mapped here as well so
 * they remain translatable without modifying the shared contract.
 */

export const translations = {
  en: {
    common: {
      wasl: 'WASL',
      language: 'Language',
      english: 'English',
      arabic: 'العربية',
    },
    navigation: {
      main: 'Main navigation',
      onboarding: 'Onboarding',
      roadmap: 'Roadmap',
      communities: 'Communities',
      resources: 'Resources',
    },
    home: {
      title: 'Your next step in Türkiye, made clearer.',
      description: 'Discover verified communities, practical resources, and a grounded roadmap for your arrival.',
      cta: 'Build my roadmap',
      pageTitle: 'WASL | Find your next step in Türkiye',
    },
    onboarding: {
      pageTitle: 'Onboarding | WASL',
      heading: 'Build your WASL profile',
      subheading: 'Your answers help WASL recommend communities, resources, and opportunities relevant to you.',
      progress: {
        step: 'Step {{current}} of {{total}}',
        ariaLabel: 'Step {{current}} of {{total}}',
        stepsLabel: 'Onboarding steps',
      },
      steps: {
        situation: {
          title: 'Your current situation',
          description: 'Tell us where you are based and how long you have been in Türkiye.',
        },
        background: {
          title: 'Your background',
          description: 'Share your Turkish level and field of study so we can tailor resources.',
        },
        interests: {
          title: 'Your interests',
          description: 'Select topics you enjoy. Your answers help WASL recommend communities and resources relevant to you.',
          label: 'Interests',
          descriptionText: 'Choose one or more. You can change them later.',
        },
        goals: {
          title: 'Your goals',
          description: 'What would you like to achieve? Select all that apply.',
          label: 'Goals',
          descriptionText: 'Pick the outcomes that matter most for your next months in Türkiye.',
        },
        review: {
          title: 'Review and submit',
          description: 'Check your answers. You can go back to correct anything.',
          situationCard: 'Your current situation',
          backgroundCard: 'Your background',
          interestsCard: 'Your interests',
          goalsCard: 'Your goals',
          city: 'City',
          university: 'University',
          arrivalStage: 'Arrival stage',
          turkishLevel: 'Turkish level',
          specialization: 'Specialization',
          edit: 'Edit',
          editSituation: 'Edit current situation',
          editBackground: 'Edit background',
          editInterests: 'Edit interests',
          editGoals: 'Edit goals',
          noInterests: 'No interests selected.',
          noGoals: 'No goals selected.',
        },
      },
      fields: {
        city: {
          label: 'City',
          placeholder: 'Start typing e.g. Istanbul',
          description: 'We prioritize Istanbul but you can choose any supported city.',
          required: 'City is required',
        },
        university: {
          label: 'University',
          placeholder: 'Search universities e.g. Beykoz University',
          description: 'Start typing to filter. Your exact entry is saved even if not listed.',
          required: 'University is required',
        },
        arrivalStage: {
          label: 'Arrival stage',
          description: 'How long have you been in Türkiye?',
          required: 'Arrival stage is required',
          options: {
            preparing: 'Planning to arrive',
            preparingDesc: 'Not yet in Türkiye',
            firstWeek: 'First week',
            firstWeekDesc: 'Arrived within the last 7 days',
            firstMonth: 'Less than one month',
            firstMonthDesc: 'Here for a few weeks',
            settled: 'More than one month',
            settledDesc: 'One month or longer in Türkiye',
          },
        },
        turkishLevel: {
          label: 'Turkish level',
          description: 'Choose the option that best fits you right now.',
          required: 'Turkish level is required',
          options: {
            none: 'No Turkish',
            noneDesc: 'Just starting',
            beginner: 'Beginner',
            beginnerDesc: 'Basic phrases and greetings',
            intermediate: 'Intermediate',
            intermediateDesc: 'Everyday conversations',
            advanced: 'Advanced',
            advancedDesc: 'Fluent in most settings',
            native: 'Fluent',
            nativeDesc: 'Native or near-native',
          },
        },
        specialization: {
          label: 'Specialization',
          placeholder: 'e.g. Computer Engineering',
          description: 'Your field of study, e.g. Computer Engineering. You can type a custom value.',
          required: 'Specialization is required',
        },
        interests: {
          selected: '{{count}} selected',
        },
        goals: {
          selected: '{{count}} selected',
        },
      },
      actions: {
        back: 'Back',
        continue: 'Continue',
        submit: 'Submit profile',
        saving: 'Saving…',
        progressHint: 'Step {{current}} of {{total}} · Your progress is saved while you continue',
      },
      messages: {
        success: 'Your profile is ready. We’re preparing your personal plan.',
        apiErrorTitle: 'We couldn’t save your profile. Your answers are still here — please try again.',
        limitReached: 'You have reached the maximum of {{max}} selections.',
        noMatches: 'No matches. You can keep your custom entry.',
      },
      placeholders: {
        planTitle: 'Your roadmap',
        planDescription: 'AI-grounded next steps live here.',
        communityDetailsTitle: 'Community details',
        communityDetailsDescription: 'Community details live here.',
        resourcesTitle: 'Resources',
        resourcesDescription: 'Curated newcomer guides live here.',
      },
    },
  },
  ar: {
    common: {
      wasl: 'وصل',
      language: 'اللغة',
      english: 'English',
      arabic: 'العربية',
    },
    navigation: {
      main: 'التنقل الرئيسي',
      onboarding: 'التأهيل',
      roadmap: 'خارطة الطريق',
      communities: 'المجتمعات',
      resources: 'الموارد',
    },
    home: {
      title: 'خطوتك القادمة في تركيا، أوضح.',
      description: 'اكتشف مجتمعات موثوقة وموارد عملية وخارطة طريق واقعية لوصولك.',
      cta: 'أنشئ خارطة طريقي',
      pageTitle: 'وصل | اعثر على خطوتك القادمة في تركيا',
    },
    onboarding: {
      pageTitle: 'التأهيل | وصل',
      heading: 'أنشئ ملفك في وصل',
      subheading: 'تساعدنا إجاباتك على ترشيح المجتمعات والموارد والفرص المناسبة لك.',
      progress: {
        step: 'الخطوة {{current}} من {{total}}',
        ariaLabel: 'الخطوة {{current}} من {{total}}',
        stepsLabel: 'خطوات التأهيل',
      },
      steps: {
        situation: {
          title: 'وضعك الحالي',
          description: 'أخبرنا أين تقيم ومدة وجودك في تركيا.',
        },
        background: {
          title: 'خلفيتك',
          description: 'شاركنا مستواك في التركية ومجال دراستك لنخصص الموارد لك.',
        },
        interests: {
          title: 'اهتماماتك',
          description: 'اختر المواضيع التي تستمتع بها. تساعدنا إجاباتك على ترشيح المجتمعات والموارد المناسبة.',
          label: 'الاهتمامات',
          descriptionText: 'اختر واحداً أو أكثر. يمكنك تغييرها لاحقاً.',
        },
        goals: {
          title: 'أهدافك',
          description: 'ماذا تود تحقيقه؟ اختر كل ما ينطبق.',
          label: 'الأهداف',
          descriptionText: 'اختر النتائج الأكثر أهمية لأشهرك القادمة في تركيا.',
        },
        review: {
          title: 'المراجعة والإرسال',
          description: 'تحقق من إجاباتك. يمكنك العودة لتصحيح أي شيء.',
          situationCard: 'وضعك الحالي',
          backgroundCard: 'خلفيتك',
          interestsCard: 'اهتماماتك',
          goalsCard: 'أهدافك',
          city: 'المدينة',
          university: 'الجامعة',
          arrivalStage: 'مرحلة الوصول',
          turkishLevel: 'مستوى التركية',
          specialization: 'التخصص',
          edit: 'تعديل',
          editSituation: 'تعديل الوضع الحالي',
          editBackground: 'تعديل الخلفية',
          editInterests: 'تعديل الاهتمامات',
          editGoals: 'تعديل الأهداف',
          noInterests: 'لم يتم اختيار اهتمامات.',
          noGoals: 'لم يتم اختيار أهداف.',
        },
      },
      fields: {
        city: {
          label: 'المدينة',
          placeholder: 'ابدأ الكتابة مثلاً إسطنبول',
          description: 'نعطي أولوية لإسطنبول لكن يمكنك اختيار أي مدينة مدعومة.',
          required: 'المدينة مطلوبة',
        },
        university: {
          label: 'الجامعة',
          placeholder: 'ابحث عن الجامعات مثلاً جامعة بيكوز',
          description: 'ابدأ الكتابة للتصفية. يتم حفظ إدخالك حتى لو لم يكن في القائمة.',
          required: 'الجامعة مطلوبة',
        },
        arrivalStage: {
          label: 'مرحلة الوصول',
          description: 'منذ متى وأنت في تركيا؟',
          required: 'مرحلة الوصول مطلوبة',
          options: {
            preparing: 'التخطيط للوصول',
            preparingDesc: 'لم تصل إلى تركيا بعد',
            firstWeek: 'الأسبوع الأول',
            firstWeekDesc: 'وصلت خلال الـ 7 أيام الماضية',
            firstMonth: 'أقل من شهر',
            firstMonthDesc: 'هنا منذ بضعة أسابيع',
            settled: 'أكثر من شهر',
            settledDesc: 'شهر أو أكثر في تركيا',
          },
        },
        turkishLevel: {
          label: 'مستوى التركية',
          description: 'اختر الخيار الأنسب لك حالياً.',
          required: 'مستوى التركية مطلوب',
          options: {
            none: 'بدون تركية',
            noneDesc: 'في البداية',
            beginner: 'مبتدئ',
            beginnerDesc: 'عبارات أساسية وتحيات',
            intermediate: 'متوسط',
            intermediateDesc: 'محادثات يومية',
            advanced: 'متقدم',
            advancedDesc: 'بطلاقة في معظم المواقف',
            native: 'طليق',
            nativeDesc: 'أصلي أو قريب من الأصلي',
          },
        },
        specialization: {
          label: 'التخصص',
          placeholder: 'مثلاً هندسة الحاسوب',
          description: 'مجال دراستك، مثلاً هندسة الحاسوب. يمكنك كتابة قيمة مخصصة.',
          required: 'التخصص مطلوب',
        },
        interests: {
          selected: '{{count}} محدد',
        },
        goals: {
          selected: '{{count}} محدد',
        },
      },
      actions: {
        back: 'رجوع',
        continue: 'متابعة',
        submit: 'إرسال الملف',
        saving: 'جارٍ الحفظ…',
        progressHint: 'الخطوة {{current}} من {{total}} · يتم حفظ تقدمك أثناء المتابعة',
      },
      messages: {
        success: 'ملفك جاهز. نحن نجهز خارطة طريقك الشخصية.',
        apiErrorTitle: 'لم نتمكن من حفظ ملفك. إجاباتك لا تزال هنا — حاول مرة أخرى.',
        limitReached: 'وصلت إلى الحد الأقصى {{max}} اختيار.',
        noMatches: 'لا توجد نتائج. يمكنك الاحتفاظ بإدخالك المخصص.',
      },
      placeholders: {
        planTitle: 'خارطتك',
        planDescription: 'خطواتك التالية المبنية على الذكاء الاصطناعي هنا.',
        communityDetailsTitle: 'تفاصيل المجتمع',
        communityDetailsDescription: 'تفاصيل المجتمع هنا.',
        resourcesTitle: 'الموارد',
        resourcesDescription: 'أدلة مفيدة للقادمين الجدد هنا.',
      },
    },
  },
} as const;

export type Locale = keyof typeof translations;
export type TranslationKeys = typeof translations.en;

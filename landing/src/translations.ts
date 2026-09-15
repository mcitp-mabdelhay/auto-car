export type Language = 'en' | 'ar';

export interface TranslationContent {
  nav: {
    features: string;
    howItWorks: string;
    demo: string;
    privacy: string;
    faq: string;
    getApp: string;
  };
  hero: {
    badge: string;
    titleLine1: string;
    titleHighlight: string;
    titleLine2: string;
    subtitle: string;
    downloadBtn: string;
    demoBtn: string;
    trust1: string;
    trust2: string;
    trust3: string;
  };
  stats: {
    stat1Value: string;
    stat1Label: string;
    stat2Value: string;
    stat2Label: string;
    stat3Value: string;
    stat3Label: string;
    stat4Value: string;
    stat4Label: string;
  };
  features: {
    sectionTag: string;
    title: string;
    subtitle: string;
    items: Array<{
      id: string;
      title: string;
      desc: string;
      tag: string;
    }>;
  };
  demo: {
    sectionTag: string;
    title: string;
    subtitle: string;
    odometerTitle: string;
    odometerHint: string;
    serviceStatusTitle: string;
    engineOil: string;
    brakePads: string;
    transmissionFluid: string;
    sparkPlugs: string;
    goodBadge: string;
    upcomingBadge: string;
    overdueBadge: string;
    lastDoneAt: string;
    dueAt: string;
    addRecordMock: string;
    quickFuelMock: string;
    simulatedTotalCost: string;
    currency: string;
    syncIndicator: string;
  };
  howItWorks: {
    sectionTag: string;
    title: string;
    subtitle: string;
    steps: Array<{
      stepNumber: string;
      title: string;
      desc: string;
    }>;
  };
  privacy: {
    sectionTag: string;
    title: string;
    subtitle: string;
    card1Title: string;
    card1Desc: string;
    card2Title: string;
    card2Desc: string;
    card3Title: string;
    card3Desc: string;
  };
  faq: {
    sectionTag: string;
    title: string;
    subtitle: string;
    questions: Array<{
      q: string;
      a: string;
    }>;
  };
  cta: {
    title: string;
    subtitle: string;
    downloadApk: string;
    githubRepo: string;
    note: string;
  };
  stores: {
    title: string;
    subtitle: string;
    googlePlay: string;
    getItOn: string;
    appStore: string;
    downloadOn: string;
    appGallery: string;
    exploreOn: string;
    apkDirect: string;
    directDownload: string;
    comingSoon: string;
    availableNow: string;
    latestRelease: string;
  };
  footer: {
    tagline: string;
    quickLinks: string;
    resources: string;
    privacyPolicy: string;
    sourceCode: string;
    releaseNotes: string;
    copyright: string;
  };
}

export const translations: Record<Language, TranslationContent> = {
  en: {
    nav: {
      features: 'Features',
      howItWorks: 'How It Works',
      demo: 'Live Demo',
      privacy: 'Security',
      faq: 'FAQ',
      getApp: 'Download App',
    },
    hero: {
      badge: '✨ AutoTracker v1.0 • Google Sheets Powered',
      titleLine1: 'Never Miss Your Car’s',
      titleHighlight: 'Maintenance Interval',
      titleLine2: 'Ever Again',
      subtitle: 'The intelligent car companion that tracks mileage, logs maintenance, stores receipt photos, and syncs directly into your personal Google Sheets — with zero proprietary vendor lock-in.',
      downloadBtn: 'Get AutoTracker APK',
      demoBtn: 'Try Interactive Simulator',
      trust1: '100% Data Ownership',
      trust2: 'Direct Google Drive Sync',
      trust3: 'Bilingual RTL & Dark Mode',
    },
    stats: {
      stat1Value: '0%',
      stat1Label: 'Vendor Lock-in (Your Google Sheet)',
      stat2Value: '1-Click',
      stat2Label: 'Google Calendar Reminders',
      stat3Value: '100%',
      stat3Label: 'Receipts Backed up to Drive',
      stat4Value: '2 Langs',
      stat4Label: 'Full Arabic & English Support',
    },
    features: {
      sectionTag: 'POWERFUL CAPABILITIES',
      title: 'Built for Drivers Who Value Simplicity and Control',
      subtitle: 'Everything you need to keep your vehicle in prime health without complicated subscriptions or third-party database silos.',
      items: [
        {
          id: 'sheets',
          title: 'Direct Google Sheets Sync',
          desc: 'Your maintenance records are stored as an ordinary Google Sheet inside your own Drive. Edit on mobile, desktop, or export to Excel whenever you want.',
          tag: 'Zero Lock-in',
        },
        {
          id: 'receipts',
          title: 'Digital Receipt & Invoice Vault',
          desc: 'Snap pictures of spare parts receipts and mechanic bills directly from your phone. They are neatly uploaded and organized in your Google Drive.',
          tag: 'Receipts',
        },
        {
          id: 'reminders',
          title: 'Google Calendar & Email Alerts',
          desc: 'Schedule upcoming oil changes, timing belt checks, and tyre rotations directly into Google Calendar with automated reminders sent to your Gmail.',
          tag: 'Smart Alerts',
        },
        {
          id: 'mileage',
          title: 'Dynamic Mileage & Odometer Tracking',
          desc: 'Instant visual status indicators classify each component as Good, Upcoming, or Overdue based on your odometer and recommended service thresholds.',
          tag: 'Real-Time',
        },
        {
          id: 'expenses',
          title: 'Fuel & Emergency Repair Tracking',
          desc: 'Log fuel fill-ups, emergency roadside fixes, and spare parts expenses to understand your vehicle’s total cost of ownership over time.',
          tag: 'Cost Analytics',
        },
        {
          id: 'bilingual',
          title: 'Native Bilingual & Night Mode',
          desc: 'Thoughtfully designed with complete Arabic (RTL) and English (LTR) language switching, paired with a modern dark theme for late-night driving.',
          tag: 'UI Experience',
        },
      ],
    },
    demo: {
      sectionTag: 'INTERACTIVE PREVIEW',
      title: 'Experience AutoTracker in Action',
      subtitle: 'Drag the odometer slider to test how maintenance badges dynamically switch from Good to Upcoming and Overdue.',
      odometerTitle: 'Adjust Simulated Odometer Reading:',
      odometerHint: 'Drag the slider to observe how service alerts trigger at varying distances',
      serviceStatusTitle: 'Maintenance Component Status',
      engineOil: 'Engine Oil & Filter',
      brakePads: 'Front Brake Pads',
      transmissionFluid: 'Transmission Fluid',
      sparkPlugs: 'Iridium Spark Plugs',
      goodBadge: 'Good',
      upcomingBadge: 'Upcoming',
      overdueBadge: 'Overdue',
      lastDoneAt: 'Last done at',
      dueAt: 'Due at',
      addRecordMock: '+ Add Maintenance',
      quickFuelMock: '⛽ Quick Fuel Fill',
      simulatedTotalCost: 'Simulated Total Spend',
      currency: 'EGP',
      syncIndicator: 'Synced with Google Drive',
    },
    howItWorks: {
      sectionTag: 'SIMPLE 3-STEP SETUP',
      title: 'Up and Running in Less Than 60 Seconds',
      subtitle: 'No complex registration forms or proprietary account creation required.',
      steps: [
        {
          stepNumber: '01',
          title: 'Sign In With Google',
          desc: 'Log in with your existing Google account. AutoTracker seamlessly connects to Google Drive and Google Sheets APIs.',
        },
        {
          stepNumber: '02',
          title: 'Link or Create Your Vehicle Sheet',
          desc: 'Select an existing maintenance spreadsheet from your Drive or let AutoTracker automatically generate a formatted template.',
        },
        {
          stepNumber: '03',
          title: 'Track, Maintain & Stay Ahead',
          desc: 'Update your current mileage periodically. AutoTracker calculates intervals, schedules calendar alerts, and preserves your receipts.',
        },
      ],
    },
    privacy: {
      sectionTag: 'SECURITY & OWNERSHIP',
      title: 'Your Vehicle Data Belongs to You. Period.',
      subtitle: 'Traditional car apps store your data on their proprietary servers. AutoTracker takes a completely different, privacy-first architectural approach.',
      card1Title: 'Zero Third-Party Cloud Database',
      card1Desc: 'We do not run a centralized database holding your mileage, locations, or vehicle VIN. Your data flows strictly between your phone and your private Google Drive.',
      card2Title: 'Open Format Google Sheets',
      card2Desc: 'Even if you stop using the app, your data is yours in an open spreadsheet. You can open it in Excel, LibreOffice, or share it with buyers when selling your car.',
      card3Title: 'Direct OAuth2 Security',
      card3Desc: 'Authentication is handled directly through Google Identity Services. Your credentials never touch third-party servers.',
    },
    faq: {
      sectionTag: 'FREQUENTLY ASKED QUESTIONS',
      title: 'Got Questions? We Have Answers',
      subtitle: 'Find out how AutoTracker keeps your car maintenance painless and secure.',
      questions: [
        {
          q: 'Do I need to pay for any cloud subscription?',
          a: 'No! AutoTracker uses your existing Google Drive and Google Sheets storage, which includes 15GB free from Google. There are no monthly fees or subscription paywalls.',
        },
        {
          q: 'What happens if I switch phones or lose my device?',
          a: 'Because all your maintenance entries, fuel logs, and receipt images are stored in your personal Google Drive, simply sign in on your new phone and all your car history is immediately there.',
        },
        {
          q: 'Can I track multiple cars?',
          a: 'Yes! You can link different Google Sheets files for each car, or switch between vehicle sheets in settings with a single tap.',
        },
        {
          q: 'How does receipt scanning work?',
          a: 'When you take a photo or select an image of an invoice, AutoTracker uploads the image directly to a dedicated folder in your Google Drive and writes the secure preview link into your sheet.',
        },
        {
          q: 'Does it work offline?',
          a: 'Yes, local changes are stored safely on your device via AsyncStorage and synchronized with your Google Sheet as soon as an internet connection is available.',
        },
      ],
    },
    cta: {
      title: 'Start Tracking Your Vehicle Like a Pro',
      subtitle: 'Join drivers who enjoy peace of mind, pristine maintenance logs, and 100% data ownership.',
      downloadApk: 'Download AutoTracker APK',
      githubRepo: 'Explore Source on GitHub',
      note: 'Compatible with Android 8.0+ • Direct Google Drive & Sheets Integration',
    },
    stores: {
      title: 'Get AutoTracker On Your Device',
      subtitle: 'Install AutoTracker today via direct APK, or follow our upcoming releases on major app stores.',
      googlePlay: 'Google Play',
      getItOn: 'GET IT ON',
      appStore: 'App Store',
      downloadOn: 'Download on the',
      appGallery: 'AppGallery',
      exploreOn: 'EXPLORE IT ON',
      apkDirect: 'Android APK',
      directDownload: 'Direct Download',
      comingSoon: 'Coming Soon',
      availableNow: 'Available Now',
      latestRelease: 'Latest Release (v1.1.0)',
    },
    footer: {
      tagline: 'Smart, privacy-first vehicle maintenance tracking powered by Google Sheets.',
      quickLinks: 'Navigation',
      resources: 'Resources',
      privacyPolicy: 'Privacy & Permissions',
      sourceCode: 'GitHub Repository',
      releaseNotes: 'Release Notes (v1.1.0)',
      copyright: '© 2026 AutoTracker. Open source vehicle management companion.',
    },
  },
  ar: {
    nav: {
      features: 'المميزات',
      howItWorks: 'كيف يعمل؟',
      demo: 'تجربة حية',
      privacy: 'الأمان والخصوصية',
      faq: 'الأسئلة الشائعة',
      getApp: 'تحميل التطبيق',
    },
    hero: {
      badge: '✨ أوتو تراكِر v1.0 • مدعوم بمزامنة Google Sheets',
      titleLine1: 'لا تفوّت موعد صيانة',
      titleHighlight: 'سيارتك الدورية',
      titleLine2: 'بعد اليوم أبدًا',
      subtitle: 'رفيقك الذكي لمتابعة صيانة السيارة، وتتبع قراءة العداد، وأرشفة صور الفواتير، مع مزامنة لحظية في حسابك الشخصي على جداول بيانات Google دون أي قفل احتكاري.',
      downloadBtn: 'تحميل ملف التطبيق APK',
      demoBtn: 'جرّب المعاينة التفاعلية',
      trust1: 'ملكية كاملة 100% لبياناتك',
      trust2: 'مزامنة مباشرة مع Google Drive',
      trust3: 'واجهة عربية بالكامل ونمط داكن',
    },
    stats: {
      stat1Value: '0%',
      stat1Label: 'احتكار للبيانات (ملفك في Google Sheet)',
      stat2Value: 'بنقرة 1',
      stat2Label: 'تنبيهات في تقويم Google',
      stat3Value: '100%',
      stat3Label: 'حفظ الفواتير في Google Drive',
      stat4Value: 'لغتان',
      stat4Label: 'دعم كامل للغة العربية والإنجليزية',
    },
    features: {
      sectionTag: 'إمكانيات فائقة',
      title: 'مصمم خصيصاً لكل سائق يبحث عن البساطة والتحكم الكامل',
      subtitle: 'كل ما تحتاجه للحفاظ على سلامة سيارتك وتجنب الأعطال المكلفة، دون اشتراكات معقدة أو قواعد بيانات خارجية مجهولة.',
      items: [
        {
          id: 'sheets',
          title: 'مزامنة مباشرة مع Google Sheets',
          desc: 'بيانات صيانة سيارتك تُحفظ في ملف Google Sheet داخل حسابك الخاص. يمكنك تعديله أو تصفحه من الهاتف أو الكمبيوتر في أي وقت.',
          tag: 'بياناتك ملكك',
        },
        {
          id: 'receipts',
          title: 'أرشيف رقمي للفواتير والإيصالات',
          desc: 'التقط صور فواتير الصيانة وقطع الغيار مباشرة من هاتفك، وتُحفظ تلقائياً في مجلد آمن ومنظم على Google Drive الخاص بك.',
          tag: 'الفواتير',
        },
        {
          id: 'reminders',
          title: 'تنبيهات تقويم Google والبريد',
          desc: 'أضف مواعيد تغيير الزيت وسيور المحرك والفرامل إلى تقويم Google بضغطة زر مع تنبيهات دورية تصلك عبر بريدك الإلكتروني.',
          tag: 'تنبيهات ذكية',
        },
        {
          id: 'mileage',
          title: 'متابعة ذكية للعداد والكيلومترات',
          desc: 'مؤشرات ألوان ذكية (جيدة، قادمة، متأخرة) تحسب تلقائياً المسافة المتبقية لكل جزء في السيارة بناءً على قراءة العداد الحالية.',
          tag: 'تحديث فوري',
        },
        {
          id: 'expenses',
          title: 'سجل استهلاك الوقود والإصلاحات الطارئة',
          desc: 'سجّل مصاريف التزود بالوقود، والأعطال الطارئة على الطريق، لحساب إجمالي تكاليف التشغيل بدقة وشفافية.',
          tag: 'تقارير التكلفة',
        },
        {
          id: 'bilingual',
          title: 'واجهة عربية أصلية والوضع الليلي',
          desc: 'تصميم أنيق يدعم التوجيه من اليمين لليسار (RTL) بشكل مثالي، مع وضع ليلي مريح للعين أثناء القيادة ليلاً.',
          tag: 'تجربة مستخدم',
        },
      ],
    },
    demo: {
      sectionTag: 'معاينة تفاعلية',
      title: 'جرّب أوتو تراكِر الآن مباشرة',
      subtitle: 'حرّك مؤشر قراءة العداد لتشاهد كيف تتغير حالات أجزاء السيارة تلقائياً بين جيدة وقادمة ومتأخرة.',
      odometerTitle: 'عدّل قراءة العداد التجريبية (كم):',
      odometerHint: 'اسحب الشريط لملاحظة كيف تتفاعل تنبيهات الصيانة مع زيادة المسافة',
      serviceStatusTitle: 'حالة أجزاء الصيانة الحالية',
      engineOil: 'زيت المحرك والفلتر',
      brakePads: 'تيل الفرامل الأمامي',
      transmissionFluid: 'زيت ناقل الحركة (الفتيس)',
      sparkPlugs: 'شمعات الاحتراق (البوجيهات)',
      goodBadge: 'حالة جيدة',
      upcomingBadge: 'صيانة قادمة',
      overdueBadge: 'صيانة متأخرة',
      lastDoneAt: 'تمت الصيانة على',
      dueAt: 'مطلوبة عند',
      addRecordMock: '+ تسجيل صيانة',
      quickFuelMock: '⛽ تعبئة وقود سريعة',
      simulatedTotalCost: 'إجمالي المصروفات التقديرية',
      currency: 'ج.م',
      syncIndicator: 'متزامن مع Google Drive',
    },
    howItWorks: {
      sectionTag: 'خطوات بسيطة',
      title: 'ابدأ الاستخدام خلال أقل من 60 ثانية',
      subtitle: 'لا حاجة لإنشاء حسابات جديدة أو كلمات مرور إضافية.',
      steps: [
        {
          stepNumber: '٠١',
          title: 'سجل الدخول بحساب Google',
          desc: 'سجّل دخولك بحساب Google الخاص بك بأمان لمنح الصلاحية لحفظ البيانات في حسابك.',
        },
        {
          stepNumber: '٠٢',
          title: 'اربط أو أنشئ جدول بيانات جديد',
          desc: 'اختر ملف صيانة موجود مسبقاً في Drive أو دع التطبيق ينشئ لك نموذجاً منسقاً تلقائياً.',
        },
        {
          stepNumber: '٠٣',
          title: 'سجّل العداد وكن مستعداً دائماً',
          desc: 'أدخل قراءة العداد بين الحين والآخر وسيتولى التطبيق حساب المواعيد والتنبيهات وحفظ الفواتير.',
        },
      ],
    },
    privacy: {
      sectionTag: 'الأمان والخصوصية المطلقة',
      title: 'بيانات سيارتك ومصاريفك ملكك أنت فقط',
      subtitle: 'تطبيقات السيارات التقليدية تبيع بياناتك أو تخزنها على خوادمها الخاصة. أوتو تراكِر يعتمد بنية خصوصية رائدة.',
      card1Title: 'بدون أي قواعد بيانات وسيطة',
      card1Desc: 'نحن لا نخزن أي سجلات أو أرقام شاسيه أو تكاليف على أي خادم خارجي. البيانات تنتقل مباشرة بين هاتفك ومساحتك في Google.',
      card2Title: 'تنسيق مفتوح في Google Sheets',
      card2Desc: 'حتى لو حذفت التطبيق، تظل كل بياناتك وصياناتك موجودة في ملف Google Sheet يمكنك فتحه في Excel أو إرساله للمشتري عند بيع السيارة.',
      card3Title: 'أمان وتوثيق رسمي من Google',
      card3Desc: 'يتم تسجيل الدخول وتخزين الملفات عبر بروتوكول OAuth 2.0 المعتمد والمشفر من شركة Google.',
    },
    faq: {
      sectionTag: 'الأسئلة الأكثر شيوعاً',
      title: 'لديك استفسار؟ إليك كل ما تود معرفته',
      subtitle: 'تعرف على كيفية عمل أوتو تراكِر للحفاظ على سيارتك وتوفير تكاليف الصيانة.',
      questions: [
        {
          q: 'هل أحتاج لدفع أي اشتراك شهري أو رسوم؟',
          a: 'لا، التطبيق مجاني بالكامل ويعتمد على مساحتك المجانية المتاحة من Google Drive (15 جيجابايت مجاناً). لا توجد أي رسوم خفية.',
        },
        {
          q: 'ماذا يحدث إذا قمت بتغيير هاتفي المحمول؟',
          a: 'بما أن كل بياناتك محفوظة في حساب Google Drive الخاص بك، بمجرد تثبيت التطبيق وتسجيل الدخول بحسابك ستظهر جميع بيانات سيارتك فوراً.',
        },
        {
          q: 'هل يمكنني إدارة أكثر من سيارة؟',
          a: 'نعم بكل تأكيد! يمكنك تخصيص ملف Google Sheet منفصل لكل سيارة والتبديل بينها بسهولة من الإعدادات.',
        },
        {
          q: 'كيف يعمل إرفاق فواتير الصيانة؟',
          a: 'عند تصوير أي فاتورة أو إيصال قطعة غيار، يقوم التطبيق برفع الصورة تلقائياً لمجلد خاص في Google Drive وربط رابط الفاتورة المباشر في الجدول.',
        },
        {
          q: 'هل يعمل التطبيق دون اتصال بالإنترنت؟',
          a: 'نعم، يتم تخزين المدخلات محلياً على هاتفك، وتتم المزامنة التلقائية مع Google Sheet بمجرد عودة الاتصال بالإنترنت.',
        },
      ],
    },
    cta: {
      title: 'ابدأ إدارة صيانة سيارتك باحترافية اليوم',
      subtitle: 'انضم لآلاف السائقين الذين يحافظون على سياراتهم بأعلى كفاءة وأقل تكلفة.',
      downloadApk: 'تحميل ملف التطبيق APK',
      githubRepo: 'تصفح كود المشروع على GitHub',
      note: 'متوافق مع أجهزة أندرويد 8.0 فما فوق • مزامنة مشفرة ومباشرة مع Google Drive',
    },
    stores: {
      title: 'احصل على أوتو تراكِر لجهازك',
      subtitle: 'ثبّت التطبيق اليوم مباشرة عبر ملف APK، أو ترقب إتاحته رسمياً على المتاجر الإلكترونية قريباً.',
      googlePlay: 'Google Play',
      getItOn: 'احصل عليه من',
      appStore: 'App Store',
      downloadOn: 'حمّله من',
      appGallery: 'AppGallery',
      exploreOn: 'استكشف على',
      apkDirect: 'ملف APK مباشر',
      directDownload: 'تحميل مباشر',
      comingSoon: 'قريباً',
      availableNow: 'متاح الآن',
      latestRelease: 'أحدث إصدار (v1.1.0)',
    },
    footer: {
      tagline: 'الحل الذكي والأكثر أماناً لمتابعة صيانة السيارات عبر Google Sheets.',
      quickLinks: 'روابط سريعة',
      resources: 'المصادر والوثائق',
      privacyPolicy: 'سياسة الخصوصية والصلاحيات',
      sourceCode: 'المستودع على GitHub',
      releaseNotes: 'سجل التحديثات (v1.1.0)',
      copyright: '© 2026 أوتو تراكِر. تطبيق مفتوح المصدر لإدارة وصيانة المركبات.',
    },
  },
};

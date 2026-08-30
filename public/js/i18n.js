/**
 * Al Huda Real Estate - Comprehensive Bilingual Engine (AR / EN)
 * Complete, Pure Sync between Arabic and English with Zero Hardcoded Text
 */

const translations = {
  ar: {
    // Brand & Navigation
    brand_name: "عقارات الهدى",
    brand_tagline: "فخامة التملك في الشيخ زايد",
    portal_badge: "فرع الشيخ زايد VIP",
    nav_home: "الرئيسية",
    nav_properties: "العقارات الفاخرة",
    nav_featured: "المختارات الحصرية",
    nav_services: "خدماتنا",
    nav_calculator: "حاسبة التمويل",
    nav_about: "عن الهدى",
    nav_contact: "تواصل معنا",
    nav_wishlist: "المفضلة",
    btn_request_viewing: "طلب معاينة",
    btn_view_details: "تفاصيل العقار",
    btn_call_agent: "اتصال بالوكيل",
    btn_whatsapp: "واتساب مباشر",
    btn_add_to_wishlist: "إضافة للمفضلة",
    btn_remove_from_wishlist: "إزالة من المفضلة",
    btn_share: "مشاركة العقار",
    btn_filter_now: "تطبيق الفلترة",
    btn_reset_filters: "إعادة ضبط",
    btn_explore_portfolio: "استكشف محفظة زايد",
    btn_schedule_consultation: "حجز استشارة خاصة",
    btn_submit_booking: "تأكيد طلب المعاينة",
    btn_send_inquiry: "إرسال الطلب الآن",
    btn_cancel: "إلغاء",
    btn_save_property: "حفظ العقار",

    // Hero Section
    hero_badge: "✨ المحفظة العقارية الأرقى في مدينة الشيخ زايد",
    hero_title_1: "اكتشف قمة الفخامة",
    hero_title_2: "في قلب مدينة الشيخ زايد",
    hero_desc: "نقدم لك أرقى القصور، الفلل المستقلة، التاون هاوس، والشقق الفاخرة والمفروشة في أفخم كمبوندات مدينة الشيخ زايد.",
    hero_stat_portfolio: "إجمالي قيمة العقارات",
    hero_stat_portfolio_val: "2.5B+ ج.م",
    hero_stat_properties: "عقار فاخر متاح",
    hero_stat_properties_val: "180+",
    hero_stat_clients: "عميل VIP راضٍ",
    hero_stat_clients_val: "950+",
    hero_stat_experience: "سنوات في الشيخ زايد",
    hero_stat_experience_val: "15+",

    // Search & Filter Box
    filter_tab_all: "جميع العقارات",
    filter_tab_sale: "للبيع",
    filter_tab_rent: "إيجار عادي",
    filter_tab_furnished: "إيجار مفروش",
    filter_search_placeholder: "ابحث باسم الكمبوند، العقار، أو المواصفات...",
    filter_search_label: "البحث والكلمات الدلالية",
    filter_city_label: "الكمبوند / المنطقة بالشيخ زايد",
    filter_city_all: "كل كمبوندات زايد",
    filter_district_beverly: "بيفرلي هيلز (Beverly Hills)",
    filter_district_allegria: "أليجريا (Allegria Golf)",
    filter_district_zed: "أبراج زد (Zed Towers)",
    filter_district_westown: "ويست تاون سوديك (Westown)",
    filter_district_karma: "كمبوند الكرمة (Karma)",
    filter_district_palmhills: "بالم هيلز زايد (Palm Hills)",
    filter_district_royal: "رويال سيتي (Royal City)",
    filter_district_bellevie: "بيل في إعمار (Belle Vie)",
    filter_type_label: "نوع العقار",
    filter_type_all: "كل الأنواع",
    filter_type_mansion: "قصور ملكية",
    filter_type_villa: "فلل مستقلة",
    filter_type_townhouse: "تاون هاوس / توين",
    filter_type_penthouse: "بنتهاوس",
    filter_type_apartment: "شقق فاخرة",
    filter_type_duplex: "دوبلكس بحديقة",
    filter_type_commercial: "مقار تجارية وإدارية",
    filter_price_label: "نطاق السعر (ج.م)",
    filter_price_min: "الحد الأدنى (ج.م)",
    filter_price_max: "الحد الأقصى (ج.م)",
    filter_beds_label: "غرف النوم",
    filter_beds_any: "أي عدد",
    filter_beds_2: "2 غرف نوم",
    filter_beds_3: "3+ غرف نوم",
    filter_beds_4: "4+ غرف نوم",
    filter_beds_5: "5+ غرف نوم ملكية",
    filter_amenity_label: "الميزة الخاصة",
    filter_amenity_all: "كل المزايا",
    filter_results_count: "تم العثور على {count} عقار فاخر في الشيخ زايد",
    filter_no_results: "لم يتم العثور على عقارات تطابق خيارات البحث الحالية في الشيخ زايد",
    filter_searching: "جاري البحث في عقارات الشيخ زايد...",

    // Specs & Details
    spec_bedrooms: "غرف نوم",
    spec_bathrooms: "حمامات",
    spec_area: "المساحة",
    spec_floors: "عدد الطوابق",
    spec_sqm: "م²",
    spec_sqft: "قدم²",
    status_for_sale: "للبيع",
    status_for_rent: "إيجار عادي",
    status_furnished_rent: "إيجار مفروش فاخر",

    // Updated Amenities List
    amenity_private_pool: "حمام سباحة خاص",
    amenity_private_garden: "حديقة خاصة منسقة",
    amenity_security_24_7: "أمن وحراسة 24/7",
    amenity_smart_home: "نظام ذكي متكامل",
    amenity_super_lux: "تشطيب فاخر / سوبر لوكس",
    amenity_central_ac: "تكييف مركزي بالكامل",
    amenity_fitted_kitchen: "مطبخ مجهز بأحدث الأجهزة",
    amenity_private_garage: "موقف سيارات خاص / كراج",

    // Sections
    sec_featured_title: "المختارات الحصرية بالشيخ زايد",
    sec_featured_headline_1: "فلل وقصور استثنائية",
    sec_featured_headline_2: "في قلب الشيخ زايد",
    sec_featured_subtitle: "عقارات استثنائية تم انتقاؤها بعناية فائقة في أرقى كمبوندات الشيخ زايد",
    sec_properties_tag: "عقارات الشيخ زايد",
    sec_properties_title: "مجموعتنا الفاخرة بالشيخ زايد",
    sec_properties_subtitle: "تصفح أندر الفلل، التاون هاوس، والشقق المفروشة بالشيخ زايد",
    sec_why_title: "لماذا تختار عقارات الهدى بالشيخ زايد؟",
    sec_why_headline_1: "خدمات راقية مصممة",
    sec_why_headline_2: "لأرقى كمبوندات زايد",
    sec_why_subtitle: "خبرة عميقة وشبكة علاقات واسعة في أفخم مشاريع الشيخ زايد",
    sec_calculator_title: "حاسبة التمويل والأقساط التقديرية",
    sec_calculator_subtitle: "احسب قسطك الشهري المتوقع بالجنيه المصري بدقة",
    sec_contact_title: "تواصل معنا",
    sec_contact_headline_1: "تواصل مع",
    sec_contact_headline_2: "مستشارك العقاري بالشيخ زايد",
    sec_contact_subtitle: "نحن هنا لمساعدتكم في اختيار العقار الأنسب في الشيخ زايد",

    // Features / Why Choose Us
    feature_1_title: "تخصص كامل بالشيخ زايد",
    feature_1_desc: "دراية شاملة بأدق تفاصيل الكمبوندات والمخططات والفرص الذهبية في الشيخ زايد.",
    feature_2_title: "عقارات مفروشة جاهزة للسكن",
    feature_2_desc: "باقة حصرية من الفلل والشقق المفروشة بأرقى الأثاث الأوروبي للإيجار الفوري.",
    feature_3_title: "عقارات حصرية غير معلنة",
    feature_3_desc: "وصول مباشر لأندر القصور والفلل المستقلة مباشرة من الملاك وكبار المطورين.",
    feature_4_title: "خدمة استشارية وقانونية",
    feature_4_desc: "متابعة قانونية وإدارية وإنهاء كافة إجراءات نقل الملكية وعقود الإيجار بسلاسة.",

    // Mortgage Calculator
    calc_prop_price: "سعر العقار (ج.م)",
    calc_down_payment: "الدفعة الأولى / المقدم",
    calc_loan_term: "مدة التقسيط (بالسنوات)",
    calc_interest_rate: "نسبة الفائدة السنوية (%)",
    calc_monthly_payment: "القسط الشهري التقديري",
    calc_loan_amount: "مبلغ التمويل:",
    calc_total_interest: "إجمالي الفوائد:",
    calc_btn_consult: "طلب استشارة تمويلية",
    calc_years: "سنوات",

    // Viewing Modal
    viewing_modal_title: "حجز موعد معاينة خاصة",
    viewing_modal_subtitle: "حدد الموعد الأنسب لمعاينة العقار بالشيخ زايد",
    viewing_selected_property: "العقار المختار:",
    viewing_mode_label: "نوع المعاينة المطلوبة",
    viewing_mode_in_person: "معاينة ميدانية خاصة (VIP In-Person)",
    viewing_mode_virtual: "جولة افتراضية تفاعلية ثلاثية الأبعاد (Virtual 3D)",
    viewing_name_label: "الاسم الكامل",
    viewing_phone_label: "رقم الهاتف / الواتساب",
    viewing_email_label: "البريد الإلكتروني",
    viewing_date_label: "التاريخ المفضل",
    viewing_time_label: "الوقت المفضل",
    viewing_notes_label: "ملاحظات أو متطلبات خاصة",
    viewing_notes_placeholder: "مثال: الاستفسار عن تفاصيل الفرش أو موعد التسليم...",
    viewing_success_title: "تم استلام طلب المعاينة بنجاح!",
    viewing_success_msg: "شكراً لاهتمامكم. سيتواصل معكم مستشار عقارات الهدى بالشيخ زايد لتأكيد الموعد.",
    viewing_time_12: "12:00 ظهراً",
    viewing_time_14: "02:00 ظهراً",
    viewing_time_16: "04:00 عصراً",
    viewing_time_18: "06:00 مساءً (وقت الغروب)",
    viewing_time_20: "08:00 مساءً",

    // Property Details Modal
    modal_details_title: "الوصف والتفاصيل",
    modal_amenities_title: "المزايا والمرافق الحصرية",
    modal_btn_whatsapp: "واتساب مباشر مع المستشار",
    modal_video_badge: "فيديو جولة العقار",

    // Wishlist Drawer
    wishlist_title: "قائمة العقارات المفضلة",
    wishlist_empty: "لم تقم بإضافة أي عقارات بالشيخ زايد إلى المفضلة بعد.",
    wishlist_explore_btn: "استعرض عقارات الشيخ زايد",
    wishlist_total_value: "إجمالي قيمة المختارات:",
    wishlist_request_all: "طلب استشارة لجميع المفضلة",

    // Contact Form & Info
    contact_office_title: "مكتب الشيخ زايد",
    contact_office_address: "محور 26 يوليو، مدخل زايد 2، مدينة الشيخ زايد، الجيزة، مصر",
    contact_phone_title: "الخط المباشر",
    contact_email_title: "البريد الإلكتروني",
    form_name: "الاسم الكريم",
    form_email: "البريد الإلكتروني",
    form_phone: "رقم الموبايل / الواتساب",
    form_subject: "الكمبوند أو نوع الطلب بالشيخ زايد",
    form_message: "تفاصيل طلبك أو استفسارك...",
    form_submit: "إرسال الطلب الآن",
    form_success: "تم إرسال رسالتكم بنجاح. سيتواصل معكم مستشارنا بالشيخ زايد في أقرب وقت.",

    // Footer
    footer_desc: "الشركة الرائدة والمتخصصة في تسويق واستشارات العقارات الفاخرة والمفروشة في مدينة الشيخ زايد، مصر.",
    footer_quick_links: "روابط سريعة",
    footer_locations: "أبرز كمبوندات زايد",
    footer_loc_1: "فلل كمبوند أليجريا",
    footer_loc_2: "فلل ومنازل بيفرلي هيلز",
    footer_loc_3: "أبراج زد بارك الشيخ زايد",
    footer_loc_4: "كمبوند ويست تاون سوديك",
    footer_loc_5: "قصور كمبوند الكرمة",
    footer_newsletter_title: "نشرة عقارات زايد الحصرية",
    footer_newsletter_desc: "اشترك لتصلك أحدث الفلل والشقق المفروشة في الشيخ زايد فور طرحها.",
    footer_newsletter_placeholder: "بريدك الإلكتروني",
    footer_newsletter_btn: "اشتراك",
    footer_rights: "جميع الحقوق محفوظة © 2026 شركة عقارات الهدى - الشيخ زايد، مصر.",
    footer_privacy: "سياسة الخصوصية",
    footer_terms: "الشروط والأحكام",

    // Admin Dashboard
    admin_title: "لوحة تحكم عقارات الهدى - الشيخ زايد",
    admin_subtitle: "إدارة العقارات، الإيجار المفروش، وطلبات المعاينة",
    admin_tab_stats: "نظرة عامة وإحصائيات",
    admin_tab_properties: "إدارة عقارات زايد",
    admin_tab_viewings: "طلبات المعاينة",
    admin_tab_inquiries: "الاستفسارات والرسائل",
    admin_tab_settings: "أدوات النظام والنسخ",
    admin_add_property: "+ إضافة عقار بالشيخ زايد",
    admin_edit_property: "تعديل بيانات العقار",
    admin_delete_confirm: "هل أنت متأكد من رغبتك في حذف هذا العقار؟",
    admin_status_pending: "قيد الانتظار",
    admin_status_confirmed: "تم التأكيد",
    admin_status_completed: "تمت المعاينة",
    admin_status_cancelled: "ملغي",
    admin_inquiry_new: "جديد",
    admin_inquiry_progress: "قيد المتابعة",
    admin_inquiry_resolved: "تمت المعالجة",
    admin_back_to_site: "العودة للموقع الرئيسي",
    admin_whatsapp_client: "مراسلة العميل واتساب",

    // Admin Stats Cards
    admin_stat_total_props: "عقار بالشيخ زايد",
    admin_stat_total_val: "إجمالي قيمة المحفظة",
    admin_stat_total_viewings: "إجمالي طلبات المعاينة",
    admin_stat_pending_viewings: "طلبات معاينة قيد الانتظار",
    admin_breakdown_title: "توزيع العقارات حسب الفئة",
    admin_actions_title: "إجراءات سريعة",
    admin_action_add: "إضافة عقار جديد بالشيخ زايد",
    admin_action_viewings: "مراجعة طلبات المعاينة الواردة",
    admin_action_export: "تصدير نسخة احتياطية من البيانات",

    // Admin Tables
    admin_th_property: "العقار",
    admin_th_price: "السعر (ج.م)",
    admin_th_type: "النوع",
    admin_th_compound: "الكمبوند / المنطقة",
    admin_th_status: "الحالة / الغرض",
    admin_th_featured: "مميز",
    admin_th_actions: "الإجراءات",
    admin_th_client: "بيانات العميل",
    admin_th_prop_req: "العقار المطلوب بالشيخ زايد",
    admin_th_date: "الموعد المفضل",
    admin_th_mode: "نوع الجولة",
    admin_th_notes: "ملاحظات العميل",
    admin_th_sender: "المرسل",
    admin_th_subject: "الموضوع",
    admin_th_message: "نص الرسالة",

    // Admin Form Labels
    admin_lbl_title_ar: "عنوان العقار بالعربية *",
    admin_lbl_title_en: "Property Title (English) *",
    admin_lbl_desc_ar: "الوصف الكامل بالعربية",
    admin_lbl_desc_en: "Full Description (English)",
    admin_lbl_price: "السعر بالجنيه المصري (ج.م) *",
    admin_lbl_type: "نوع العقار",
    admin_lbl_status: "حالة العقار / الغرض *",
    admin_lbl_district_ar: "الكمبوند / الحي (عربي) *",
    admin_lbl_district_en: "Compound / District (English) *",
    admin_lbl_address_ar: "العنوان التفصيلي بالشيخ زايد (عربي)",
    admin_lbl_address_en: "Address in Sheikh Zayed (English)",
    admin_lbl_bedrooms: "غرف النوم (Dropdown)",
    admin_lbl_bathrooms: "دورات المياه / الحمامات (Dropdown)",
    admin_lbl_floors: "عدد الطوابق (Dropdown)",
    admin_lbl_area: "المساحة الإجمالية (م²)",
    admin_lbl_amenities: "المزايا والمرافق الخاصة",
    admin_lbl_featured: "عقار مميز بالشيخ زايد (Featured)",
    admin_lbl_badge_ar: "شارة التميز (عربي)",
    admin_lbl_badge_en: "Badge (English)",

    // Local Media Upload Strings
    admin_upload_heading: "رفع الصور والفيديوهات من جهازك",
    admin_upload_subheading: "اسحب وأفلت الملفات هنا أو اضغط للاختيار من الكمبيوتر (يدعم الصور والفيديوهات)",
    admin_upload_btn_text: "اختيار ملفات من الجهاز",
    admin_upload_url_label: "أو روابط صور وفيديوهات إضافية (رابط واحد في كل سطر)",

    // Admin DB Tools
    admin_backup_title: "تصدير البيانات (JSON)",
    admin_backup_desc: "قم بتحميل ملف JSON يحتوي على كامل عقارات الشيخ زايد، طلبات المعاينة، والاستفسارات لحفظها كنسخة احتياطية.",
    admin_backup_btn: "تحميل النسخة الاحتياطية",
    admin_restore_title: "استعادة البيانات الافتراضية",
    admin_restore_desc: "إعادة ضبط قاعدة البيانات إلى عقارات الشيخ زايد النموذجية.",
    admin_restore_btn: "استعادة البيانات الافتراضية",

    // General
    loading: "جاري التحميل...",
    currency_symbol: "ج.م"
  },
  en: {
    // Brand & Navigation
    brand_name: "Al Huda Real Estate",
    brand_tagline: "Luxury Living in Sheikh Zayed City",
    portal_badge: "Sheikh Zayed VIP Branch",
    nav_home: "Home",
    nav_properties: "Properties",
    nav_featured: "Exclusive Collection",
    nav_services: "Services",
    nav_calculator: "Mortgage Calculator",
    nav_about: "About Us",
    nav_contact: "Contact Us",
    nav_wishlist: "Wishlist",
    btn_request_viewing: "Request Viewing",
    btn_view_details: "View Details",
    btn_call_agent: "Call Consultant",
    btn_whatsapp: "WhatsApp",
    btn_add_to_wishlist: "Add to Wishlist",
    btn_remove_from_wishlist: "Remove",
    btn_share: "Share Property",
    btn_filter_now: "Apply Filters",
    btn_reset_filters: "Reset Filters",
    btn_explore_portfolio: "Explore Zayed Portfolio",
    btn_schedule_consultation: "Private Consultation",
    btn_submit_booking: "Confirm Viewing Request",
    btn_send_inquiry: "Send Request Now",
    btn_cancel: "Cancel",
    btn_save_property: "Save Property",

    // Hero Section
    hero_badge: "✨ The Leading Luxury Real Estate Specialist in Sheikh Zayed City",
    hero_title_1: "Experience Unrivaled Luxury",
    hero_title_2: "In Sheikh Zayed City",
    hero_desc: "Discover prime standalone villas, modern townhouses, signature penthouses, and ultra-luxury furnished residences across Sheikh Zayed's premier gated compounds.",
    hero_stat_portfolio: "Total Portfolio Value",
    hero_stat_portfolio_val: "2.5B+ EGP",
    hero_stat_properties: "Zayed Properties",
    hero_stat_properties_val: "180+",
    hero_stat_clients: "Satisfied VIP Clients",
    hero_stat_clients_val: "950+",
    hero_stat_experience: "Years in Sheikh Zayed",
    hero_stat_experience_val: "15+",

    // Search & Filter Box
    filter_tab_all: "All Properties",
    filter_tab_sale: "For Sale",
    filter_tab_rent: "Regular Rent",
    filter_tab_furnished: "Furnished Rent",
    filter_search_placeholder: "Search compound, property name, or specs...",
    filter_search_label: "Search & Keywords",
    filter_city_label: "Compound / Location in Sheikh Zayed",
    filter_city_all: "All Sheikh Zayed Compounds",
    filter_district_beverly: "Beverly Hills",
    filter_district_allegria: "Allegria Golf",
    filter_district_zed: "Zed Towers",
    filter_district_westown: "Westown Sodic",
    filter_district_karma: "Karma Compound",
    filter_district_palmhills: "Palm Hills Zayed",
    filter_district_royal: "Royal City",
    filter_district_bellevie: "Belle Vie Emaar",
    filter_type_label: "Property Type",
    filter_type_all: "All Types",
    filter_type_mansion: "Palaces & Mansions",
    filter_type_villa: "Standalone Villas",
    filter_type_townhouse: "Townhouses & Twin Houses",
    filter_type_penthouse: "Sky Penthouses",
    filter_type_apartment: "Luxury Apartments",
    filter_type_duplex: "Garden Duplexes",
    filter_type_commercial: "Corporate & Commercial",
    filter_price_label: "Price Range (EGP)",
    filter_price_min: "Min Price (EGP)",
    filter_price_max: "Max Price (EGP)",
    filter_beds_label: "Bedrooms",
    filter_beds_any: "Any Bedrooms",
    filter_beds_2: "2 Bedrooms",
    filter_beds_3: "3+ Bedrooms",
    filter_beds_4: "4+ Bedrooms",
    filter_beds_5: "5+ Bedrooms",
    filter_amenity_label: "Key Amenity",
    filter_amenity_all: "All Amenities",
    filter_results_count: "Found {count} luxury properties in Sheikh Zayed",
    filter_no_results: "No properties matched your criteria in Sheikh Zayed City.",
    filter_searching: "Searching Sheikh Zayed properties...",

    // Specs & Details
    spec_bedrooms: "Bedrooms",
    spec_bathrooms: "Bathrooms",
    spec_area: "Built Area",
    spec_floors: "Floors",
    spec_sqm: "m²",
    spec_sqft: "sq.ft",
    status_for_sale: "For Sale",
    status_for_rent: "Regular Rent",
    status_furnished_rent: "Furnished Rent",

    // Updated Amenities List
    amenity_private_pool: "Private Swimming Pool",
    amenity_private_garden: "Landscaped Private Garden",
    amenity_security_24_7: "24/7 Security & Guard",
    amenity_smart_home: "Smart Home Automation",
    amenity_super_lux: "Super Lux / Ultra Luxury Finish",
    amenity_central_ac: "Full Central AC",
    amenity_fitted_kitchen: "Fitted Modern Kitchen",
    amenity_private_garage: "Private Parking Garage",

    // Sections
    sec_featured_title: "The Sheikh Zayed Collection",
    sec_featured_headline_1: "Exceptional Villas & Mansions",
    sec_featured_headline_2: "In Sheikh Zayed City",
    sec_featured_subtitle: "Handpicked trophy properties in premier Sheikh Zayed compounds",
    sec_properties_tag: "Sheikh Zayed Portfolio",
    sec_properties_title: "Our Exclusive Zayed Collection",
    sec_properties_subtitle: "Browse rare standalone villas, townhouses, and luxury furnished residences",
    sec_why_title: "Why Al Huda in Sheikh Zayed?",
    sec_why_headline_1: "Bespoke Services Tailored for",
    sec_why_headline_2: "Premier Zayed Communities",
    sec_why_subtitle: "Unmatched expertise, trusted relationships, and prime listings in Sheikh Zayed City",
    sec_calculator_title: "Mortgage & Installment Calculator",
    sec_calculator_subtitle: "Estimate monthly commitments in Egyptian Pounds (EGP)",
    sec_contact_title: "Contact Us",
    sec_contact_headline_1: "Connect With",
    sec_contact_headline_2: "Your Sheikh Zayed Advisor",
    sec_contact_subtitle: "Our property consultants in Sheikh Zayed are ready to assist you",

    // Features / Why Choose Us
    feature_1_title: "Sheikh Zayed Specialists",
    feature_1_desc: "In-depth market knowledge across every prime gated community and compound in Sheikh Zayed.",
    feature_2_title: "Turnkey Furnished Rentals",
    feature_2_desc: "Exclusive designer furnished villas and apartments ready for immediate move-in.",
    feature_3_title: "Off-Market Assets",
    feature_3_desc: "Direct access to rare trophy estates and unlisted properties from verified owners.",
    feature_4_title: "Full Advisory & Legal Support",
    feature_4_desc: "Seamless contract drafting, title registration, and post-purchase management.",

    // Mortgage Calculator
    calc_prop_price: "Property Price (EGP)",
    calc_down_payment: "Down Payment / Deposit",
    calc_loan_term: "Installment Term (Years)",
    calc_interest_rate: "Annual Interest Rate (%)",
    calc_monthly_payment: "Estimated Monthly Payment",
    calc_loan_amount: "Loan Principal:",
    calc_total_interest: "Total Interest:",
    calc_btn_consult: "Request Financial Advisory",
    calc_years: "Years",

    // Viewing Modal
    viewing_modal_title: "Schedule a Private Viewing",
    viewing_modal_subtitle: "Select your preferred slot to tour properties in Sheikh Zayed",
    viewing_selected_property: "Selected Property:",
    viewing_mode_label: "Tour Preference",
    viewing_mode_in_person: "Private In-Person Tour (VIP)",
    viewing_mode_virtual: "Interactive 3D Virtual Tour",
    viewing_name_label: "Full Name",
    viewing_phone_label: "Phone / WhatsApp",
    viewing_email_label: "Email Address",
    viewing_date_label: "Preferred Date",
    viewing_time_label: "Preferred Time",
    viewing_notes_label: "Special Requests or Notes",
    viewing_notes_placeholder: "e.g., inquiry about furnishing or handover date...",
    viewing_success_title: "Viewing Request Submitted Successfully!",
    viewing_success_msg: "Thank you. Our Sheikh Zayed consultant will contact you shortly to confirm the appointment.",
    viewing_time_12: "12:00 PM",
    viewing_time_14: "02:00 PM",
    viewing_time_16: "04:00 PM",
    viewing_time_18: "06:00 PM (Sunset)",
    viewing_time_20: "08:00 PM",

    // Property Details Modal
    modal_details_title: "Description & Details",
    modal_amenities_title: "Exclusive Amenities & Features",
    modal_btn_whatsapp: "Direct WhatsApp with Consultant",
    modal_video_badge: "Property Video Tour",

    // Wishlist Drawer
    wishlist_title: "Your Saved Zayed Properties",
    wishlist_empty: "Your wishlist is currently empty.",
    wishlist_explore_btn: "Explore Sheikh Zayed Properties",
    wishlist_total_value: "Total Portfolio Value:",
    wishlist_request_all: "Request Advisory for All Saved",

    // Contact Form & Info
    contact_office_title: "Sheikh Zayed Office",
    contact_office_address: "26th of July Corridor, Zayed Gate 2, Sheikh Zayed City, Giza, Egypt",
    contact_phone_title: "Direct Hotline",
    contact_email_title: "Email Address",
    form_name: "Full Name",
    form_email: "Email Address",
    form_phone: "Mobile Phone / WhatsApp",
    form_subject: "Compound or Request Type in Sheikh Zayed",
    form_message: "Your message details and specifications...",
    form_submit: "Send Request Now",
    form_success: "Your message has been received. Our Sheikh Zayed advisor will contact you shortly.",

    // Footer
    footer_desc: "The premier real estate brokerage and advisory firm specialized in luxury and furnished properties in Sheikh Zayed City, Egypt.",
    footer_quick_links: "Quick Navigation",
    footer_locations: "Prime Zayed Compounds",
    footer_loc_1: "Allegria Golf Villas",
    footer_loc_2: "Beverly Hills Residences",
    footer_loc_3: "Zed Park Towers Zayed",
    footer_loc_4: "Westown Sodic Compound",
    footer_loc_5: "Karma Compound Mansions",
    footer_newsletter_title: "Zayed Luxury Dispatch",
    footer_newsletter_desc: "Subscribe to receive off-market and furnished listings in Sheikh Zayed.",
    footer_newsletter_placeholder: "Your Email Address",
    footer_newsletter_btn: "Subscribe",
    footer_rights: "All rights reserved © 2026 Al Huda Real Estate - Sheikh Zayed City, Egypt.",
    footer_privacy: "Privacy Policy",
    footer_terms: "Terms of Service",

    // Admin Dashboard
    admin_title: "Al Huda Real Estate - Sheikh Zayed Portal",
    admin_subtitle: "Manage Sheikh Zayed properties, viewings, and client inquiries",
    admin_tab_stats: "Executive Overview",
    admin_tab_properties: "Manage Properties",
    admin_tab_viewings: "Viewing Bookings",
    admin_tab_inquiries: "Client Inquiries",
    admin_tab_settings: "Database & Backups",
    admin_add_property: "+ Add Sheikh Zayed Property",
    admin_edit_property: "Edit Property Details",
    admin_delete_confirm: "Are you sure you want to delete this property listing?",
    admin_status_pending: "Pending",
    admin_status_confirmed: "Confirmed",
    admin_status_completed: "Completed",
    admin_status_cancelled: "Cancelled",
    admin_inquiry_new: "New",
    admin_inquiry_progress: "In Progress",
    admin_inquiry_resolved: "Resolved",
    admin_back_to_site: "Back to Public Site",
    admin_whatsapp_client: "Message via WhatsApp",

    // Admin Stats Cards
    admin_stat_total_props: "Properties in Zayed",
    admin_stat_total_val: "Total Portfolio Value",
    admin_stat_total_viewings: "Total Viewing Requests",
    admin_stat_pending_viewings: "Pending Viewing Requests",
    admin_breakdown_title: "Properties by Category",
    admin_actions_title: "Quick Actions",
    admin_action_add: "Add New Property in Zayed",
    admin_action_viewings: "Review Incoming Viewings",
    admin_action_export: "Export Database Backup",

    // Admin Tables
    admin_th_property: "Property",
    admin_th_price: "Price (EGP)",
    admin_th_type: "Type",
    admin_th_compound: "Compound / Area",
    admin_th_status: "Status / Purpose",
    admin_th_featured: "Featured",
    admin_th_actions: "Actions",
    admin_th_client: "Client Info",
    admin_th_prop_req: "Requested Property",
    admin_th_date: "Preferred Date",
    admin_th_mode: "Tour Mode",
    admin_th_notes: "Client Notes",
    admin_th_sender: "Sender",
    admin_th_subject: "Subject",
    admin_th_message: "Message",

    // Admin Form Labels
    admin_lbl_title_ar: "Property Title (Arabic) *",
    admin_lbl_title_en: "Property Title (English) *",
    admin_lbl_desc_ar: "Full Description (Arabic)",
    admin_lbl_desc_en: "Full Description (English)",
    admin_lbl_price: "Price in Egyptian Pounds (EGP) *",
    admin_lbl_type: "Property Type",
    admin_lbl_status: "Property Status / Purpose *",
    admin_lbl_district_ar: "Compound / District (Arabic) *",
    admin_lbl_district_en: "Compound / District (English) *",
    admin_lbl_address_ar: "Detailed Address in Zayed (Arabic)",
    admin_lbl_address_en: "Detailed Address in Zayed (English)",
    admin_lbl_bedrooms: "Bedrooms (Dropdown)",
    admin_lbl_bathrooms: "Bathrooms (Dropdown)",
    admin_lbl_floors: "Floors (Dropdown)",
    admin_lbl_area: "Built Area (m²)",
    admin_lbl_amenities: "Signature Amenities & Features",
    admin_lbl_featured: "Featured Property in Zayed",
    admin_lbl_badge_ar: "Badge (Arabic)",
    admin_lbl_badge_en: "Badge (English)",

    // Local Media Upload Strings
    admin_upload_heading: "Upload Photos & Videos from Device",
    admin_upload_subheading: "Drag & drop files here or click to browse from computer (supports photos & videos)",
    admin_upload_btn_text: "Select Files from Computer",
    admin_upload_url_label: "Or additional image/video URLs (one per line)",

    // Admin DB Tools
    admin_backup_title: "Export Database (JSON)",
    admin_backup_desc: "Download a full JSON backup of all Sheikh Zayed properties, viewing bookings, and customer inquiries.",
    admin_backup_btn: "Download Backup File",
    admin_restore_title: "Restore Default Data",
    admin_restore_desc: "Reset the database to default Sheikh Zayed seed listings.",
    admin_restore_btn: "Restore Default Database",

    // General
    loading: "Loading...",
    currency_symbol: "EGP"
  }
};

// Current language state
let currentLang = localStorage.getItem('alhuda_lang') || 'ar';

/**
 * Get translated text for a key
 */
function t(key, params = {}) {
  const dict = translations[currentLang] || translations.ar;
  let text = dict[key] || (translations.ar[key] || key);

  // Replace params like {count}
  Object.keys(params).forEach(p => {
    text = text.replace(new RegExp(`\\{${p}\\}`, 'g'), params[p]);
  });

  return text;
}

/**
 * Set Application Language (ar / en)
 */
function setLanguage(lang) {
  if (lang !== 'ar' && lang !== 'en') lang = 'ar';
  currentLang = lang;
  localStorage.setItem('alhuda_lang', lang);

  // Set document direction and lang attributes
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';

  // Toggle active class on language buttons
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });

  // Translate all DOM elements with data-i18n
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    el.textContent = t(key);
  });

  // Translate placeholders with data-i18n-placeholder
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    el.placeholder = t(key);
  });

  // Translate titles with data-i18n-title
  document.querySelectorAll('[data-i18n-title]').forEach(el => {
    const key = el.getAttribute('data-i18n-title');
    el.title = t(key);
  });

  // Notify active view controllers to re-render dynamic content
  window.dispatchEvent(new CustomEvent('alhuda_language_changed', { detail: { lang } }));
}

/**
 * Format Price strictly in Egyptian Pounds (EGP / ج.م) with localized thousands separators
 */
function formatPrice(amount) {
  if (!amount || isNaN(amount)) return `0 ${t('currency_symbol')}`;

  const symbol = t('currency_symbol');
  const formattedNumber = new Intl.NumberFormat(currentLang === 'ar' ? 'ar-EG' : 'en-EG', {
    maximumFractionDigits: 0
  }).format(Math.round(amount));

  return `${formattedNumber} ${symbol}`;
}

/**
 * Helper to get localized property string
 */
function getPropText(obj) {
  if (!obj) return '';
  if (typeof obj === 'string') return obj;
  return obj[currentLang] || obj.ar || obj.en || '';
}

// Initialise language on load
document.addEventListener('DOMContentLoaded', () => {
  setLanguage(currentLang);
});

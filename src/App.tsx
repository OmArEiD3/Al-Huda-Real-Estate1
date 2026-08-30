import { QueryClient, QueryClientProvider, useQueryClient } from '@tanstack/react-query';
import {
  getGetDashboardSummaryQueryKey,
  getGetPropertyQueryKey,
  getListLeadsQueryKey,
  getListPropertiesQueryKey,
  useCreateLead,
  useCreateProperty,
  useDeleteProperty,
  useGetDashboardSummary,
  useGetProperty,
  useListLeads,
  useListProperties,
  useUpdateProperty,
  type Lead,
  type ListPropertiesParams,
  type Property,
  type PropertyInput,
} from '@workspace/api-client-react';
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  BedDouble,
  Building2,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  Clock3,
  DoorOpen,
  Edit3,
  ExternalLink,
  Eye,
  FileText,
  Filter,
  Heart,
  Home as HomeIcon,
  Image as ImageIcon,
  KeyRound,
  LayoutDashboard,
  ListFilter,
  Loader2,
  LogOut,
  Mail,
  MapPin,
  Menu,
  MessageSquare,
  Phone,
  Plus,
  Scale,
  Search,
  Send,
  Settings,
  ShieldCheck,
  Sparkles,
  Star,
  Trash2,
  UserRound,
  UsersRound,
  X,
} from 'lucide-react';
import { createContext, useContext, useEffect, useMemo, useState, type FormEvent, type ReactNode } from 'react';
import { Link, Route, Switch, Router as WouterRouter, useLocation, useParams } from 'wouter';
import { ErrorBoundary } from '@/components/error-boundary';

import './index.css';

type Language = 'ar' | 'en';
const queryClient = new QueryClient();

const copy = {
  ar: {
    home: 'الرئيسية', properties: 'العقارات', areas: 'المناطق', compounds: 'الكمبوندات', about: 'من نحن', insights: 'رؤى', contact: 'تواصل معنا',
    discover: 'اكتشف المكان الذي يشبهك', explore: 'استكشف العقارات', viewAll: 'عرض كل العقارات',
    rent: 'للإيجار', sale: 'للبيع', featured: 'مختارات الهُدى', more: 'تفاصيل العقار',
    location: 'الموقع', propertyType: 'نوع العقار', price: 'السعر', bedrooms: 'غرف النوم',
    apartment: 'شقة', villa: 'فيلا', twinHouse: 'توين هاوس', office: 'مكتب',
    search: 'ابحث باسم الحي أو الكمبوند', inquire: 'اطلب معاينة', available: 'متاح',
    noResults: 'لا توجد عقارات مطابقة', noResultsText: 'جرّب تغيير الفلاتر أو تواصل مع مستشارينا لنجد لك ما يناسبك.',
    loading: 'جاري تحميل البيانات', error: 'تعذر تحميل البيانات', retry: 'حاول مرة أخرى',
    sqm: 'م²', egp: 'ج.م', sqmShort: 'م²', all: 'الكل', years: 'سنوات من الخبرة',
    compare: 'قارن', compareAdd: 'أضف للمقارنة', compareRemove: 'إزالة من المقارنة', compareMax: 'يمكنك مقارنة 4 عقارات كحد أقصى',
    compareBarSuffix: 'للمقارنة', compareNow: 'قارن الآن', compareClearAll: 'مسح الكل',
    comparePageTitle: 'قارن بين العقارات', comparePageSubtitle: 'اختر حتى 4 عقارات لمشاهدة تفاصيلها جنباً إلى جنب، مع تظليل الأفضل في كل بند.',
    compareEmptyTitle: 'لم تختر أي عقار بعد', compareEmptyText: 'تصفح العقارات واضغط على "أضف للمقارنة" في أي بطاقة لإضافتها هنا.', compareBrowse: 'تصفح العقارات',
    compareRemoveOne: 'إزالة', compareBestBadge: 'الأفضل',
    attrPrice: 'السعر', attrArea: 'المساحة', attrBedrooms: 'غرف النوم', attrBathrooms: 'الحمامات', attrType: 'نوع العقار',
    attrNeighborhood: 'الحي', attrCompound: 'الكمبوند', attrFinishing: 'التشطيب', attrFloor: 'الطابق', attrElevator: 'مصعد', attrStatus: 'الحالة',
    yes: 'نعم', no: 'لا', notSpecified: '—',
    favorites: 'المفضلة', addToFavorites: 'أضف للمفضلة', removeFromFavorites: 'إزالة من المفضلة',
    favoritesBarSuffix: 'في المفضلة', favoritesEmpty: 'لم تضف أي عقار للمفضلة بعد',
    exportPdf: 'تحميل PDF', pdfExporting: 'جاري التحضير...', pdfFilename: 'العقار',
  },
  en: {
    home: 'Home', properties: 'Properties', areas: 'Areas', compounds: 'Compounds', about: 'About', insights: 'Insights', contact: 'Contact',
    discover: 'Find the place that feels like you', explore: 'Explore properties', viewAll: 'View all properties',
    rent: 'For rent', sale: 'For sale', featured: 'The Al Huda edit', more: 'View property',
    location: 'Location', propertyType: 'Property type', price: 'Price', bedrooms: 'Bedrooms',
    apartment: 'Apartment', villa: 'Villa', twinHouse: 'Twin house', office: 'Office',
    search: 'Search by neighbourhood or compound', inquire: 'Request a viewing', available: 'Available',
    noResults: 'No matching properties', noResultsText: 'Try changing your filters or speak with our advisors for a considered shortlist.',
    loading: 'Loading data', error: 'We could not load this', retry: 'Try again',
    sqm: 'sqm', egp: 'EGP', sqmShort: 'sqm', all: 'All', years: 'years of experience',
    compare: 'Compare', compareAdd: 'Add to compare', compareRemove: 'Remove from compare', compareMax: 'You can compare up to 4 properties',
    compareBarSuffix: 'to compare', compareNow: 'Compare now', compareClearAll: 'Clear all',
    comparePageTitle: 'Compare properties', comparePageSubtitle: 'Pick up to 4 properties to see their details side by side, with the best option highlighted in each row.',
    compareEmptyTitle: 'No properties selected yet', compareEmptyText: 'Browse properties and tap "Add to compare" on any card to add it here.', compareBrowse: 'Browse properties',
    compareRemoveOne: 'Remove', compareBestBadge: 'Best',
    attrPrice: 'Price', attrArea: 'Area', attrBedrooms: 'Bedrooms', attrBathrooms: 'Bathrooms', attrType: 'Property type',
    attrNeighborhood: 'Neighbourhood', attrCompound: 'Compound', attrFinishing: 'Finishing', attrFloor: 'Floor', attrElevator: 'Elevator', attrStatus: 'Status',
    yes: 'Yes', no: 'No', notSpecified: '—',
    favorites: 'Favorites', addToFavorites: 'Add to favorites', removeFromFavorites: 'Remove from favorites',
    favoritesBarSuffix: 'in your favorites', favoritesEmpty: 'No properties added to favorites yet',
    exportPdf: 'Download PDF', pdfExporting: 'Preparing...', pdfFilename: 'Property',
  },
};

function useLangText(language: Language) {
  return copy[language];
}

const COMPARE_LIMIT = 4;
const COMPARE_STORAGE_KEY = 'alhuda:compare-ids';

type CompareContextValue = {
  ids: number[];
  isSelected: (id: number) => boolean;
  toggle: (id: number) => void;
  remove: (id: number) => void;
  clear: () => void;
  atMax: boolean;
};

const CompareContext = createContext<CompareContextValue | null>(null);

function CompareProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<number[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const raw = window.localStorage.getItem(COMPARE_STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed.filter((v) => typeof v === 'number') : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(COMPARE_STORAGE_KEY, JSON.stringify(ids));
    } catch {
      /* storage unavailable, selection just won't persist across reloads */
    }
  }, [ids]);

  const value = useMemo<CompareContextValue>(() => ({
    ids,
    isSelected: (id) => ids.includes(id),
    toggle: (id) => setIds((prev) => (prev.includes(id) ? prev.filter((v) => v !== id) : prev.length >= COMPARE_LIMIT ? prev : [...prev, id])),
    remove: (id) => setIds((prev) => prev.filter((v) => v !== id)),
    clear: () => setIds([]),
    atMax: ids.length >= COMPARE_LIMIT,
  }), [ids]);

  return <CompareContext.Provider value={value}>{children}</CompareContext.Provider>;
}

function useCompare() {
  const ctx = useContext(CompareContext);
  if (!ctx) throw new Error('useCompare must be used within CompareProvider');
  return ctx;
}

type FavoritesContextValue = {
  ids: number[];
  isSelected: (id: number) => boolean;
  toggle: (id: number) => void;
  remove: (id: number) => void;
  clear: () => void;
};

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

function FavoritesProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<number[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const raw = window.localStorage.getItem('alhuda:favorites-ids');
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed.filter((v) => typeof v === 'number') : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem('alhuda:favorites-ids', JSON.stringify(ids));
    } catch {
      /* storage unavailable */
    }
  }, [ids]);

  const value = useMemo<FavoritesContextValue>(() => ({
    ids,
    isSelected: (id) => ids.includes(id),
    toggle: (id) => setIds((prev) => (prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id])),
    remove: (id) => setIds((prev) => prev.filter((v) => v !== id)),
    clear: () => setIds([]),
  }), [ids]);

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error('useFavorites must be used within FavoritesProvider');
  return ctx;
}

async function exportPropertyPDF(property: Property, language: Language) {
  try {
    // Dynamically import html2pdf
    const html2pdf = (await import('html2pdf.js')).default;

    const t = language === 'ar' ? copy.ar : copy.en;
    const title = language === 'ar' ? property.titleAr || property.titleEn : property.titleEn || property.titleAr;
    const typeLabels: Record<string, string> = {
      apartment: t.apartment, villa: t.villa, twin_house: t.twinHouse, office: t.office
    };

    const pdfContent = `
      <!DOCTYPE html>
      <html dir="${language === 'ar' ? 'rtl' : 'ltr'}" lang="${language}">
      <head>
        <meta charset="UTF-8">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: Arial, sans-serif; padding: 30px; background: #f5f5f5; }
          .container { background: white; border-radius: 12px; padding: 40px; box-shadow: 0 4px 20px rgba(0,0,0,.1); max-width: 800px; margin: 0 auto; }
          .header { margin-bottom: 30px; }
          .logo { font-size: 24px; font-weight: bold; color: #143f42; margin-bottom: 10px; }
          .property-image { width: 100%; height: 300px; object-fit: cover; border-radius: 10px; margin: 20px 0; }
          .title { font-size: 28px; font-weight: bold; color: #143f42; margin: 20px 0 10px; }
          .subtitle { font-size: 14px; color: #657872; margin-bottom: 20px; }
          .price { font-size: 24px; font-weight: bold; color: #d85e45; margin: 15px 0; }
          .section { margin: 25px 0; }
          .section-title { font-size: 16px; font-weight: bold; color: #143f42; margin-bottom: 15px; border-bottom: 2px solid #d85e45; padding-bottom: 10px; }
          .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
          .item { padding: 15px; background: #f9f6f0; border-radius: 8px; }
          .item-label { font-size: 12px; color: #657872; text-transform: uppercase; margin-bottom: 5px; }
          .item-value { font-size: 16px; font-weight: 600; color: #143f42; }
          .description { padding: 20px; background: #fbf7ef; border-left: 4px solid #d85e45; border-radius: 4px; line-height: 1.6; }
          .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e3d8ca; text-align: center; font-size: 12px; color: #657872; }
          .divider { height: 1px; background: #e3d8ca; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">🏢 AL HUDA</div>
            <div style="font-size: 12px; color: #657872;">REAL ESTATE</div>
          </div>
          
          ${property.imageUrl ? `<img src="${property.imageUrl}" alt="${title}" class="property-image">` : ''}
          
          <div class="title">${title}</div>
          <div class="subtitle">📍 ${property.neighborhood}${property.compound ? ` · ${property.compound}` : ''}</div>
          
          <div class="price">${formatPrice(property.price, language)}</div>
          
          <div class="section">
            <div class="section-title">${t.attrPrice === 'السعر' ? 'معلومات العقار' : 'Property Details'}</div>
            <div class="grid">
              <div class="item">
                <div class="item-label">${t.attrType}</div>
                <div class="item-value">${typeLabels[property.propertyType] || property.propertyType}</div>
              </div>
              <div class="item">
                <div class="item-label">${t.attrArea}</div>
                <div class="item-value">${property.area} ${t.sqm}</div>
              </div>
              <div class="item">
                <div class="item-label">${t.attrBedrooms}</div>
                <div class="item-value">${property.bedrooms}</div>
              </div>
              <div class="item">
                <div class="item-label">${t.attrBathrooms}</div>
                <div class="item-value">${property.bathrooms}</div>
              </div>
              <div class="item">
                <div class="item-label">${language === 'ar' ? 'نوع' : 'Type'}</div>
                <div class="item-value">${property.operation === 'rent' ? t.rent : t.sale}</div>
              </div>
              <div class="item">
                <div class="item-label">${t.attrStatus}</div>
                <div class="item-value">${property.status}</div>
              </div>
              ${property.floor ? `
              <div class="item">
                <div class="item-label">${t.attrFloor}</div>
                <div class="item-value">${property.floor}</div>
              </div>
              ` : ''}
              ${property.finishing ? `
              <div class="item">
                <div class="item-label">${t.attrFinishing}</div>
                <div class="item-value">${property.finishing}</div>
              </div>
              ` : ''}
            </div>
          </div>
          
          ${property.descriptionAr || property.descriptionEn ? `
          <div class="section">
            <div class="section-title">${t.attrPrice === 'السعر' ? 'الوصف' : 'Description'}</div>
            <div class="description">
              ${language === 'ar' ? (property.descriptionAr || property.descriptionEn) : (property.descriptionEn || property.descriptionAr)}
            </div>
          </div>
          ` : ''}
          
          <div class="divider"></div>
          
          <div class="footer">
            <p>🏢 AL HUDA Real Estate - Professional Property Listing</p>
            <p>${new Date().toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US')}</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const element = document.createElement('div');
    element.innerHTML = pdfContent;

    const opt = {
      margin: 0,
      filename: `${title}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' },
    };

    html2pdf().set(opt).from(element).save();
  } catch (err) {
    console.error('PDF export failed:', err);
    alert('فشل تحميل الـ PDF. حاول مجدداً.');
  }
}

function formatPrice(value?: number, language: Language = 'ar') {
  if (value === undefined || value === null) return '—';
  return `${new Intl.NumberFormat(language === 'ar' ? 'ar-EG' : 'en-EG').format(value)} ${copy[language].egp}`;
}

function formatDate(value?: string, language: Language = 'ar') {
  if (!value) return '—';
  return new Intl.DateTimeFormat(language === 'ar' ? 'ar-EG' : 'en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(value));
}

function Logo({ dark = false }: { dark?: boolean }) {
  return (
    <span className={`brand-lockup ${dark ? 'text-[#f5f0e7]' : 'text-[#143f42]'}`} data-testid="text-brand-logo">
      <span className="brand-arabic">الهدى العقارية</span>
      <span className="brand-english">AL HUDA REAL ESTATE</span>
    </span>
  );
}

function LanguageToggle({ language, onChange, dark = false }: { language: Language; onChange: (next: Language) => void; dark?: boolean }) {
  return (
    <button
      type="button"
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold transition ${dark ? 'border-white/25 text-[#f5f0e7] hover:bg-white/10' : 'border-[#c9bda9] text-[#143f42] hover:bg-[#e9decd]'}`}
      onClick={() => onChange(language === 'ar' ? 'en' : 'ar')}
      data-testid="button-language-toggle"
      aria-label="Toggle language"
    >
      <span className={language === 'ar' ? 'opacity-100' : 'opacity-50'}>ع</span>
      <span className="opacity-40">/</span>
      <span className={language === 'en' ? 'opacity-100' : 'opacity-50'}>EN</span>
    </button>
  );
}

function CompareHeaderLink({ language }: { language: Language }) {
  const t = useLangText(language);
  const { ids } = useCompare();
  return (
    <Link href="/compare" className="relative rounded-full p-2 transition hover:bg-white/10" data-testid="link-header-compare" title={t.compare} aria-label={t.compare}>
      <Scale size={19} />
      {ids.length > 0 && <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#d85e45] px-1 text-[10px] font-bold leading-none text-white" data-testid="text-compare-count">{ids.length}</span>}
    </Link>
  );
}

function FavoritesHeaderLink({ language }: { language: Language }) {
  const t = useLangText(language);
  const { ids } = useFavorites();
  return (
    <Link href="/favorites" className="relative rounded-full p-2 transition hover:bg-white/10" data-testid="link-header-favorites" title={t.favorites} aria-label={t.favorites}>
      <Heart size={19} />
      {ids.length > 0 && <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#e74c3c] px-1 text-[10px] font-bold leading-none text-white" data-testid="text-favorites-count">{ids.length}</span>}
    </Link>
  );
}

function FavoritesPage({ language, onLanguageChange }: { language: Language; onLanguageChange: (next: Language) => void }) {
  const t = useLangText(language);
  const { ids, remove, clear } = useFavorites();
  const [isExporting, setIsExporting] = useState(false);
  const slots = ids.map((id) => id);
  const queries = slots.map((id) => useGetProperty(id, { query: { enabled: id > 0, queryKey: getGetPropertyQueryKey(id) } }));
  const isLoading = queries.some((q, i) => slots[i] > 0 && q.isLoading);
  const properties = queries.map((q) => q.data).filter((p): p is Property => Boolean(p));

  const handleExportPdf = async (property: Property) => {
    setIsExporting(true);
    await exportPropertyPDF(property, language);
    setIsExporting(false);
  };

  if (ids.length === 0) {
    return <div className="public-shell min-h-[100dvh]" dir={language === 'ar' ? 'rtl' : 'ltr'}><PublicHeader language={language} onLanguageChange={onLanguageChange} /><main className="mx-auto max-w-[720px] px-5 py-24 text-center lg:px-8"><Heart size={40} className="mx-auto mb-5 text-[#e74c3c]" /><h1 className="text-3xl font-bold">{t.favoritesEmpty}</h1><p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#657872]">{language === 'ar' ? 'ابدأ بإضافة عقاراتك المفضلة بالضغط على أيقونة القلب' : 'Start by adding your favorite properties by tapping the heart icon'}</p><Link href="/properties" className="btn-ink mt-8 inline-flex rounded-full px-6 py-3 text-sm font-bold" data-testid="link-favorites-browse">{t.compareBrowse}</Link></main><PublicFooter language={language} /></div>;
  }

  return <div className="public-shell min-h-[100dvh]" dir={language === 'ar' ? 'rtl' : 'ltr'}><PublicHeader language={language} onLanguageChange={onLanguageChange} /><main className="mx-auto max-w-[1240px] px-5 py-12 lg:px-8 lg:py-16">
    <div className="mb-10 flex flex-wrap items-end justify-between gap-4"><div><p className="eyebrow mb-3 text-[#d85e45]">AL HUDA / FAVORITES</p><h1 className="text-4xl font-bold sm:text-5xl">{t.favorites}</h1><p className="mt-3 text-sm text-[#657872]">{language === 'ar' ? 'العقارات المفضلة لديك' : 'Your saved properties'}</p></div>{properties.length > 0 && <button type="button" onClick={clear} className="text-xs font-bold text-[#657872] underline underline-offset-2" data-testid="button-favorites-clear-all">{t.compareClearAll}</button>}</div>
    {isLoading && <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{ids.map((id) => <div key={id} className="skeleton h-72 rounded-2xl" />)}</div>}
    {!isLoading && properties.length > 0 && <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{properties.map((p) => { const title = language === 'ar' ? p.titleAr || p.titleEn : p.titleEn || p.titleAr; return <div key={p.id} className="rounded-2xl overflow-hidden border border-[#e3d8ca] transition hover:shadow-[0_12px_40px_rgba(11,32,31,.15)]" data-testid={`card-favorite-${p.id}`}><Link href={`/properties/${p.id}`} className="block"><ImageFrame property={p} className="h-48 w-full" /></Link><div className="p-5"><Link href={`/properties/${p.id}`} className="block mb-3"><h3 className="line-clamp-2 text-base font-bold hover:text-[#d85e45] transition">{title}</h3></Link><p className="text-xs text-[#657872] mb-3"><MapPin size={12} className="inline mr-1" />{p.neighborhood}</p><div className="flex items-center justify-between mb-4"><span className="text-lg font-bold text-[#d85e45]">{formatPrice(p.price, language)}</span><StatusPill status={p.status} language={language} /></div><div className="flex gap-2"><button type="button" onClick={() => remove(p.id)} className="flex-1 py-2 px-3 bg-[#fbf7ef] text-[#d85e45] font-bold text-xs rounded-lg transition hover:bg-[#f0e7d7]" data-testid={`button-remove-favorite-${p.id}`}>{t.removeFromFavorites}</button><button type="button" onClick={() => handleExportPdf(p)} disabled={isExporting} className="flex-1 py-2 px-3 bg-[#143f42] text-[#f7f0e4] font-bold text-xs rounded-lg transition hover:bg-[#0f2f31] disabled:opacity-50" data-testid={`button-export-pdf-${p.id}`}>{isExporting ? t.pdfExporting : t.exportPdf}</button></div></div></div>; })}</div>}
  </main><PublicFooter language={language} /></div>;
}


function CompareBar({ language }: { language: Language }) {
  const t = useLangText(language);
  const { ids, clear } = useCompare();
  const [location] = useLocation();
  if (ids.length === 0 || location.startsWith('/compare') || location.startsWith('/admin')) return null;
  return (
    <div className="compare-bar fixed inset-x-0 bottom-0 z-50 px-4 pb-4" dir={language === 'ar' ? 'rtl' : 'ltr'} data-testid="bar-compare">
      <div className="mx-auto flex max-w-[640px] items-center justify-between gap-4 rounded-2xl px-5 py-4 shadow-[0_12px_40px_rgba(11,32,31,.35)]">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#d85e45] text-sm font-bold text-white">{ids.length}</span>
          <span className="text-sm font-bold text-[#f7f0e4]">{language === 'ar' ? `${ids.length} عقار للمقارنة` : `${ids.length} ${ids.length === 1 ? 'property' : 'properties'} ${t.compareBarSuffix}`}</span>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={clear} className="text-xs font-bold text-[#f7f0e4]/70 underline underline-offset-2" data-testid="button-compare-bar-clear">{t.compareClearAll}</button>
          <Link href="/compare" className="btn-gold rounded-full px-4 py-2 text-xs font-bold" data-testid="link-compare-bar-view">{t.compareNow}</Link>
        </div>
      </div>
    </div>
  );
}


function PublicHeader({ language, onLanguageChange, overlay = false }: { language: Language; onLanguageChange: (next: Language) => void; overlay?: boolean }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const t = useLangText(language);
  useEffect(() => {
    if (!overlay) return;
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [overlay]);
  const nav = [
    { href: '/', label: t.home, id: 'home' },
    { href: '/properties', label: t.properties, id: 'properties' },
    { href: '/properties?search=الشيخ%20زايد', label: t.areas, id: 'areas' },
    { href: '/properties?search=كمبوند', label: t.compounds, id: 'compounds' },
    { href: '/about', label: t.about, id: 'about' },
    { href: '/insights', label: t.insights, id: 'insights' },
    { href: '/contact', label: t.contact, id: 'contact' },
  ];
  return (
    <header className={`public-nav z-40 ${overlay ? 'public-nav-overlay absolute inset-x-0 top-0' : 'sticky top-0'} ${scrolled ? 'public-nav-scrolled' : ''}`} dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="mx-auto flex h-[72px] max-w-[1240px] items-center justify-between px-5 lg:px-8">
        <Link href="/" className="shrink-0" data-testid="link-public-logo"><Logo dark /></Link>
        <nav className="hidden items-center gap-7 text-sm md:flex" aria-label="Primary navigation">
          {nav.map((item) => <Link href={item.href} key={item.id} className="transition" data-testid={`link-nav-${item.id}`}>{item.label}</Link>)}
        </nav>
        <div className="flex items-center gap-3">
          <LanguageToggle language={language} onChange={onLanguageChange} dark />
          <FavoritesHeaderLink language={language} />
          <CompareHeaderLink language={language} />
          <Link href="/properties" className="btn-gold hidden rounded-full px-4 py-2 text-xs font-bold md:inline-flex" data-testid="link-header-contact">{language === 'ar' ? 'اكتشف العقار' : 'Find a property'}</Link>
          <button type="button" className="rounded-full p-2 md:hidden" onClick={() => setOpen((v) => !v)} data-testid="button-mobile-menu" aria-label="Open menu">
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
      {open && (
        <nav className="mobile-menu border-t border-white/15 px-5 pb-5 pt-3 md:hidden">
          {nav.map((item) => <Link href={item.href} key={item.id} onClick={() => setOpen(false)} className="block border-b border-white/10 py-3 text-sm" data-testid={`link-mobile-nav-${item.id}`}>{item.label}</Link>)}
        </nav>
      )}
    </header>
  );
}

function PublicFooter({ language }: { language: Language }) {
  const t = useLangText(language);
  return (
    <footer className="bg-[#143f42] px-5 py-12 text-[#f5f0e7] lg:px-8" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="mx-auto grid max-w-[1240px] gap-10 md:grid-cols-[1.2fr_.8fr_.8fr]">
        <div><Logo dark /><p className="mt-5 max-w-sm text-sm leading-7 text-[#c4d2c8]">{language === 'ar' ? 'عقارات مختارة بعناية في الشيخ زايد. نعرف الشوارع، ونفهم التفاصيل التي تصنع قراراً صحيحاً.' : 'A considered collection of homes in Sheikh Zayed. We know the streets, and the details that make a decision feel right.'}</p></div>
        <div><p className="eyebrow mb-4 text-[#ef9c83]">{language === 'ar' ? 'استكشف' : 'Explore'}</p><div className="grid gap-3 text-sm text-[#d3ded6]"><Link href="/properties" data-testid="link-footer-properties">{t.properties}</Link><Link href="/about" data-testid="link-footer-about">{t.about}</Link><Link href="/insights" data-testid="link-footer-insights">{t.insights}</Link></div></div>
        <div><p className="eyebrow mb-4 text-[#ef9c83]">{language === 'ar' ? 'تواصل' : 'Connect'}</p><div className="space-y-3 text-sm text-[#d3ded6]"><p>+20 100 431 8214</p><p>hello@alhuda.eg</p><p>{language === 'ar' ? 'محور 26 يوليو، الشيخ زايد' : '26th of July Corridor, Sheikh Zayed'}</p></div></div>
      </div>
      <div className="mx-auto mt-12 flex max-w-[1240px] justify-between border-t border-white/15 pt-5 text-xs text-[#9eb5aa]"><span>© {new Date().getFullYear()} AL HUDA</span><span>{language === 'ar' ? 'اختيارات لها معنى' : 'Places with meaning'}</span></div>
    </footer>
  );
}

function ImageFrame({ property, className = '', large = false }: { property?: Property; className?: string; large?: boolean }) {
  const [failed, setFailed] = useState(false);
  const image = property?.imageUrl;
  return (
    <div className={`relative overflow-hidden bg-[#c4d3c6] ${className}`} data-testid={property ? `image-property-${property.id}` : 'image-property-placeholder'}>
      {!failed && image ? <img src={image} alt={property?.titleAr || property?.titleEn || 'Property'} className="h-full w-full object-cover" onError={() => setFailed(true)} /> : (
        <div className="relative h-full w-full overflow-hidden bg-[linear-gradient(145deg,#8eae9d,#d9c9a8)]">
          <div className="absolute -bottom-12 -left-8 h-48 w-48 rounded-full border-[18px] border-[#f4eee4]/40" />
          <div className="absolute right-[-20%] top-[-25%] h-[125%] w-[70%] rotate-[18deg] bg-[#1f5c5c]/70" />
          <div className="absolute bottom-0 left-0 h-1/3 w-full bg-[#143f42]/25" />
          {large && <span className="absolute bottom-5 right-5 text-xs font-bold tracking-[.2em] text-white/80">AL HUDA / ZAYED</span>}
        </div>
      )}
    </div>
  );
}

function StatusPill({ status, language }: { status?: string; language: Language }) {
  const normalized = (status || 'available').toLowerCase();
  const label = normalized.includes('sold') ? (language === 'ar' ? 'تم البيع' : 'Sold') : normalized.includes('rent') ? (language === 'ar' ? 'مؤجر' : 'Rented') : normalized.includes('draft') ? (language === 'ar' ? 'مسودة' : 'Draft') : (language === 'ar' ? 'متاح' : 'Available');
  return <span className={`status-pill ${normalized.includes('sold') ? 'status-sold' : normalized.includes('rent') ? 'status-rented' : normalized.includes('draft') ? 'status-draft' : 'status-available'}`}>{label}</span>;
}

function PropertyCard({ property, language }: { property: Property; language: Language }) {
  const t = useLangText(language);
  const { isSelected, toggle, atMax } = useCompare();
  const { isSelected: isFavorited, toggle: toggleFavorite } = useFavorites();
  const selected = isSelected(property.id);
  const favorited = isFavorited(property.id);
  const title = language === 'ar' ? property.titleAr || property.titleEn : property.titleEn || property.titleAr;
  return (
    <Link href={`/properties/${property.id}`} className="property-card group block overflow-hidden rounded-[1.1rem]" data-testid={`card-property-${property.id}`}>
      <div className="relative h-64"><ImageFrame property={property} className="h-full w-full" /><div className="image-overlay image-overlay-strong absolute inset-0" /><div className="absolute left-4 right-4 top-4 flex items-start justify-between" dir="ltr"><span className="rounded-full bg-[#f7f0e4]/90 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#143f42]">{property.operation === 'rent' ? t.rent : t.sale}</span><div className="flex items-center gap-2">{property.featured && <span className="rounded-full bg-[#d85e45] px-2.5 py-1 text-[10px] font-bold text-white"><Star size={11} className="mr-1 inline" />{language === 'ar' ? 'مختار' : 'Featured'}</span>}<div role="button" tabIndex={0} onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleFavorite(property.id); }} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.stopPropagation(); toggleFavorite(property.id); } }} title={favorited ? t.removeFromFavorites : t.addToFavorites} aria-pressed={favorited} aria-label={favorited ? t.removeFromFavorites : t.addToFavorites} className={`favorite-toggle ${favorited ? 'is-selected' : ''}`} data-testid={`button-favorite-${property.id}`}>{favorited ? <Heart size={13} fill="currentColor" /> : <Heart size={13} />}</div><div role="button" tabIndex={0} onClick={(e) => { e.preventDefault(); e.stopPropagation(); if (selected || !atMax) toggle(property.id); }} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.stopPropagation(); if (selected || !atMax) toggle(property.id); } }} title={selected ? t.compareRemove : atMax ? t.compareMax : t.compareAdd} aria-pressed={selected} aria-label={selected ? t.compareRemove : t.compareAdd} className={`compare-toggle ${selected ? 'is-selected' : ''} ${!selected && atMax ? 'is-disabled' : ''}`} data-testid={`button-compare-${property.id}`}>{selected ? <Check size={13} /> : <Scale size={13} />}</div></div></div><div className="absolute bottom-4 left-4 right-4 text-[#fff8ec]" dir={language === 'ar' ? 'rtl' : 'ltr'}><p className="mb-1 flex items-center gap-1 text-xs text-white/80"><MapPin size={12} />{property.neighborhood}{property.compound ? ` · ${property.compound}` : ''}</p><h3 className="line-clamp-2 text-lg font-bold leading-snug sm:text-xl">{title}</h3></div></div>
      <div className="p-4" dir={language === 'ar' ? 'rtl' : 'ltr'}><div className="mb-4 flex items-center justify-between"><span className="text-lg font-bold text-[#d85e45]">{formatPrice(property.price, language)}</span><StatusPill status={property.status} language={language} /></div><div className="flex items-center gap-4 text-xs text-[#657872]"><span className="flex items-center gap-1"><HomeIcon size={14} />{property.area} {t.sqm}</span><span className="flex items-center gap-1"><BedDouble size={14} />{property.bedrooms}</span><span className="flex items-center gap-1"><DoorOpen size={14} />{property.bathrooms}</span><span className="mr-auto text-[#143f42] transition group-hover:text-[#d85e45]">{t.more} <ArrowLeft size={13} className="inline" /></span></div></div>
    </Link>
  );
}

function QueryState({ loading, error, empty, language, onRetry, children }: { loading?: boolean; error?: boolean; empty?: boolean; language: Language; onRetry?: () => void; children: ReactNode }) {
  const t = useLangText(language);
  if (loading) return <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{[1, 2, 3].map((n) => <div key={n} className="overflow-hidden rounded-[1.1rem] border border-[#e2d8c7] bg-[#fffcf6]"><div className="skeleton h-60" /><div className="space-y-3 p-4"><div className="skeleton h-4 w-2/3 rounded" /><div className="skeleton h-3 w-1/2 rounded" /></div></div>)}</div>;
  if (error) return <div className="rounded-2xl border border-[#e3b6aa] bg-[#fff4ef] px-6 py-10 text-center text-[#873c31]" data-testid="state-error"><CircleAlert className="mx-auto mb-3" /><p className="font-bold">{t.error}</p><p className="mt-1 text-sm opacity-80">{language === 'ar' ? 'تحقق من الاتصال بالخادم ثم أعد المحاولة.' : 'Check the server connection and try again.'}</p>{onRetry && <button type="button" onClick={onRetry} className="mt-4 rounded-lg bg-[#143f42] px-4 py-2 text-xs font-bold text-white" data-testid="button-public-retry">{t.retry}</button>}</div>;
  if (empty) return <div className="rounded-2xl border border-dashed border-[#cfc3b1] bg-[#fbf7ef] px-6 py-14 text-center" data-testid="state-empty"><Search className="mx-auto mb-4 text-[#d85e45]" size={28} /><p className="font-bold">{t.noResults}</p><p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#657872]">{t.noResultsText}</p></div>;
  return <>{children}</>;
}

const NEIGHBORHOODS = [
  { value: 'الحي الأول', ar: 'الحي الأول', en: 'District 1' },
  { value: 'الحي الثاني', ar: 'الحي الثاني', en: 'District 2' },
  { value: 'الحي المتميز', ar: 'الحي المتميز', en: 'The Distinguished District' },
  { value: 'بيفرلي هيلز', ar: 'بيفرلي هيلز', en: 'Beverly Hills' },
  { value: 'غرين اسكوير', ar: 'غرين اسكوير', en: 'Green Square' },
];

function Home({ language, onLanguageChange }: { language: Language; onLanguageChange: (next: Language) => void }) {
  const t = useLangText(language);
  const [, setLocation] = useLocation();
  const [search, setSearch] = useState('');
  const [heroOperation, setHeroOperation] = useState('');
  const [heroType, setHeroType] = useState('');
  const [heroNeighborhood, setHeroNeighborhood] = useState('');
  const featuredParams = useMemo(() => ({ featured: true }), []);
  const featuredQuery = useListProperties(featuredParams, { query: { queryKey: getListPropertiesQueryKey(featuredParams), staleTime: 30000 } });
  const properties = featuredQuery.data || [];
  return <div className="public-shell grain" dir={language === 'ar' ? 'rtl' : 'ltr'}><PublicHeader language={language} onLanguageChange={onLanguageChange} overlay />
    <main>
      <section className="hero-public hero-photo relative overflow-hidden"><div className="hero-photo-image absolute inset-0" /><div className="hero-grid absolute inset-0 opacity-20" /><div className="relative mx-auto flex min-h-[710px] max-w-[1240px] items-center px-5 pb-28 pt-28 lg:px-8"><div className="hero-copy fade-up ml-auto max-w-[570px] text-right"><p className="eyebrow mb-5 text-[#e5bc83]">AL HUDA / SHEIKH ZAYED</p><h1 className="arabic-display text-5xl font-bold leading-[1.2] tracking-tight sm:text-6xl lg:text-[5.3rem]">{language === 'ar' ? <>اكتشف عقارك<br /><span className="hero-gold-text">في الشيخ زايد</span></> : <>Discover your home<br /><span className="hero-gold-text">in Sheikh Zayed</span></>}</h1><p className="mt-6 max-w-md text-base leading-8 text-white/80">{language === 'ar' ? 'خبرة محلية عميقة ومعرفة دقيقة بالسوق لمساعدتك في العثور على منزلك المثالي.' : 'Local expertise and market insight to help you find the place that feels right.'}</p><div className="mt-8 flex flex-wrap justify-end gap-3"><Link href="/properties" className="btn-gold inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold" data-testid="link-hero-explore">{t.explore}<ArrowLeft size={16} /></Link><Link href="/contact" className="hero-outline inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-bold" data-testid="link-hero-about">{t.contact}<Phone size={15} /></Link></div></div></div><div className="relative mx-auto -mb-16 max-w-[1100px] px-5 lg:px-8"><form className="filter-bar hero-filter grid gap-2 rounded-[2rem] p-3 md:grid-cols-[1.2fr_1fr_1fr_1fr_auto]" onSubmit={(e) => { e.preventDefault(); const searchParams = new URLSearchParams(); if (search) searchParams.set('search', search); if (heroOperation) searchParams.set('operation', heroOperation); if (heroType) searchParams.set('propertyType', heroType); if (heroNeighborhood) searchParams.set('neighborhood', heroNeighborhood); setLocation(`/properties${searchParams.toString() ? `?${searchParams.toString()}` : ''}`); }}><div className="hero-filter-field flex items-center gap-3 rounded-2xl px-4"><Search size={18} /><input value={search} onChange={(e) => setSearch(e.target.value)} className="w-full bg-transparent py-3 text-sm outline-none" placeholder={t.search} data-testid="input-hero-search" /></div><div className="select-shell hero-filter-field rounded-2xl"><Filter size={16} className="select-icon select-icon-start opacity-60" /><select className="rounded-2xl py-3 text-sm" value={heroOperation} onChange={(e) => setHeroOperation(e.target.value)} data-testid="select-hero-operation"><option value="">{language === 'ar' ? 'نوع الطلب' : 'Looking to'}</option><option value="sale">{t.sale}</option><option value="rent">{t.rent}</option></select><ChevronDown size={15} className="select-icon select-icon-end opacity-60" /></div><div className="select-shell hero-filter-field rounded-2xl"><Building2 size={16} className="select-icon select-icon-start opacity-60" /><select className="rounded-2xl py-3 text-sm" value={heroType} onChange={(e) => setHeroType(e.target.value)} data-testid="select-hero-type"><option value="">{t.propertyType}</option><option value="apartment">{t.apartment}</option><option value="villa">{t.villa}</option></select><ChevronDown size={15} className="select-icon select-icon-end opacity-60" /></div><div className="select-shell hero-filter-field rounded-2xl"><MapPin size={16} className="select-icon select-icon-start opacity-60" /><select className="rounded-2xl py-3 text-sm" value={heroNeighborhood} onChange={(e) => setHeroNeighborhood(e.target.value)} data-testid="select-hero-neighborhood"><option value="">{language === 'ar' ? 'الموقع' : 'Location'}</option>{NEIGHBORHOODS.map((n) => <option key={n.value} value={n.value}>{language === 'ar' ? n.ar : n.en}</option>)}</select><ChevronDown size={15} className="select-icon select-icon-end opacity-60" /></div><button className="btn-ink flex items-center justify-center gap-2 rounded-2xl px-6 py-3 text-sm font-bold" type="submit" data-testid="button-hero-search">{language === 'ar' ? 'بحث' : 'Search'} <ArrowLeft size={16} /></button></form></div></section>
      <section className="mx-auto max-w-[1240px] px-5 pb-20 pt-32 lg:px-8"><div className="mb-9 flex items-end justify-between gap-6"><div><p className="eyebrow mb-3 text-[#d85e45]">{language === 'ar' ? 'انتقاؤنا الحالي' : 'Our current edit'}</p><h2 className="text-3xl font-bold sm:text-4xl">{t.featured}</h2></div><Link href="/properties" className="hidden items-center gap-2 text-sm font-bold text-[#d85e45] md:flex" data-testid="link-home-all-properties">{t.viewAll}<ArrowLeft size={16} /></Link></div><QueryState loading={featuredQuery.isLoading} error={featuredQuery.isError} onRetry={() => featuredQuery.refetch()} empty={!featuredQuery.isLoading && properties.length === 0} language={language}><div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{properties.slice(0, 3).map((property) => <PropertyCard key={property.id} property={property} language={language} />)}</div></QueryState></section>
      <section className="section-dark-photo px-5 py-24 lg:px-8"><div className="section-dark-photo-image" /><div className="hero-grid absolute inset-0 opacity-10" /><div className="relative mx-auto grid max-w-[1240px] gap-12 lg:grid-cols-[.8fr_1.2fr] lg:items-end"><div><p className="eyebrow mb-4 text-[#e6bc82]">{language === 'ar' ? 'لماذا الهُدى' : 'Why Al Huda'}</p><h2 className="max-w-md text-4xl font-bold leading-tight text-[#f7f0e4] sm:text-[2.7rem]">{language === 'ar' ? 'في زايد، التفاصيل الصغيرة تقول كل شيء.' : 'In Zayed, the small details say everything.'}</h2></div><div className="grid gap-5 sm:grid-cols-3">{[{ n: '12', ar: 'حيّاً نعرفه شارعاً شارعاً', en: 'neighbourhoods we know street by street' }, { n: '180+', ar: 'عائلة وجدنا لها مكانها', en: 'families we have helped settle' }, { n: '2016', ar: 'منذ بدأنا الإصغاء لزايد', en: 'the year we started listening to Zayed' }].map((stat) => <div key={stat.n} className="stat-glass-card p-6"><span className="text-4xl font-bold text-[#e6bc82]">{stat.n}</span><p className="mt-3 text-sm leading-6 text-[#f7f0e4]/80">{language === 'ar' ? stat.ar : stat.en}</p></div>)}</div></div></section>
      <section className="mx-auto max-w-[1240px] px-5 py-20 lg:px-8"><div className="grid items-center gap-12 lg:grid-cols-[1fr_1.1fr]"><div className="section-photo-frame relative aspect-[4/3] overflow-hidden rounded-[1.2rem] shadow-[0_25px_60px_rgba(20,63,66,.18)]"><div className="absolute left-0 top-8 h-3 w-16 bg-[#d85e45]" /><div className="absolute bottom-5 left-5 flex items-center gap-2 rounded-full bg-[#f5f0e7]/95 px-4 py-2 text-xs font-bold text-[#143f42]"><MapPin size={13} className="text-[#d85e45]" />{language === 'ar' ? 'دليلك إلى زايد' : 'Your Zayed guide'}</div></div><div><p className="eyebrow mb-4 text-[#d85e45]">{language === 'ar' ? 'نعرف المكان' : 'We know the place'}</p><h2 className="text-4xl font-bold leading-tight">{language === 'ar' ? 'من أول فنجان قهوة إلى إطلالة المساء.' : 'From the first coffee to the last light.'}</h2><p className="mt-6 max-w-lg text-base leading-8 text-[#657872]">{language === 'ar' ? 'نشاركك ما لا يظهر في إعلان: الشارع الذي يهدأ بعد السادسة، النادي الأقرب، والمدرسة التي يسأل عنها كل أب وأم.' : 'We share what an advert cannot: the street that quietens after six, the nearest club, and the school every parent asks about.'}</p><Link href="/insights" className="mt-8 inline-flex items-center gap-2 font-bold text-[#d85e45]" data-testid="link-home-insights">{language === 'ar' ? 'اقرأ رؤيتنا' : 'Read our notes'} <ArrowLeft size={16} /></Link></div></div></section>
    </main><PublicFooter language={language} /></div>;
}

function PropertiesPage({ language, onLanguageChange }: { language: Language; onLanguageChange: (next: Language) => void }) {
  const t = useLangText(language);
  const [location] = useLocation();
  const initialParams = new URLSearchParams(location.split('?')[1] || '');
  const querySearch = initialParams.get('search') || '';
  const initialOperation = initialParams.get('operation') || '';
  const initialType = initialParams.get('propertyType') || '';
  const initialNeighborhood = initialParams.get('neighborhood') || '';
  const [search, setSearch] = useState(querySearch);
  const [operation, setOperation] = useState(initialOperation);
  const [propertyType, setPropertyType] = useState(initialType);
  const [bedrooms, setBedrooms] = useState('');
  const [neighborhood, setNeighborhood] = useState(initialNeighborhood);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [showMoreFilters, setShowMoreFilters] = useState(Boolean(initialNeighborhood));
  const params = useMemo<ListPropertiesParams>(() => ({ ...(search ? { search } : {}), ...(operation ? { operation } : {}), ...(propertyType ? { propertyType } : {}), ...(bedrooms ? { bedrooms: Number(bedrooms) } : {}), ...(neighborhood ? { neighborhood } : {}), ...(minPrice ? { minPrice: Number(minPrice) } : {}), ...(maxPrice ? { maxPrice: Number(maxPrice) } : {}) }), [search, operation, propertyType, bedrooms, neighborhood, minPrice, maxPrice]);
  const query = useListProperties(params, { query: { queryKey: getListPropertiesQueryKey(params), staleTime: 30000 } });
  const properties = query.data || [];
  const activeFilters: { key: string; label: string; clear: () => void }[] = [
    ...(operation ? [{ key: 'operation', label: operation === 'sale' ? t.sale : t.rent, clear: () => setOperation('') }] : []),
    ...(propertyType ? [{ key: 'propertyType', label: { apartment: t.apartment, villa: t.villa, twin_house: t.twinHouse, office: t.office }[propertyType] || propertyType, clear: () => setPropertyType('') }] : []),
    ...(bedrooms ? [{ key: 'bedrooms', label: `${bedrooms}+ ${t.bedrooms}`, clear: () => setBedrooms('') }] : []),
    ...(neighborhood ? [{ key: 'neighborhood', label: neighborhood, clear: () => setNeighborhood('') }] : []),
    ...(minPrice ? [{ key: 'minPrice', label: `${language === 'ar' ? 'من' : 'From'} ${minPrice}`, clear: () => setMinPrice('') }] : []),
    ...(maxPrice ? [{ key: 'maxPrice', label: `${language === 'ar' ? 'إلى' : 'To'} ${maxPrice}`, clear: () => setMaxPrice('') }] : []),
  ];
  const clearAll = () => { setOperation(''); setPropertyType(''); setBedrooms(''); setNeighborhood(''); setMinPrice(''); setMaxPrice(''); };
  return <div className="public-shell min-h-[100dvh]" dir={language === 'ar' ? 'rtl' : 'ltr'}><PublicHeader language={language} onLanguageChange={onLanguageChange} /><main className="mx-auto max-w-[1240px] px-5 py-12 lg:px-8 lg:py-16"><div className="mb-10 flex flex-wrap items-end justify-between gap-5"><div><p className="eyebrow mb-3 text-[#d85e45]">AL HUDA / COLLECTION</p><h1 className="text-4xl font-bold sm:text-5xl">{language === 'ar' ? 'كل الأماكن التي نحبها' : 'Every place we love'}</h1><p className="mt-3 text-sm text-[#657872]">{language === 'ar' ? 'عقارات حقيقية في الشيخ زايد، من مختارين يعرفون المكان.' : 'Real homes in Sheikh Zayed, selected by people who know the place.'}</p></div><div className="text-sm text-[#657872]" data-testid="text-property-count">{query.isLoading ? '—' : `${properties.length} ${language === 'ar' ? 'عقار' : 'properties'}`}</div></div><div className="filter-bar mb-4 rounded-2xl p-3"><div className="grid gap-3 md:grid-cols-[1.5fr_1fr_1fr_1fr_auto]"><div className="flex items-center gap-3 rounded-xl bg-[#f2ecdf] px-4"><Search size={17} className="text-[#d85e45]" /><input className="w-full bg-transparent py-3 text-sm outline-none" value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t.search} data-testid="input-property-search" /></div><div className="select-shell field rounded-xl"><Filter size={15} className="select-icon select-icon-start text-[#8a9691]" /><select className="rounded-xl py-3 text-sm" value={operation} onChange={(e) => setOperation(e.target.value)} data-testid="select-property-operation"><option value="">{t.all} · {t.sale}/{t.rent}</option><option value="sale">{t.sale}</option><option value="rent">{t.rent}</option></select><ChevronDown size={14} className="select-icon select-icon-end text-[#8a9691]" /></div><div className="select-shell field rounded-xl"><Building2 size={15} className="select-icon select-icon-start text-[#8a9691]" /><select className="rounded-xl py-3 text-sm" value={propertyType} onChange={(e) => setPropertyType(e.target.value)} data-testid="select-property-type"><option value="">{t.propertyType}</option><option value="apartment">{t.apartment}</option><option value="villa">{t.villa}</option><option value="twin_house">{t.twinHouse}</option><option value="office">{t.office}</option></select><ChevronDown size={14} className="select-icon select-icon-end text-[#8a9691]" /></div><div className="select-shell field rounded-xl"><BedDouble size={15} className="select-icon select-icon-start text-[#8a9691]" /><select className="rounded-xl py-3 text-sm" value={bedrooms} onChange={(e) => setBedrooms(e.target.value)} data-testid="select-property-bedrooms"><option value="">{t.bedrooms}</option><option value="1">1+</option><option value="2">2+</option><option value="3">3+</option><option value="4">4+</option></select><ChevronDown size={14} className="select-icon select-icon-end text-[#8a9691]" /></div><button type="button" onClick={() => setShowMoreFilters((v) => !v)} className={`filters-toggle flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold ${showMoreFilters ? 'is-active' : ''}`} data-testid="button-toggle-more-filters"><ListFilter size={16} />{language === 'ar' ? 'فلاتر أكثر' : 'More filters'}</button></div>{showMoreFilters && <div className="mt-3 grid gap-3 border-t border-[#e1d7c8] pt-3 sm:grid-cols-3"><div className="select-shell field rounded-xl"><MapPin size={15} className="select-icon select-icon-start text-[#8a9691]" /><select className="rounded-xl py-3 text-sm" value={neighborhood} onChange={(e) => setNeighborhood(e.target.value)} data-testid="select-property-neighborhood"><option value="">{language === 'ar' ? 'كل الأحياء' : 'All neighbourhoods'}</option>{NEIGHBORHOODS.map((n) => <option key={n.value} value={n.value}>{language === 'ar' ? n.ar : n.en}</option>)}</select><ChevronDown size={14} className="select-icon select-icon-end text-[#8a9691]" /></div><input type="number" min={0} inputMode="numeric" className="field rounded-xl px-4 py-3 text-sm" placeholder={language === 'ar' ? 'أقل سعر' : 'Min price'} value={minPrice} onChange={(e) => setMinPrice(e.target.value)} data-testid="input-min-price" /><input type="number" min={0} inputMode="numeric" className="field rounded-xl px-4 py-3 text-sm" placeholder={language === 'ar' ? 'أعلى سعر' : 'Max price'} value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} data-testid="input-max-price" /></div>}</div>{activeFilters.length > 0 && <div className="mb-8 flex flex-wrap items-center gap-2" data-testid="active-filters-row">{activeFilters.map((f) => <span key={f.key} className="filter-chip">{f.label}<button type="button" onClick={f.clear} aria-label="remove filter" data-testid={`button-clear-${f.key}`}><X size={13} /></button></span>)}<button type="button" onClick={clearAll} className="text-xs font-bold text-[#657872] underline underline-offset-2" data-testid="button-clear-all-filters">{language === 'ar' ? 'مسح الكل' : 'Clear all'}</button></div>}<QueryState loading={query.isLoading} error={query.isError} onRetry={() => query.refetch()} empty={!query.isLoading && properties.length === 0} language={language}><div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{properties.map((property) => <PropertyCard property={property} language={language} key={property.id} />)}</div></QueryState></main><PublicFooter language={language} /></div>;
}

function bestIndexes(values: number[], mode: 'min' | 'max') {
  const valid = values.filter((v) => typeof v === 'number' && !Number.isNaN(v));
  if (valid.length < 2) return new Set<number>();
  const target = mode === 'min' ? Math.min(...valid) : Math.max(...valid);
  if (valid.every((v) => v === target)) return new Set<number>();
  return new Set(values.reduce<number[]>((acc, v, i) => (v === target ? [...acc, i] : acc), []));
}

function CompareRow({ label, children }: { label: string; children: ReactNode }) {
  return <tr><th className="compare-th-label" scope="row">{label}</th>{children}</tr>;
}

function CompareCell({ children, best }: { children: ReactNode; best?: boolean }) {
  return <td className={`compare-td ${best ? 'is-best' : ''}`}><span>{children}</span>{best && <Star size={12} className="compare-best-icon" />}</td>;
}

function ComparePage({ language, onLanguageChange }: { language: Language; onLanguageChange: (next: Language) => void }) {
  const t = useLangText(language);
  const { ids, remove, clear } = useCompare();
  const slots = [ids[0] ?? -1, ids[1] ?? -1, ids[2] ?? -1, ids[3] ?? -1];
  const q0 = useGetProperty(slots[0], { query: { enabled: slots[0] > 0, queryKey: getGetPropertyQueryKey(slots[0]) } });
  const q1 = useGetProperty(slots[1], { query: { enabled: slots[1] > 0, queryKey: getGetPropertyQueryKey(slots[1]) } });
  const q2 = useGetProperty(slots[2], { query: { enabled: slots[2] > 0, queryKey: getGetPropertyQueryKey(slots[2]) } });
  const q3 = useGetProperty(slots[3], { query: { enabled: slots[3] > 0, queryKey: getGetPropertyQueryKey(slots[3]) } });
  const queries = [q0, q1, q2, q3];
  const isLoading = queries.some((q, i) => slots[i] > 0 && q.isLoading);
  const properties = queries.map((q) => q.data).filter((p): p is Property => Boolean(p));

  if (ids.length === 0) {
    return <div className="public-shell min-h-[100dvh]" dir={language === 'ar' ? 'rtl' : 'ltr'}><PublicHeader language={language} onLanguageChange={onLanguageChange} /><main className="mx-auto max-w-[720px] px-5 py-24 text-center lg:px-8"><Scale size={40} className="mx-auto mb-5 text-[#d85e45]" /><h1 className="text-3xl font-bold">{t.compareEmptyTitle}</h1><p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#657872]">{t.compareEmptyText}</p><Link href="/properties" className="btn-ink mt-8 inline-flex rounded-full px-6 py-3 text-sm font-bold" data-testid="link-compare-browse">{t.compareBrowse}</Link></main><PublicFooter language={language} /></div>;
  }

  const bestPrice = bestIndexes(properties.map((p) => p.price), 'min');
  const bestArea = bestIndexes(properties.map((p) => p.area), 'max');
  const bestBedrooms = bestIndexes(properties.map((p) => p.bedrooms), 'max');
  const bestBathrooms = bestIndexes(properties.map((p) => p.bathrooms), 'max');
  const typeLabels: Record<string, string> = { apartment: t.apartment, villa: t.villa, twin_house: t.twinHouse, office: t.office };

  return <div className="public-shell min-h-[100dvh]" dir={language === 'ar' ? 'rtl' : 'ltr'}><PublicHeader language={language} onLanguageChange={onLanguageChange} /><main className="mx-auto max-w-[1240px] px-5 py-12 lg:px-8 lg:py-16">
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4"><div><p className="eyebrow mb-3 text-[#d85e45]">AL HUDA / COMPARE</p><h1 className="text-4xl font-bold sm:text-5xl">{t.comparePageTitle}</h1><p className="mt-3 max-w-lg text-sm text-[#657872]">{t.comparePageSubtitle}</p></div>{properties.length > 0 && <button type="button" onClick={clear} className="text-xs font-bold text-[#657872] underline underline-offset-2" data-testid="button-compare-clear-all">{t.compareClearAll}</button>}</div>
    {isLoading && <div className="grid gap-5" style={{ gridTemplateColumns: `repeat(${ids.length}, minmax(0,1fr))` }}>{ids.map((id) => <div key={id} className="skeleton h-72 rounded-2xl" />)}</div>}
    {!isLoading && properties.length > 0 && <div className="overflow-x-auto"><table className="compare-table w-full min-w-[640px]" data-testid="table-compare"><thead><tr><th className="compare-th-label" />{properties.map((p) => { const title = language === 'ar' ? p.titleAr || p.titleEn : p.titleEn || p.titleAr; return <th key={p.id} className="compare-th"><div className="relative overflow-hidden rounded-xl"><button type="button" onClick={() => remove(p.id)} className="absolute right-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-black/50 text-white" aria-label={t.compareRemoveOne} data-testid={`button-compare-remove-${p.id}`}><X size={14} /></button><ImageFrame property={p} className="h-32 w-full" /></div><Link href={`/properties/${p.id}`} className="mt-3 block line-clamp-2 text-sm font-bold hover:text-[#d85e45]" data-testid={`link-compare-title-${p.id}`}>{title}</Link></th>; })}</tr></thead><tbody>
      <CompareRow label={t.attrPrice}>{properties.map((p, i) => <CompareCell key={p.id} best={bestPrice.has(i)}>{formatPrice(p.price, language)}</CompareCell>)}</CompareRow>
      <CompareRow label={t.attrArea}>{properties.map((p, i) => <CompareCell key={p.id} best={bestArea.has(i)}>{p.area} {t.sqm}</CompareCell>)}</CompareRow>
      <CompareRow label={t.attrBedrooms}>{properties.map((p, i) => <CompareCell key={p.id} best={bestBedrooms.has(i)}>{p.bedrooms}</CompareCell>)}</CompareRow>
      <CompareRow label={t.attrBathrooms}>{properties.map((p, i) => <CompareCell key={p.id} best={bestBathrooms.has(i)}>{p.bathrooms}</CompareCell>)}</CompareRow>
      <CompareRow label={t.attrType}>{properties.map((p) => <CompareCell key={p.id}>{typeLabels[p.propertyType] || p.propertyType}</CompareCell>)}</CompareRow>
      <CompareRow label={t.attrNeighborhood}>{properties.map((p) => <CompareCell key={p.id}>{p.neighborhood}</CompareCell>)}</CompareRow>
      <CompareRow label={t.attrCompound}>{properties.map((p) => <CompareCell key={p.id}>{p.compound || t.notSpecified}</CompareCell>)}</CompareRow>
      <CompareRow label={t.attrFinishing}>{properties.map((p) => <CompareCell key={p.id}>{p.finishing || t.notSpecified}</CompareCell>)}</CompareRow>
      <CompareRow label={t.attrFloor}>{properties.map((p) => <CompareCell key={p.id}>{p.floor || t.notSpecified}</CompareCell>)}</CompareRow>
      <CompareRow label={t.attrElevator}>{properties.map((p) => <CompareCell key={p.id}>{p.elevator ? t.yes : t.no}</CompareCell>)}</CompareRow>
      <CompareRow label={t.attrStatus}>{properties.map((p) => <CompareCell key={p.id}><StatusPill status={p.status} language={language} /></CompareCell>)}</CompareRow>
    </tbody></table></div>}
  </main><PublicFooter language={language} /></div>;
}

function PropertyDetail({ language, onLanguageChange }: { language: Language; onLanguageChange: (next: Language) => void }) {
  const t = useLangText(language);
  const params = useParams<{ id?: string }>();
  const numericId = Number(params.id);
  const id = Number.isFinite(numericId) ? numericId : -1;
  const query = useGetProperty(id, { query: { enabled: id > 0, queryKey: getGetPropertyQueryKey(id) } });
  const property = query.data;
  const [activeImage, setActiveImage] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [leadError, setLeadError] = useState('');
  const createLead = useCreateLead();
  const title = property ? (language === 'ar' ? property.titleAr || property.titleEn : property.titleEn || property.titleAr) : '';
  const images = property ? [property.imageUrl, ...(property.imageUrls || [])].filter(Boolean) : [];
  const submitLead = (e: FormEvent<HTMLFormElement>) => { e.preventDefault(); setLeadError(''); const data = new FormData(e.currentTarget); createLead.mutate({ data: { name: String(data.get('name') || ''), phone: String(data.get('phone') || ''), email: String(data.get('email') || ''), message: String(data.get('message') || ''), propertyId: id, source: 'property-detail' } }, { onSuccess: () => setSubmitted(true), onError: () => setLeadError(language === 'ar' ? 'تعذر إرسال الطلب. حاول مرة أخرى.' : 'We could not send your request. Please try again.') }); };
  return <div className="public-shell min-h-[100dvh]" dir={language === 'ar' ? 'rtl' : 'ltr'}><PublicHeader language={language} onLanguageChange={onLanguageChange} /><main className="mx-auto max-w-[1240px] px-5 py-9 lg:px-8 lg:py-14">{query.isLoading && <div className="grid gap-7 lg:grid-cols-[1.15fr_.85fr]"><div className="skeleton h-[530px] rounded-2xl" /><div className="space-y-4"><div className="skeleton h-8 w-3/4 rounded" /><div className="skeleton h-5 w-1/2 rounded" /></div></div>}{query.isError || (!query.isLoading && !property) ? <div className="py-24 text-center" data-testid="state-property-not-found"><CircleAlert className="mx-auto mb-4 text-[#d85e45]" size={30} /><h1 className="text-2xl font-bold">{language === 'ar' ? 'العقار غير موجود' : 'Property not found'}</h1><Link href="/properties" className="mt-5 inline-flex items-center gap-2 font-bold text-[#d85e45]" data-testid="link-back-properties"><ArrowRight size={16} />{t.properties}</Link></div> : property && <><Link href="/properties" className="mb-7 inline-flex items-center gap-2 text-sm font-bold text-[#657872]" data-testid="link-detail-back"><ArrowRight size={15} />{language === 'ar' ? 'العودة للعقارات' : 'Back to properties'}</Link><div className="grid gap-8 lg:grid-cols-[1.12fr_.88fr]"><div><div className="relative h-[390px] overflow-hidden rounded-[1.25rem] sm:h-[530px]"><ImageFrame property={{ ...property, imageUrl: images[activeImage] || property.imageUrl }} className="h-full w-full" large /><div className="absolute bottom-4 left-4 rounded-full bg-[#143f42]/80 px-3 py-1.5 text-xs text-white">{activeImage + 1} / {images.length || 1}</div></div>{images.length > 1 && <div className="mt-3 flex gap-3 overflow-x-auto pb-1">{images.map((image, index) => <button key={`${image}-${index}`} type="button" onClick={() => setActiveImage(index)} className={`h-16 w-20 shrink-0 overflow-hidden rounded-lg border-2 ${activeImage === index ? 'border-[#d85e45]' : 'border-transparent'}`} data-testid={`button-gallery-${index}`}><img src={image} alt="" className="h-full w-full object-cover" /></button>)}</div>}<div className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-[#e0d4c0] bg-[#e0d4c0] sm:grid-cols-4"><DetailStat icon={<HomeIcon size={17} />} label={t.sqm} value={`${property.area}`} /><DetailStat icon={<BedDouble size={17} />} label={t.bedrooms} value={`${property.bedrooms}`} /><DetailStat icon={<DoorOpen size={17} />} label={language === 'ar' ? 'الحمامات' : 'Bathrooms'} value={`${property.bathrooms}`} /><DetailStat icon={<Building2 size={17} />} label={language === 'ar' ? 'التشطيب' : 'Finishing'} value={property.finishing || '—'} /></div></div><div><div className="mb-7 flex items-start justify-between gap-4"><div><p className="mb-3 text-xs font-bold tracking-[.12em] text-[#d85e45]">{property.propertyId}</p><h1 className="text-3xl font-bold leading-tight sm:text-4xl">{title}</h1><p className="mt-3 flex items-center gap-1 text-sm text-[#657872]"><MapPin size={15} />{property.neighborhood}{property.compound ? ` · ${property.compound}` : ''}</p></div><StatusPill status={property.status} language={language} /></div><p className="mb-8 text-3xl font-bold text-[#d85e45]">{formatPrice(property.price, language)}<span className="mr-2 text-xs font-normal text-[#657872]">{property.operation === 'rent' ? (language === 'ar' ? '/ شهرياً' : '/ month') : ''}</span></p><div className="section-rule mb-7" /><p className="whitespace-pre-line text-sm leading-8 text-[#526b64]">{language === 'ar' ? property.descriptionAr || property.descriptionEn || 'تفاصيل العقار متاحة عند الطلب.' : property.descriptionEn || property.descriptionAr || 'Details available on request.'}</p><div className="mt-8 rounded-2xl bg-[#e7dcc9] p-5">{submitted ? <div className="py-4 text-center" data-testid="status-lead-success"><div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-[#1c5954] text-white"><Check size={20} /></div><p className="font-bold">{language === 'ar' ? 'وصلنا طلبك' : 'Your request is with us'}</p><p className="mt-1 text-sm text-[#657872]">{language === 'ar' ? 'سيتواصل معك مستشار الهُدى قريباً.' : 'An Al Huda advisor will be in touch shortly.'}</p></div> : <form onSubmit={submitLead}><h2 className="mb-4 text-lg font-bold">{t.inquire}</h2><div className="grid gap-3"><input required name="name" className="field rounded-xl px-4 py-3 text-sm" placeholder={language === 'ar' ? 'الاسم بالكامل' : 'Full name'} data-testid="input-lead-name" /><input required name="phone" className="field rounded-xl px-4 py-3 text-sm" placeholder={language === 'ar' ? 'رقم الهاتف' : 'Phone number'} data-testid="input-lead-phone" /><input name="email" type="email" className="field rounded-xl px-4 py-3 text-sm" placeholder={language === 'ar' ? 'البريد الإلكتروني (اختياري)' : 'Email (optional)'} data-testid="input-lead-email" /><textarea name="message" className="field min-h-20 resize-y rounded-xl px-4 py-3 text-sm" placeholder={language === 'ar' ? 'ما الذي تود معرفته؟' : 'What would you like to know?'} data-testid="input-lead-message" />{leadError && <p className="text-xs font-bold text-[#963e31]" data-testid="status-lead-error">{leadError}</p>}<button type="submit" disabled={createLead.isPending} className="btn-copper flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold disabled:opacity-60" data-testid="button-submit-lead">{createLead.isPending ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />}{language === 'ar' ? 'أرسل الطلب' : 'Send request'}</button></div></form>}</div></div></div></>}</main><PublicFooter language={language} /></div>;
}

function DetailStat({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return <div className="bg-[#fffcf6] px-3 py-4 text-center"><div className="mb-1 flex justify-center text-[#d85e45]">{icon}</div><p className="text-sm font-bold">{value}</p><p className="mt-1 text-[10px] text-[#657872]">{label}</p></div>;
}

function AboutPage({ language, onLanguageChange }: { language: Language; onLanguageChange: (next: Language) => void }) {
  return <div className="public-shell min-h-[100dvh]" dir={language === 'ar' ? 'rtl' : 'ltr'}><PublicHeader language={language} onLanguageChange={onLanguageChange} /><main><section className="bg-[#143f42] px-5 py-20 text-[#f5f0e7] lg:px-8 lg:py-28"><div className="mx-auto max-w-[1000px]"><p className="eyebrow mb-7 text-[#ef9c83]">AL HUDA / OUR APPROACH</p><h1 className="max-w-4xl text-5xl font-bold leading-tight sm:text-7xl">{language === 'ar' ? 'لسنا نبيع المتر. نساعدك أن تختار الحياة التي ستعيشها.' : 'We do not sell the metre. We help you choose the life inside it.'}</h1></div></section><section className="mx-auto max-w-[1240px] px-5 py-20 lg:px-8"><div className="grid gap-14 lg:grid-cols-[.8fr_1.2fr]"><div><p className="eyebrow mb-3 text-[#d85e45]">{language === 'ar' ? 'عن الهُدى' : 'About Al Huda'}</p><p className="text-3xl font-bold">{language === 'ar' ? 'خبرة محلية، وذوق هادئ، ووقت نحترمه.' : 'Local knowledge, quiet taste, and respect for your time.'}</p></div><div className="space-y-6 text-base leading-8 text-[#5c726b]"><p>{language === 'ar' ? 'بدأت الهُدى من مكتب صغير في زايد، ومن ملاحظة بسيطة: لا يحتاج الناس مزيداً من العقارات، بل يحتاجون من يفرز لهم الضوضاء.' : 'Al Huda began in a small Zayed office with a simple observation: people do not need more listings. They need someone to sort through the noise.'}</p><p>{language === 'ar' ? 'نعيش تفاصيل المدينة؛ نعرف أين تفتح الشمس شرفتك، أي كمبوند يكبر مع عائلتك، وأي قرار يستحق الانتظار.' : 'We live the city’s details: where the sun lands on a balcony, which compound grows with your family, and which decision is worth waiting for.'}</p><div className="grid gap-4 pt-5 sm:grid-cols-3"><div className="rounded-xl bg-[#e7dcc9] p-5"><Sparkles className="mb-7 text-[#d85e45]" size={20} /><p className="font-bold">{language === 'ar' ? 'انتقاء لا تجميع' : 'Curated, not crowded'}</p></div><div className="rounded-xl bg-[#e7dcc9] p-5"><MapPin className="mb-7 text-[#d85e45]" size={20} /><p className="font-bold">{language === 'ar' ? 'زايد أولاً' : 'Zayed first'}</p></div><div className="rounded-xl bg-[#e7dcc9] p-5"><Clock3 className="mb-7 text-[#d85e45]" size={20} /><p className="font-bold">{language === 'ar' ? 'وقت أقل ضائع' : 'Less time lost'}</p></div></div></div></div></section></main><PublicFooter language={language} /></div>;
}

function InsightsPage({ language, onLanguageChange }: { language: Language; onLanguageChange: (next: Language) => void }) {
  const articles = language === 'ar' ? [{ tag: 'دليل زايد', title: 'كيف تختار الحي الذي يشبه إيقاع يومك؟', text: 'ثلاثة أسئلة أهم من عدد الغرف حين تبدأ البحث عن بيت جديد.' }, { tag: 'السوق', title: 'الإيجار أم التمليك في غرب القاهرة؟', text: 'نضع الأرقام جانباً لحظة وننظر إلى القرار كما يعيشه الناس.' }, { tag: 'من المكان', title: 'خمسة شوارع نعود إليها دائماً', text: 'ملاحظات صغيرة من جولاتنا اليومية في الشيخ زايد.' }] : [{ tag: 'Zayed guide', title: 'How to choose a neighbourhood that matches your rhythm', text: 'Three questions matter more than the bedroom count when you begin.' }, { tag: 'The market', title: 'Renting or buying in West Cairo?', text: 'We put the numbers aside for a moment and look at how the decision is lived.' }, { tag: 'From the place', title: 'Five streets we keep coming back to', text: 'Small notes from our everyday rounds through Sheikh Zayed.' }];
  return <div className="public-shell min-h-[100dvh]" dir={language === 'ar' ? 'rtl' : 'ltr'}><PublicHeader language={language} onLanguageChange={onLanguageChange} /><main className="mx-auto max-w-[1240px] px-5 py-16 lg:px-8 lg:py-24"><p className="eyebrow mb-4 text-[#d85e45]">AL HUDA / NOTES</p><h1 className="max-w-2xl text-5xl font-bold leading-tight">{language === 'ar' ? 'رؤى من المكان، لا من غرفة الاجتماعات.' : 'Notes from the place, not the boardroom.'}</h1><p className="mt-5 max-w-xl text-base leading-8 text-[#657872]">{language === 'ar' ? 'أفكار عملية عن زايد، والبيت، والقرارات التي تستحق أن تؤخذ بهدوء.' : 'Practical thoughts on Zayed, homes, and the decisions that deserve a little room.'}</p><div className="mt-16 grid gap-5 lg:grid-cols-[1.15fr_.85fr]">{articles.map((article, index) => <article key={article.title} className={`rounded-[1.1rem] border border-[#e0d4c0] p-7 ${index === 0 ? 'bg-[#143f42] text-[#f5f0e7] lg:row-span-2 lg:p-10' : 'bg-[#e7dcc9]'}`} data-testid={`card-insight-${index}`}><p className={`eyebrow mb-14 ${index === 0 ? 'text-[#ef9c83]' : 'text-[#d85e45]'}`}>{article.tag}</p><h2 className="max-w-lg text-2xl font-bold leading-tight">{article.title}</h2><p className={`mt-4 max-w-md text-sm leading-7 ${index === 0 ? 'text-[#c4d2c8]' : 'text-[#657872]'}`}>{article.text}</p><button type="button" className={`mt-8 inline-flex items-center gap-2 text-sm font-bold ${index === 0 ? 'text-[#ef9c83]' : 'text-[#d85e45]'}`} onClick={() => window.alert(language === 'ar' ? 'سنشارك المقال قريباً.' : 'This note is coming soon.')} data-testid={`button-read-insight-${index}`}>{language === 'ar' ? 'اقرأ المقال' : 'Read note'} <ArrowLeft size={15} /></button></article>)}</div></main><PublicFooter language={language} /></div>;
}

function ContactPage({ language, onLanguageChange }: { language: Language; onLanguageChange: (next: Language) => void }) {
  const [sent, setSent] = useState(false);
  return <div className="public-shell min-h-[100dvh]" dir={language === 'ar' ? 'rtl' : 'ltr'}><PublicHeader language={language} onLanguageChange={onLanguageChange} /><main className="mx-auto max-w-[1240px] px-5 py-16 lg:px-8 lg:py-24"><div className="grid gap-14 lg:grid-cols-[.9fr_1.1fr]"><div><p className="eyebrow mb-4 text-[#d85e45]">AL HUDA / CONTACT</p><h1 className="text-5xl font-bold leading-tight">{language === 'ar' ? 'لنبدأ من السؤال الصحيح.' : 'Let’s start with the right question.'}</h1><p className="mt-6 max-w-md text-base leading-8 text-[#657872]">{language === 'ar' ? 'أخبرنا بما تبحث عنه، أو ما الذي لم تجده بعد. الرد الأول منا سيكون من إنسان يعرف زايد.' : 'Tell us what you are looking for, or what you have not found yet. Your first reply will come from a human who knows Zayed.'}</p><div className="mt-10 space-y-5 text-sm"><p className="flex items-center gap-3"><Phone size={17} className="text-[#d85e45]" />+20 100 431 8214</p><p className="flex items-center gap-3"><Mail size={17} className="text-[#d85e45]" />hello@alhuda.eg</p><p className="flex items-center gap-3"><MapPin size={17} className="text-[#d85e45]" />{language === 'ar' ? 'محور 26 يوليو، الشيخ زايد' : '26th of July Corridor, Sheikh Zayed'}</p></div></div><div className="rounded-[1.2rem] bg-[#e7dcc9] p-6 sm:p-9">{sent ? <div className="flex min-h-[350px] flex-col items-center justify-center text-center" data-testid="status-contact-success"><div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#1c5954] text-white"><Check /></div><h2 className="text-2xl font-bold">{language === 'ar' ? 'شكراً لثقتك' : 'Thank you for trusting us'}</h2><p className="mt-2 text-sm text-[#657872]">{language === 'ar' ? 'سنعود إليك خلال يوم عمل.' : 'We will be back in touch within one business day.'}</p></div> : <form className="grid gap-4" onSubmit={(e) => { e.preventDefault(); setSent(true); }}><h2 className="mb-2 text-2xl font-bold">{language === 'ar' ? 'حدثنا عن خطوتك القادمة' : 'Tell us about your next move'}</h2><input required className="field rounded-xl px-4 py-3" placeholder={language === 'ar' ? 'الاسم بالكامل' : 'Full name'} data-testid="input-contact-name" /><input required type="tel" className="field rounded-xl px-4 py-3" placeholder={language === 'ar' ? 'رقم الهاتف' : 'Phone number'} data-testid="input-contact-phone" /><input type="email" className="field rounded-xl px-4 py-3" placeholder={language === 'ar' ? 'البريد الإلكتروني' : 'Email'} data-testid="input-contact-email" /><select className="field rounded-xl px-4 py-3" defaultValue="" data-testid="select-contact-intent"><option value="" disabled>{language === 'ar' ? 'كيف نساعدك؟' : 'How can we help?'}</option><option value="buy">{language === 'ar' ? 'أبحث عن شراء' : 'I want to buy'}</option><option value="rent">{language === 'ar' ? 'أبحث عن إيجار' : 'I want to rent'}</option><option value="list">{language === 'ar' ? 'أريد عرض عقاري' : 'I want to list a property'}</option></select><textarea required className="field min-h-28 rounded-xl px-4 py-3" placeholder={language === 'ar' ? 'رسالتك' : 'Your message'} data-testid="input-contact-message" /><button type="submit" className="btn-copper mt-2 flex items-center justify-center gap-2 rounded-xl px-5 py-3 font-bold" data-testid="button-submit-contact"><Send size={16} />{language === 'ar' ? 'إرسال الرسالة' : 'Send message'}</button></form>}</div></div></main><PublicFooter language={language} /></div>;
}

function AdminLogin({ language, onLanguageChange }: { language: Language; onLanguageChange: (next: Language) => void }) {
  const [, setLocation] = useLocation();
  const [error, setError] = useState('');
  return <div className="admin-shell flex min-h-[100dvh] items-center justify-center bg-[#e7ece5] px-5" dir={language === 'ar' ? 'rtl' : 'ltr'}><div className="absolute right-6 top-6"><LanguageToggle language={language} onChange={onLanguageChange} /></div><div className="grid w-full max-w-[900px] overflow-hidden rounded-[1.4rem] bg-[#fbfcf8] shadow-[0_24px_80px_rgba(16,47,49,.15)] md:grid-cols-[.9fr_1.1fr]"><div className="hidden bg-[#102f31] p-10 text-[#eff2e9] md:block"><Logo dark /><div className="mt-28"><p className="eyebrow mb-5 text-[#ef9c83]">AL HUDA / WORKSPACE</p><h1 className="text-4xl font-bold leading-tight">{language === 'ar' ? 'مساحة العمل التي تحافظ على إيقاعك.' : 'The workspace that keeps your rhythm.'}</h1><p className="mt-5 text-sm leading-7 text-[#b9cbc0]">{language === 'ar' ? 'إدارة أكثر هدوءاً، وقرارات أوضح، ووقت أكبر للعملاء.' : 'Quieter operations, clearer decisions, and more time for clients.'}</p></div></div><form className="p-7 sm:p-12" onSubmit={(e) => { e.preventDefault(); const data = new FormData(e.currentTarget); if (!data.get('email') || !data.get('password')) { setError(language === 'ar' ? 'أدخل البريد وكلمة المرور للمتابعة.' : 'Enter your email and password to continue.'); return; } setLocation('/admin'); }}><div className="mb-10 md:hidden"><Logo /></div><p className="eyebrow mb-3 text-[#d85e45]">STAFF ACCESS</p><h2 className="text-3xl font-bold">{language === 'ar' ? 'مرحباً بعودتك' : 'Welcome back'}</h2><p className="mt-2 text-sm text-[#718078]">{language === 'ar' ? 'سجّل الدخول إلى مساحة عمل الهُدى.' : 'Sign in to the Al Huda workspace.'}</p><div className="mt-9 grid gap-4"><label className="grid gap-2 text-sm font-bold">{language === 'ar' ? 'البريد الإلكتروني' : 'Email'}<input name="email" type="email" className="admin-input rounded-xl px-4 py-3 font-normal" placeholder="name@alhuda.eg" data-testid="input-admin-email" /></label><label className="grid gap-2 text-sm font-bold">{language === 'ar' ? 'كلمة المرور' : 'Password'}<input name="password" type="password" className="admin-input rounded-xl px-4 py-3 font-normal" placeholder="••••••••" data-testid="input-admin-password" /></label>{error && <p className="text-xs font-bold text-[#963e31]" data-testid="status-admin-login-error">{error}</p>}<button className="btn-copper mt-2 flex items-center justify-center gap-2 rounded-xl px-4 py-3 font-bold" type="submit" data-testid="button-admin-login"><KeyRound size={16} />{language === 'ar' ? 'دخول مساحة العمل' : 'Enter workspace'}</button></div><Link href="/" className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-[#657872]" data-testid="link-back-public"><ArrowRight size={15} />{language === 'ar' ? 'العودة للموقع' : 'Back to website'}</Link></form></div></div>;
}

const adminNav = [
  { href: '/admin', labelAr: 'نظرة عامة', labelEn: 'Overview', icon: LayoutDashboard, id: 'dashboard' },
  { href: '/admin/properties', labelAr: 'العقارات', labelEn: 'Properties', icon: Building2, id: 'properties' },
  { href: '/admin/leads', labelAr: 'العملاء المحتملون', labelEn: 'Lead inbox', icon: UsersRound, id: 'leads' },
  { href: '/admin/settings', labelAr: 'إعدادات الشركة', labelEn: 'Company settings', icon: Settings, id: 'settings' },
];

function AdminShell({ language, onLanguageChange, children }: { language: Language; onLanguageChange: (next: Language) => void; children: ReactNode }) {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  return <div className="admin-shell flex" dir={language === 'ar' ? 'rtl' : 'ltr'}><aside className={`admin-sidebar flex min-h-[100dvh] w-[254px] shrink-0 flex-col px-4 py-6 ${mobileOpen ? 'mobile-open' : ''}`}><div className="mb-10 px-4"><Link href="/admin" data-testid="link-admin-logo"><Logo dark /></Link><p className="mt-2 text-[10px] tracking-[.13em] text-[#a1b9aa]">STAFF WORKSPACE</p></div><nav className="grid gap-1">{adminNav.map((item) => { const Icon = item.icon; const active = item.id === 'dashboard' ? location === '/admin' : location.startsWith(item.href); return <Link href={item.href} key={item.id} onClick={() => setMobileOpen(false)} className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm transition hover:bg-white/10 ${active ? 'active' : 'text-[#c6d4c9]'}`} data-testid={`link-admin-${item.id}`}><Icon size={18} />{language === 'ar' ? item.labelAr : item.labelEn}</Link>; })}</nav><div className="mt-auto border-t border-white/10 pt-5"><Link href="/" className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-[#c6d4c9] transition hover:bg-white/10" data-testid="link-admin-public-site"><ExternalLink size={17} />{language === 'ar' ? 'الموقع العام' : 'Public website'}</Link><Link href="/admin/login" className="mt-1 flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-[#c6d4c9] transition hover:bg-white/10" data-testid="link-admin-logout"><LogOut size={17} />{language === 'ar' ? 'تسجيل الخروج' : 'Sign out'}</Link></div></aside>{mobileOpen && <button className="fixed inset-0 z-30 bg-[#102f31]/35 md:hidden" type="button" onClick={() => setMobileOpen(false)} aria-label="Close menu" data-testid="button-close-admin-menu" />}<div className="min-w-0 flex-1"><header className="admin-topbar sticky top-0 z-20 flex h-[72px] items-center justify-between px-5 lg:px-8"><button type="button" className="rounded-lg p-2 text-[#102f31] md:hidden" onClick={() => setMobileOpen(true)} data-testid="button-open-admin-menu"><Menu size={21} /></button><div className="hidden md:block"><p className="text-xs font-bold text-[#718078]">{language === 'ar' ? 'مساحة عمل الهُدى' : 'Al Huda workspace'}</p><p className="text-sm font-bold">{language === 'ar' ? 'صباح الخير، نادين' : 'Good morning, Nadine'}</p></div><div className="flex items-center gap-4"><LanguageToggle language={language} onChange={onLanguageChange} /><div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#d9cbb2] text-xs font-bold text-[#102f31]" data-testid="text-admin-avatar">ن</div></div></header><main className="p-5 lg:p-8">{children}</main></div></div>;
}

function AdminPageHeader({ eyebrow, title, description, action }: { eyebrow: string; title: string; description?: string; action?: ReactNode }) {
  return <div className="mb-8 flex flex-wrap items-end justify-between gap-5"><div><p className="eyebrow mb-2 text-[#d85e45]">{eyebrow}</p><h1 className="text-3xl font-bold tracking-tight text-[#102f31] sm:text-4xl">{title}</h1>{description && <p className="mt-2 max-w-2xl text-sm leading-6 text-[#718078]">{description}</p>}</div>{action}</div>;
}

function AdminError({ language, onRetry }: { language: Language; onRetry?: () => void }) {
  return <div className="admin-card rounded-2xl px-6 py-12 text-center" data-testid="admin-state-error"><CircleAlert className="mx-auto mb-3 text-[#d85e45]" /><p className="font-bold">{language === 'ar' ? 'تعذر الوصول إلى البيانات' : 'We could not reach the data'}</p><p className="mt-1 text-sm text-[#718078]">{language === 'ar' ? 'الخدمة غير متاحة مؤقتاً.' : 'The service may be temporarily unavailable.'}</p>{onRetry && <button type="button" onClick={onRetry} className="mt-5 rounded-lg bg-[#102f31] px-4 py-2 text-xs font-bold text-white" data-testid="button-admin-retry">{language === 'ar' ? 'إعادة المحاولة' : 'Retry'}</button>}</div>;
}

function AdminDashboard({ language }: { language: Language }) {
  const t = useLangText(language);
  const query = useGetDashboardSummary({ query: { queryKey: getGetDashboardSummaryQueryKey(), staleTime: 30000 } });
  const summary = query.data;
  if (query.isLoading) return <AdminLoading language={language} />;
  if (query.isError || !summary) return <AdminError language={language} onRetry={() => query.refetch()} />;
  const stats = [{ label: language === 'ar' ? 'إجمالي العقارات' : 'Total properties', value: summary.totalProperties, icon: Building2, tone: 'admin-stat-accent' }, { label: language === 'ar' ? 'المتاحة الآن' : 'Available now', value: summary.availableProperties, icon: KeyRound, tone: 'admin-stat-teal' }, { label: language === 'ar' ? 'المميزة' : 'Featured', value: summary.featuredProperties, icon: Star, tone: 'admin-stat-sand' }, { label: language === 'ar' ? 'عملاء جدد' : 'New leads', value: summary.newLeads, icon: UsersRound, tone: 'admin-stat-plum' }];
  return <><AdminPageHeader eyebrow="AL HUDA / OVERVIEW" title={language === 'ar' ? 'نظرة على اليوم' : 'A view of today'} description={language === 'ar' ? 'الأرقام التي تحتاجها، دون الضوضاء.' : 'The numbers you need, without the noise.'} action={<Link href="/admin/properties/new" className="btn-copper inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-bold" data-testid="link-dashboard-add-property"><Plus size={17} />{language === 'ar' ? 'إضافة عقار' : 'Add property'}</Link>} /><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{stats.map((stat) => { const Icon = stat.icon; return <div className={`admin-card ${stat.tone} rounded-xl p-5`} key={stat.label} data-testid={`stat-${stat.label}`}><div className="flex items-start justify-between"><p className="text-xs font-bold text-[#718078]">{stat.label}</p><Icon size={18} className="text-[#d85e45]" /></div><p className="mt-5 text-3xl font-bold text-[#102f31]">{stat.value}</p></div>; })}</div><div className="mt-6 grid gap-5 xl:grid-cols-[1.2fr_.8fr]"><section className="admin-card rounded-xl p-5"><div className="mb-5 flex items-center justify-between"><div><h2 className="font-bold">{language === 'ar' ? 'أحدث العقارات' : 'Recent properties'}</h2><p className="mt-1 text-xs text-[#718078]">{language === 'ar' ? 'آخر ما أضيف إلى المجموعة' : 'Latest additions to the collection'}</p></div><Link href="/admin/properties" className="text-xs font-bold text-[#d85e45]" data-testid="link-dashboard-properties">{t.properties}</Link></div><div className="grid gap-2">{summary.recentProperties?.slice(0, 5).map((property) => <Link href={`/admin/properties/${property.id}`} className="flex items-center gap-3 rounded-lg p-2.5 transition hover:bg-[#f1f4ee]" key={property.id} data-testid={`row-recent-property-${property.id}`}><ImageFrame property={property} className="h-12 w-14 rounded-md" /><div className="min-w-0 flex-1"><p className="truncate text-sm font-bold">{language === 'ar' ? property.titleAr || property.titleEn : property.titleEn || property.titleAr}</p><p className="mt-1 text-xs text-[#718078]">{property.neighborhood}</p></div><span className="text-xs font-bold text-[#d85e45]">{formatPrice(property.price, language)}</span></Link>)}</div></section><section className="admin-card rounded-xl p-5"><div className="mb-5 flex items-center justify-between"><div><h2 className="font-bold">{language === 'ar' ? 'آخر الرسائل' : 'Latest enquiries'}</h2><p className="mt-1 text-xs text-[#718078]">{language === 'ar' ? 'تحتاج إلى ردك' : 'Waiting for your reply'}</p></div><Link href="/admin/leads" className="text-xs font-bold text-[#d85e45]" data-testid="link-dashboard-leads">{language === 'ar' ? 'فتح الصندوق' : 'Open inbox'}</Link></div><div className="space-y-3">{summary.recentLeads?.slice(0, 4).map((lead) => <div className="flex items-center gap-3 border-b border-[#e1e6de] pb-3 last:border-0 last:pb-0" key={lead.id} data-testid={`row-recent-lead-${lead.id}`}><div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#d9cbb2] text-xs font-bold">{lead.name.slice(0, 1)}</div><div className="min-w-0 flex-1"><p className="truncate text-sm font-bold">{lead.name}</p><p className="truncate text-xs text-[#718078]">{lead.propertyTitle || (language === 'ar' ? 'استفسار عام' : 'General enquiry')}</p></div><span className="text-[10px] text-[#718078]">{formatDate(lead.createdAt, language)}</span></div>)}</div></section></div></>;
}

function AdminLoading({ language }: { language: Language }) {
  return <div><div className="mb-8 space-y-3"><div className="skeleton h-3 w-28 rounded" /><div className="skeleton h-9 w-64 rounded" /></div><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{[1, 2, 3, 4].map((n) => <div className="admin-card p-5" key={n}><div className="skeleton h-3 w-24 rounded" /><div className="skeleton mt-5 h-9 w-16 rounded" /></div>)}</div><p className="mt-8 text-center text-xs text-[#718078]">{language === 'ar' ? 'جاري تجهيز المساحة...' : 'Preparing your workspace...'}</p></div>;
}

function AdminProperties({ language }: { language: Language }) {
  const queryClient = useQueryClient();
  const query = useListProperties(undefined, { query: { queryKey: getListPropertiesQueryKey(), staleTime: 30000 } });
  const remove = useDeleteProperty();
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const properties = (query.data || []).filter((p) => `${p.titleEn} ${p.titleAr} ${p.propertyId} ${p.neighborhood}`.toLowerCase().includes(search.toLowerCase()));
  const confirmDelete = () => { if (deleteId === null) return; remove.mutate({ id: deleteId }, { onSuccess: () => { queryClient.invalidateQueries({ queryKey: getListPropertiesQueryKey() }); queryClient.invalidateQueries({ queryKey: getGetDashboardSummaryQueryKey() }); setDeleteId(null); }, onError: () => setDeleteId(null) }); };
  return <><AdminPageHeader eyebrow="AL HUDA / INVENTORY" title={language === 'ar' ? 'العقارات' : 'Properties'} description={language === 'ar' ? 'أدر المجموعة التي يراها عملاؤك.' : 'Manage the collection your clients see.'} action={<Link href="/admin/properties/new" className="btn-copper inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-bold" data-testid="link-add-property"><Plus size={17} />{language === 'ar' ? 'إضافة عقار' : 'Add property'}</Link>} /><div className="admin-card overflow-hidden rounded-xl"><div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e1e6de] p-4"><div className="flex w-full max-w-sm items-center gap-2 rounded-lg border border-[#cad4ca] bg-white px-3"><Search size={16} className="text-[#718078]" /><input className="w-full bg-transparent py-2 text-sm outline-none" value={search} onChange={(e) => setSearch(e.target.value)} placeholder={language === 'ar' ? 'ابحث في العقارات' : 'Search properties'} data-testid="input-admin-property-search" /></div><div className="flex items-center gap-2 text-xs text-[#718078]"><ListFilter size={15} />{properties.length} {language === 'ar' ? 'نتيجة' : 'results'}</div></div>{query.isLoading ? <div className="space-y-3 p-5">{[1, 2, 3].map((n) => <div className="skeleton h-14 rounded" key={n} />)}</div> : query.isError ? <div className="p-5"><AdminError language={language} onRetry={() => query.refetch()} /></div> : properties.length === 0 ? <div className="px-5 py-16 text-center" data-testid="admin-properties-empty"><Building2 className="mx-auto mb-3 text-[#d85e45]" /><p className="font-bold">{language === 'ar' ? 'لا توجد عقارات هنا بعد' : 'No properties here yet'}</p><Link href="/admin/properties/new" className="mt-4 inline-flex text-sm font-bold text-[#d85e45]" data-testid="link-empty-add-property">{language === 'ar' ? 'أضف أول عقار' : 'Add your first property'}</Link></div> : <div className="overflow-x-auto"><table className="admin-table w-full min-w-[750px] text-right" dir={language === 'ar' ? 'rtl' : 'ltr'}><thead><tr><th className="px-5 py-4">{language === 'ar' ? 'العقار' : 'Property'}</th><th className="px-3 py-4">{language === 'ar' ? 'التصنيف' : 'Classification'}</th><th className="px-3 py-4">{language === 'ar' ? 'السعر' : 'Price'}</th><th className="px-3 py-4">{language === 'ar' ? 'الحالة' : 'Status'}</th><th className="px-5 py-4">{language === 'ar' ? 'إجراء' : 'Action'}</th></tr></thead><tbody>{properties.map((property) => <tr key={property.id} data-testid={`row-admin-property-${property.id}`}><td className="px-5 py-3"><div className="flex items-center gap-3"><ImageFrame property={property} className="h-11 w-14 rounded-md" /><div><p className="font-bold">{language === 'ar' ? property.titleAr || property.titleEn : property.titleEn || property.titleAr}</p><p className="mt-1 text-xs text-[#718078]">{property.propertyId} · {property.neighborhood}</p></div></div></td><td className="px-3 py-3 text-sm text-[#718078]">{property.propertyType} · {property.operation}</td><td className="px-3 py-3 text-sm font-bold text-[#d85e45]">{formatPrice(property.price, language)}</td><td className="px-3 py-3"><StatusPill status={property.status} language={language} /></td><td className="px-5 py-3"><div className="flex items-center gap-1"><Link href={`/admin/properties/${property.id}`} className="rounded-lg p-2 text-[#718078] transition hover:bg-[#e7ece5] hover:text-[#102f31]" data-testid={`link-edit-property-${property.id}`} aria-label="Edit property"><Edit3 size={16} /></Link><button type="button" onClick={() => setDeleteId(property.id)} className="rounded-lg p-2 text-[#718078] transition hover:bg-[#f8e3dc] hover:text-[#963e31]" data-testid={`button-delete-property-${property.id}`} aria-label="Archive property"><Trash2 size={16} /></button></div></td></tr>)}</tbody></table></div>}</div>{deleteId !== null && <div className="dialog-backdrop fixed inset-0 z-50 flex items-center justify-center px-5" role="dialog" aria-modal="true"><div className="dialog-panel w-full max-w-md rounded-2xl p-7" dir={language === 'ar' ? 'rtl' : 'ltr'}><div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-[#f8e3dc] text-[#963e31]"><Trash2 size={19} /></div><h2 className="text-xl font-bold">{language === 'ar' ? 'أرشفة هذا العقار؟' : 'Archive this property?'}</h2><p className="mt-2 text-sm leading-6 text-[#718078]">{language === 'ar' ? 'سيختفي من المجموعة العامة، ويمكنك التواصل مع فريق النظام لاستعادته.' : 'It will leave the public collection. Contact your system team if it needs restoring.'}</p><div className="mt-7 flex gap-3"><button type="button" onClick={() => setDeleteId(null)} className="flex-1 rounded-lg border border-[#cad4ca] px-4 py-2.5 text-sm font-bold" data-testid="button-cancel-delete">{language === 'ar' ? 'إلغاء' : 'Cancel'}</button><button type="button" disabled={remove.isPending} onClick={confirmDelete} className="flex-1 rounded-lg bg-[#963e31] px-4 py-2.5 text-sm font-bold text-white disabled:opacity-60" data-testid="button-confirm-delete">{remove.isPending ? <Loader2 className="mx-auto animate-spin" size={16} /> : language === 'ar' ? 'أرشفة' : 'Archive'}</button></div></div></div>}</>;
}

const emptyProperty: PropertyInput = { titleEn: '', titleAr: '', propertyType: 'apartment', operation: 'sale', neighborhood: 'Sheikh Zayed', compound: '', price: 0, status: 'available', featured: false, area: 0, bedrooms: 0, bathrooms: 0, finishing: '', floor: '', elevator: false, imageUrl: '', imageUrls: [], descriptionEn: '', descriptionAr: '' };

function AdminPropertyForm({ language }: { language: Language }) {
  const params = useParams<{ id?: string }>();
  const isNew = !params.id || params.id === 'new';
  const id = Number(params.id);
  const existing = useGetProperty(Number.isFinite(id) ? id : -1, { query: { enabled: !isNew && id > 0, queryKey: getGetPropertyQueryKey(Number.isFinite(id) ? id : -1) } });
  const create = useCreateProperty();
  const update = useUpdateProperty();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<PropertyInput>(emptyProperty);
  const [initialized, setInitialized] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => { if (!isNew && existing.data && !initialized) { const p = existing.data; setForm({ titleEn: p.titleEn, titleAr: p.titleAr, propertyType: p.propertyType, operation: p.operation, neighborhood: p.neighborhood, compound: p.compound || '', price: p.price, status: p.status, featured: p.featured, area: p.area, bedrooms: p.bedrooms, bathrooms: p.bathrooms, finishing: p.finishing || '', floor: p.floor || '', elevator: p.elevator || false, imageUrl: p.imageUrl, imageUrls: p.imageUrls || [], descriptionEn: p.descriptionEn || '', descriptionAr: p.descriptionAr || '' }); setInitialized(true); } }, [existing.data, initialized, isNew]);
  const updateField = (key: keyof PropertyInput, value: string | number | boolean | string[]) => setForm((current) => ({ ...current, [key]: value }));
  const submit = (e: FormEvent) => { e.preventDefault(); if (step < 3) { setStep((s) => s + 1); return; } setError(''); const payload: PropertyInput = { ...form, price: Number(form.price), area: Number(form.area), bedrooms: Number(form.bedrooms), bathrooms: Number(form.bathrooms), compound: form.compound || undefined, finishing: form.finishing || undefined, floor: form.floor || undefined, imageUrl: form.imageUrl || undefined, descriptionEn: form.descriptionEn || undefined, descriptionAr: form.descriptionAr || undefined }; const onSuccess = () => { queryClient.invalidateQueries({ queryKey: getListPropertiesQueryKey() }); queryClient.invalidateQueries({ queryKey: getGetDashboardSummaryQueryKey() }); setLocation('/admin/properties'); }; if (isNew) create.mutate({ data: payload }, { onSuccess, onError: () => setError(language === 'ar' ? 'تعذر حفظ العقار.' : 'We could not save this property.') }); else update.mutate({ id, data: payload }, { onSuccess, onError: () => setError(language === 'ar' ? 'تعذر تحديث العقار.' : 'We could not update this property.') }); };
  const pending = create.isPending || update.isPending;
  if (!isNew && existing.isLoading) return <AdminLoading language={language} />;
  if (!isNew && existing.isError) return <AdminError language={language} onRetry={() => existing.refetch()} />;
  return <div className="mx-auto max-w-[1000px]"><AdminPageHeader eyebrow={`AL HUDA / ${isNew ? 'NEW PROPERTY' : 'EDIT PROPERTY'}`} title={isNew ? (language === 'ar' ? 'إضافة عقار جديد' : 'Add a new property') : (language === 'ar' ? 'تعديل بيانات العقار' : 'Edit property')} description={language === 'ar' ? 'أدخل التفاصيل كما يحب العميل أن يقرأها.' : 'Add the details the way a client would want to read them.'} action={<Link href="/admin/properties" className="inline-flex items-center gap-2 text-sm font-bold text-[#718078]" data-testid="link-form-cancel"><ArrowRight size={15} />{language === 'ar' ? 'إلغاء' : 'Cancel'}</Link>} /><div className="mb-6 flex items-center gap-2">{[1, 2, 3].map((n) => <div key={n} className="flex flex-1 items-center gap-2"><div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${step >= n ? 'bg-[#102f31] text-white' : 'bg-[#dce2d8] text-[#718078]'}`}>{step > n ? <Check size={15} /> : n}</div><span className={`hidden text-xs font-bold sm:block ${step >= n ? 'text-[#102f31]' : 'text-[#718078]'}`}>{n === 1 ? (language === 'ar' ? 'الأساسيات' : 'Basics') : n === 2 ? (language === 'ar' ? 'المواصفات' : 'Specs') : (language === 'ar' ? 'الظهور' : 'Visibility')}</span>{n < 3 && <div className="h-px flex-1 bg-[#dce2d8]" />}</div>)}</div><form className="admin-card rounded-xl p-5 sm:p-8" onSubmit={submit}><div className="grid gap-5">{step === 1 && <><div className="grid gap-5 md:grid-cols-2"><label className="grid gap-2 text-sm font-bold">{language === 'ar' ? 'العنوان بالعربية' : 'Arabic title'}<input required value={form.titleAr} onChange={(e) => updateField('titleAr', e.target.value)} className="admin-input rounded-lg px-3 py-2.5" dir="rtl" data-testid="input-property-title-ar" /></label><label className="grid gap-2 text-sm font-bold">{language === 'ar' ? 'العنوان بالإنجليزية' : 'English title'}<input required value={form.titleEn} onChange={(e) => updateField('titleEn', e.target.value)} className="admin-input rounded-lg px-3 py-2.5" data-testid="input-property-title-en" /></label></div><div className="grid gap-5 md:grid-cols-3"><label className="grid gap-2 text-sm font-bold">{language === 'ar' ? 'نوع العقار' : 'Property type'}<select value={form.propertyType} onChange={(e) => updateField('propertyType', e.target.value)} className="admin-input rounded-lg px-3 py-2.5" data-testid="select-form-property-type"><option value="apartment">{language === 'ar' ? 'شقة' : 'Apartment'}</option><option value="villa">{language === 'ar' ? 'فيلا' : 'Villa'}</option><option value="twin_house">{language === 'ar' ? 'توين هاوس' : 'Twin house'}</option><option value="office">{language === 'ar' ? 'مكتب' : 'Office'}</option></select></label><label className="grid gap-2 text-sm font-bold">{language === 'ar' ? 'الغرض' : 'Operation'}<select value={form.operation} onChange={(e) => updateField('operation', e.target.value)} className="admin-input rounded-lg px-3 py-2.5" data-testid="select-form-operation"><option value="sale">{language === 'ar' ? 'للبيع' : 'For sale'}</option><option value="rent">{language === 'ar' ? 'للإيجار' : 'For rent'}</option></select></label><label className="grid gap-2 text-sm font-bold">{language === 'ar' ? 'الحي' : 'Neighbourhood'}<input required value={form.neighborhood} onChange={(e) => updateField('neighborhood', e.target.value)} className="admin-input rounded-lg px-3 py-2.5" data-testid="input-form-neighborhood" /></label></div><label className="grid gap-2 text-sm font-bold">{language === 'ar' ? 'الكمبوند' : 'Compound'}<input value={form.compound || ''} onChange={(e) => updateField('compound', e.target.value)} className="admin-input rounded-lg px-3 py-2.5" data-testid="input-form-compound" /></label></>}{step === 2 && <><div className="grid gap-5 sm:grid-cols-3"><label className="grid gap-2 text-sm font-bold">{language === 'ar' ? 'السعر' : 'Price'}<input required type="number" min="0" value={form.price} onChange={(e) => updateField('price', Number(e.target.value))} className="admin-input rounded-lg px-3 py-2.5" data-testid="input-form-price" /></label><label className="grid gap-2 text-sm font-bold">{language === 'ar' ? 'المساحة' : 'Area'}<input required type="number" min="0" value={form.area} onChange={(e) => updateField('area', Number(e.target.value))} className="admin-input rounded-lg px-3 py-2.5" data-testid="input-form-area" /></label><label className="grid gap-2 text-sm font-bold">{language === 'ar' ? 'التشطيب' : 'Finishing'}<input value={form.finishing || ''} onChange={(e) => updateField('finishing', e.target.value)} className="admin-input rounded-lg px-3 py-2.5" data-testid="input-form-finishing" /></label></div><div className="grid gap-5 sm:grid-cols-3"><label className="grid gap-2 text-sm font-bold">{language === 'ar' ? 'غرف النوم' : 'Bedrooms'}<input required type="number" min="0" value={form.bedrooms} onChange={(e) => updateField('bedrooms', Number(e.target.value))} className="admin-input rounded-lg px-3 py-2.5" data-testid="input-form-bedrooms" /></label><label className="grid gap-2 text-sm font-bold">{language === 'ar' ? 'الحمامات' : 'Bathrooms'}<input required type="number" min="0" value={form.bathrooms} onChange={(e) => updateField('bathrooms', Number(e.target.value))} className="admin-input rounded-lg px-3 py-2.5" data-testid="input-form-bathrooms" /></label><label className="grid gap-2 text-sm font-bold">{language === 'ar' ? 'الدور' : 'Floor'}<input value={form.floor || ''} onChange={(e) => updateField('floor', e.target.value)} className="admin-input rounded-lg px-3 py-2.5" data-testid="input-form-floor" /></label></div><label className="flex items-center gap-3 text-sm font-bold"><input type="checkbox" checked={Boolean(form.elevator)} onChange={(e) => updateField('elevator', e.target.checked)} className="h-4 w-4 accent-[#d85e45]" data-testid="checkbox-form-elevator" />{language === 'ar' ? 'يوجد مصعد' : 'Elevator available'}</label><label className="grid gap-2 text-sm font-bold">{language === 'ar' ? 'رابط الصورة الرئيسية' : 'Main image URL'}<input type="url" value={form.imageUrl || ''} onChange={(e) => updateField('imageUrl', e.target.value)} className="admin-input rounded-lg px-3 py-2.5" placeholder="https://" data-testid="input-form-image-url" /></label></>}{step === 3 && <><div className="grid gap-5 md:grid-cols-2"><label className="grid gap-2 text-sm font-bold">{language === 'ar' ? 'الوصف بالعربية' : 'Arabic description'}<textarea value={form.descriptionAr || ''} onChange={(e) => updateField('descriptionAr', e.target.value)} className="admin-input min-h-44 resize-y rounded-lg px-3 py-2.5" dir="rtl" data-testid="textarea-form-description-ar" /></label><label className="grid gap-2 text-sm font-bold">{language === 'ar' ? 'الوصف بالإنجليزية' : 'English description'}<textarea value={form.descriptionEn || ''} onChange={(e) => updateField('descriptionEn', e.target.value)} className="admin-input min-h-44 resize-y rounded-lg px-3 py-2.5" data-testid="textarea-form-description-en" /></label></div><div className="grid gap-5 sm:grid-cols-2"><label className="grid gap-2 text-sm font-bold">{language === 'ar' ? 'حالة الظهور' : 'Listing status'}<select value={form.status || 'available'} onChange={(e) => updateField('status', e.target.value)} className="admin-input rounded-lg px-3 py-2.5" data-testid="select-form-status"><option value="available">{language === 'ar' ? 'متاح' : 'Available'}</option><option value="draft">{language === 'ar' ? 'مسودة' : 'Draft'}</option><option value="sold">{language === 'ar' ? 'تم البيع' : 'Sold'}</option><option value="rented">{language === 'ar' ? 'مؤجر' : 'Rented'}</option></select></label><label className="flex items-center gap-3 self-end pb-3 text-sm font-bold"><input type="checkbox" checked={Boolean(form.featured)} onChange={(e) => updateField('featured', e.target.checked)} className="h-4 w-4 accent-[#d85e45]" data-testid="checkbox-form-featured" />{language === 'ar' ? 'إظهار ضمن المختارات' : 'Feature in the collection'}</label></div><div className="rounded-lg bg-[#eef2ea] p-4 text-sm text-[#718078]"><Eye size={17} className="mb-2 text-[#d85e45]" />{language === 'ar' ? 'يمكنك مراجعة التفاصيل قبل الحفظ. الصور الإضافية يمكن إدارتها لاحقاً.' : 'Review the details before saving. Additional images can be managed later.'}</div></>}{error && <p className="text-sm font-bold text-[#963e31]" data-testid="status-property-form-error">{error}</p>}<div className="mt-4 flex items-center justify-between border-t border-[#e1e6de] pt-5">{step > 1 ? <button type="button" onClick={() => setStep((s) => s - 1)} className="inline-flex items-center gap-2 rounded-lg border border-[#cad4ca] px-4 py-2.5 text-sm font-bold" data-testid="button-form-back"><ChevronRight size={16} />{language === 'ar' ? 'السابق' : 'Back'}</button> : <span />}{step < 3 ? <button type="submit" className="btn-ink inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-bold" data-testid="button-form-next">{language === 'ar' ? 'التالي' : 'Continue'}<ChevronLeft size={16} /></button> : <button type="submit" disabled={pending} className="btn-copper inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-bold disabled:opacity-60" data-testid="button-form-save">{pending && <Loader2 className="animate-spin" size={16} />}{isNew ? (language === 'ar' ? 'حفظ العقار' : 'Save property') : (language === 'ar' ? 'حفظ التغييرات' : 'Save changes')}<Check size={16} /></button>}</div></div></form></div>;
}

function AdminLeads({ language }: { language: Language }) {
  const query = useListLeads({ query: { queryKey: getListLeadsQueryKey(), staleTime: 30000 } });
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const leads = (query.data || []).filter((lead) => (filter === 'all' || lead.status === filter) && `${lead.name} ${lead.phone} ${lead.email || ''} ${lead.propertyTitle || ''}`.toLowerCase().includes(search.toLowerCase()));
  if (query.isLoading) return <AdminLoading language={language} />;
  if (query.isError) return <AdminError language={language} onRetry={() => query.refetch()} />;
  return <><AdminPageHeader eyebrow="AL HUDA / RELATIONSHIPS" title={language === 'ar' ? 'صندوق العملاء' : 'Lead inbox'} description={language === 'ar' ? 'كل رسالة بداية لمحادثة جيدة.' : 'Every message is the beginning of a good conversation.'} /><div className="admin-card overflow-hidden rounded-xl"><div className="flex flex-wrap items-center gap-3 border-b border-[#e1e6de] p-4"><div className="flex min-w-[220px] flex-1 items-center gap-2 rounded-lg border border-[#cad4ca] bg-white px-3"><Search size={16} className="text-[#718078]" /><input className="w-full bg-transparent py-2 text-sm outline-none" value={search} onChange={(e) => setSearch(e.target.value)} placeholder={language === 'ar' ? 'ابحث بالاسم أو الهاتف' : 'Search by name or phone'} data-testid="input-leads-search" /></div><div className="flex items-center gap-1 rounded-lg bg-[#eef2ea] p-1">{['all', 'new', 'contacted'].map((status) => <button type="button" key={status} onClick={() => setFilter(status)} className={`rounded-md px-3 py-2 text-xs font-bold transition ${filter === status ? 'bg-[#102f31] text-white' : 'text-[#718078] hover:bg-white'}`} data-testid={`button-lead-filter-${status}`}>{status === 'all' ? (language === 'ar' ? 'الكل' : 'All') : status === 'new' ? (language === 'ar' ? 'جديد' : 'New') : (language === 'ar' ? 'تم التواصل' : 'Contacted')}</button>)}</div></div>{leads.length === 0 ? <div className="px-5 py-16 text-center" data-testid="admin-leads-empty"><MessageSquare className="mx-auto mb-3 text-[#d85e45]" /><p className="font-bold">{language === 'ar' ? 'الصندوق هادئ الآن' : 'The inbox is quiet'}</p><p className="mt-2 text-sm text-[#718078]">{language === 'ar' ? 'ستظهر استفسارات العملاء هنا.' : 'New client enquiries will appear here.'}</p></div> : <div className="overflow-x-auto"><table className="admin-table w-full min-w-[780px]" dir={language === 'ar' ? 'rtl' : 'ltr'}><thead><tr><th className="px-5 py-4">{language === 'ar' ? 'العميل' : 'Client'}</th><th className="px-3 py-4">{language === 'ar' ? 'العقار' : 'Property'}</th><th className="px-3 py-4">{language === 'ar' ? 'المصدر' : 'Source'}</th><th className="px-3 py-4">{language === 'ar' ? 'الحالة' : 'Status'}</th><th className="px-5 py-4">{language === 'ar' ? 'وصلت' : 'Received'}</th></tr></thead><tbody>{leads.map((lead) => <tr key={lead.id} data-testid={`row-lead-${lead.id}`}><td className="px-5 py-4"><div className="flex items-center gap-3"><div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#d9cbb2] text-xs font-bold">{lead.name.slice(0, 1)}</div><div><p className="font-bold">{lead.name}</p><a href={`tel:${lead.phone}`} className="mt-1 block text-xs text-[#d85e45]" data-testid={`link-lead-phone-${lead.id}`}>{lead.phone}</a></div></div></td><td className="px-3 py-4 text-sm text-[#718078]">{lead.propertyTitle || (language === 'ar' ? 'استفسار عام' : 'General enquiry')}</td><td className="px-3 py-4 text-xs text-[#718078]">{lead.source}</td><td className="px-3 py-4"><span className={`status-pill ${lead.status === 'new' ? 'status-available' : 'status-draft'}`}>{lead.status === 'new' ? (language === 'ar' ? 'جديد' : 'New') : lead.status}</span></td><td className="px-5 py-4 text-xs text-[#718078]">{formatDate(lead.createdAt, language)}</td></tr>)}</tbody></table></div>}</div></>;
}

function AdminSettings({ language }: { language: Language }) {
  const [saved, setSaved] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [digest, setDigest] = useState(false);
  return <><AdminPageHeader eyebrow="AL HUDA / SETTINGS" title={language === 'ar' ? 'إعدادات الشركة' : 'Company settings'} description={language === 'ar' ? 'مساحة صغيرة للقرارات التي تبقى خلف الكواليس.' : 'A small space for the decisions behind the scenes.'} /><div className="grid max-w-[900px] gap-5"><section className="admin-card rounded-xl p-6"><div className="mb-6 flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#e7dcc9] text-[#d85e45]"><Building2 size={19} /></div><div><h2 className="font-bold">{language === 'ar' ? 'هوية الشركة' : 'Company identity'}</h2><p className="text-xs text-[#718078]">{language === 'ar' ? 'تظهر هذه التفاصيل للعملاء في التواصل.' : 'These details appear in client communications.'}</p></div></div><div className="grid gap-4 sm:grid-cols-2"><label className="grid gap-2 text-sm font-bold">{language === 'ar' ? 'اسم الشركة' : 'Company name'}<input defaultValue="AL HUDA Real Estate" className="admin-input rounded-lg px-3 py-2.5" data-testid="input-settings-company" /></label><label className="grid gap-2 text-sm font-bold">{language === 'ar' ? 'البريد العام' : 'Public email'}<input defaultValue="hello@alhuda.eg" className="admin-input rounded-lg px-3 py-2.5" data-testid="input-settings-email" /></label><label className="grid gap-2 text-sm font-bold sm:col-span-2">{language === 'ar' ? 'العنوان' : 'Office address'}<input defaultValue={language === 'ar' ? 'محور 26 يوليو، الشيخ زايد' : '26th of July Corridor, Sheikh Zayed'} className="admin-input rounded-lg px-3 py-2.5" data-testid="input-settings-address" /></label></div></section><section className="admin-card rounded-xl p-6"><div className="mb-5 flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#e7dcc9] text-[#d85e45]"><ShieldCheck size={19} /></div><div><h2 className="font-bold">{language === 'ar' ? 'التنبيهات' : 'Notifications'}</h2><p className="text-xs text-[#718078]">{language === 'ar' ? 'اختر ما يبقي فريقك على اطلاع.' : 'Choose what keeps your team informed.'}</p></div></div><div className="space-y-4"><SettingToggle label={language === 'ar' ? 'تنبيه عند وصول عميل جديد' : 'Notify me about new leads'} value={notifications} onChange={setNotifications} id="notifications" /><SettingToggle label={language === 'ar' ? 'ملخص أسبوعي للعقارات' : 'Weekly inventory digest'} value={digest} onChange={setDigest} id="digest" /></div></section><div className="flex items-center gap-4"><button type="button" onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2500); }} className="btn-copper rounded-lg px-5 py-2.5 text-sm font-bold" data-testid="button-save-settings">{language === 'ar' ? 'حفظ الإعدادات' : 'Save settings'}</button>{saved && <span className="flex items-center gap-2 text-sm font-bold text-[#1c5954]" data-testid="status-settings-saved"><Check size={16} />{language === 'ar' ? 'تم الحفظ' : 'Saved'}</span>}</div></div></>;
}

function SettingToggle({ label, value, onChange, id }: { label: string; value: boolean; onChange: (value: boolean) => void; id: string }) {
  return <label className="flex cursor-pointer items-center justify-between gap-5 border-b border-[#e1e6de] pb-4 last:border-0 last:pb-0"><span className="text-sm font-bold">{label}</span><button type="button" role="switch" aria-checked={value} onClick={() => onChange(!value)} className={`relative h-6 w-11 rounded-full transition ${value ? 'bg-[#1c5954]' : 'bg-[#cbd3c9]'}`} data-testid={`button-toggle-${id}`}><span className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${value ? 'right-1' : 'left-1'}`} /></button></label>;
}

function NotFound() {
  return <div className="public-shell flex min-h-[100dvh] items-center justify-center px-5 text-center" dir="rtl"><div><p className="eyebrow mb-5 text-[#d85e45]">404 / AL HUDA</p><h1 className="text-5xl font-bold">الصفحة غير موجودة</h1><p className="mt-4 text-[#657872]">يبدو أن هذا العنوان أخذ منعطفاً آخر.</p><Link href="/" className="btn-ink mt-7 inline-flex rounded-full px-5 py-3 text-sm font-bold" data-testid="link-not-found-home">العودة للرئيسية</Link></div></div>;
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function Router({ language, onLanguageChange }: { language: Language; onLanguageChange: (next: Language) => void }) {
  return <RoutedErrorBoundary><Switch>
    <Route path="/admin/login"><AdminLogin language={language} onLanguageChange={onLanguageChange} /></Route>
    <Route path="/admin/properties/new"><AdminShell language={language} onLanguageChange={onLanguageChange}><AdminPropertyForm language={language} /></AdminShell></Route>
    <Route path="/admin/properties/:id"><AdminShell language={language} onLanguageChange={onLanguageChange}><AdminPropertyForm language={language} /></AdminShell></Route>
    <Route path="/admin/properties"><AdminShell language={language} onLanguageChange={onLanguageChange}><AdminProperties language={language} /></AdminShell></Route>
    <Route path="/admin/leads"><AdminShell language={language} onLanguageChange={onLanguageChange}><AdminLeads language={language} /></AdminShell></Route>
    <Route path="/admin/settings"><AdminShell language={language} onLanguageChange={onLanguageChange}><AdminSettings language={language} /></AdminShell></Route>
    <Route path="/admin"><AdminShell language={language} onLanguageChange={onLanguageChange}><AdminDashboard language={language} /></AdminShell></Route>
    <Route path="/properties/:id"><PropertyDetail language={language} onLanguageChange={onLanguageChange} /></Route>
    <Route path="/properties"><PropertiesPage language={language} onLanguageChange={onLanguageChange} /></Route>
    <Route path="/compare"><ComparePage language={language} onLanguageChange={onLanguageChange} /></Route>
    <Route path="/favorites"><FavoritesPage language={language} onLanguageChange={onLanguageChange} /></Route>
    <Route path="/about"><AboutPage language={language} onLanguageChange={onLanguageChange} /></Route>
    <Route path="/contact"><ContactPage language={language} onLanguageChange={onLanguageChange} /></Route>
    <Route path="/insights"><InsightsPage language={language} onLanguageChange={onLanguageChange} /></Route>
    <Route path="/"><Home language={language} onLanguageChange={onLanguageChange} /></Route>
    <Route component={NotFound} />
  </Switch><CompareBar language={language} /></RoutedErrorBoundary>;
}

function App() {
  const [language, setLanguage] = useState<Language>(() => (localStorage.getItem('alhuda-language') as Language) || 'ar');
  useEffect(() => { document.documentElement.lang = language; document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr'; localStorage.setItem('alhuda-language', language); }, [language]);
  return <QueryClientProvider client={queryClient}><FavoritesProvider><CompareProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><Router language={language} onLanguageChange={setLanguage} /></WouterRouter></CompareProvider></FavoritesProvider></QueryClientProvider>;
}

export default App;
import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export type Language = 'en' | 'fr' | 'ar' | 'es';

interface Translations {
  [key: string]: string;
}

const translations: Record<Language, Translations> = {
  en: {
    'nav.home': 'Home',
    'nav.documents': 'Documents',
    'nav.search': 'Search',
    'nav.pricing': 'Pricing',
    'nav.resources': 'Resources',
    'nav.login': 'Sign In',
    'nav.trial': 'Start Free Trial',
    'hero.title': 'Build Intelligent Reference Guides',
    'hero.subtitle': 'The enterprise knowledge platform that helps teams find answers instantly.',
    'cta.start_trial': 'Start Free Trial',
    'cta.book_demo': 'Book a Demo',
    'cta.learn_more': 'Learn More',
    'cta.get_started': 'Get Started',
    'common.loading': 'Loading...',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.search': 'Search...',
    'common.no_results': 'No results found',
    'common.back': 'Back',
    'footer.product': 'Product',
    'footer.solutions': 'Solutions',
    'footer.company': 'Company',
    'footer.legal': 'Legal',
    'pricing.starter': 'Starter',
    'pricing.professional': 'Professional',
    'pricing.enterprise': 'Enterprise',
    'pricing.per_month': '/month',
    'pricing.annual_discount': 'Save 20% annually',
    'trial.days_remaining': 'days remaining',
    'trial.expired': 'Trial expired',
    'trial.upgrade': 'Upgrade now',
  },
  fr: {
    'nav.home': 'Accueil',
    'nav.documents': 'Documents',
    'nav.search': 'Rechercher',
    'nav.pricing': 'Tarifs',
    'nav.resources': 'Ressources',
    'nav.login': 'Connexion',
    'nav.trial': 'Essai Gratuit',
    'hero.title': 'Créez des Guides de Référence Intelligents',
    'hero.subtitle': 'La plateforme de connaissances d\'entreprise qui aide les équipes à trouver des réponses instantanément.',
    'cta.start_trial': 'Démarrer l\'Essai Gratuit',
    'cta.book_demo': 'Réserver une Démo',
    'cta.learn_more': 'En Savoir Plus',
    'cta.get_started': 'Commencer',
    'common.loading': 'Chargement...',
    'common.save': 'Enregistrer',
    'common.cancel': 'Annuler',
    'common.delete': 'Supprimer',
    'common.edit': 'Modifier',
    'common.search': 'Rechercher...',
    'common.no_results': 'Aucun résultat trouvé',
    'common.back': 'Retour',
    'footer.product': 'Produit',
    'footer.solutions': 'Solutions',
    'footer.company': 'Entreprise',
    'footer.legal': 'Mentions Légales',
    'pricing.starter': 'Débutant',
    'pricing.professional': 'Professionnel',
    'pricing.enterprise': 'Entreprise',
    'pricing.per_month': '/mois',
    'pricing.annual_discount': 'Économisez 20% annuellement',
    'trial.days_remaining': 'jours restants',
    'trial.expired': 'Essai expiré',
    'trial.upgrade': 'Mettre à niveau',
  },
  ar: {
    'nav.home': 'الرئيسية',
    'nav.documents': 'المستندات',
    'nav.search': 'بحث',
    'nav.pricing': 'الأسعار',
    'nav.resources': 'الموارد',
    'nav.login': 'تسجيل الدخول',
    'nav.trial': 'تجربة مجانية',
    'hero.title': 'أنشئ أدلة مرجعية ذكية',
    'hero.subtitle': 'منصة المعرفة المؤسسية التي تساعد الفرق في العثور على الإجابات فوراً.',
    'cta.start_trial': 'ابدأ التجربة المجانية',
    'cta.book_demo': 'احجز عرضاً توضيحياً',
    'cta.learn_more': 'اعرف المزيد',
    'cta.get_started': 'ابدأ الآن',
    'common.loading': 'جاري التحميل...',
    'common.save': 'حفظ',
    'common.cancel': 'إلغاء',
    'common.delete': 'حذف',
    'common.edit': 'تعديل',
    'common.search': 'بحث...',
    'common.no_results': 'لم يتم العثور على نتائج',
    'common.back': 'رجوع',
    'footer.product': 'المنتج',
    'footer.solutions': 'الحلول',
    'footer.company': 'الشركة',
    'footer.legal': 'قانوني',
    'pricing.starter': 'المبتدئ',
    'pricing.professional': 'المحترف',
    'pricing.enterprise': 'المؤسسات',
    'pricing.per_month': '/شهر',
    'pricing.annual_discount': 'وفر 20% سنوياً',
    'trial.days_remaining': 'أيام متبقية',
    'trial.expired': 'انتهت التجربة',
    'trial.upgrade': 'ترقية الآن',
  },
  es: {
    'nav.home': 'Inicio',
    'nav.documents': 'Documentos',
    'nav.search': 'Buscar',
    'nav.pricing': 'Precios',
    'nav.resources': 'Recursos',
    'nav.login': 'Iniciar Sesión',
    'nav.trial': 'Prueba Gratis',
    'hero.title': 'Crea Guías de Referencia Inteligentes',
    'hero.subtitle': 'La plataforma de conocimiento empresarial que ayuda a los equipos a encontrar respuestas al instante.',
    'cta.start_trial': 'Iniciar Prueba Gratis',
    'cta.book_demo': 'Reservar Demo',
    'cta.learn_more': 'Más Información',
    'cta.get_started': 'Empezar',
    'common.loading': 'Cargando...',
    'common.save': 'Guardar',
    'common.cancel': 'Cancelar',
    'common.delete': 'Eliminar',
    'common.edit': 'Editar',
    'common.search': 'Buscar...',
    'common.no_results': 'No se encontraron resultados',
    'common.back': 'Volver',
    'footer.product': 'Producto',
    'footer.solutions': 'Soluciones',
    'footer.company': 'Empresa',
    'footer.legal': 'Legal',
    'pricing.starter': 'Inicial',
    'pricing.professional': 'Profesional',
    'pricing.enterprise': 'Empresarial',
    'pricing.per_month': '/mes',
    'pricing.annual_discount': 'Ahorra 20% anualmente',
    'trial.days_remaining': 'días restantes',
    'trial.expired': 'Prueba expirada',
    'trial.upgrade': 'Actualizar ahora',
  },
};

const LANGUAGE_NAMES: Record<Language, string> = {
  en: 'English',
  fr: 'Français',
  ar: 'العربية',
  es: 'Español',
};

const RTL_LANGUAGES: Language[] = ['ar'];

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isRTL: boolean;
  languages: { code: Language; name: string }[];
}

const I18nContext = createContext<I18nContextType | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const stored = localStorage.getItem('preferred_language');
    return (stored as Language) || 'en';
  });

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('preferred_language', lang);
    document.documentElement.dir = RTL_LANGUAGES.includes(lang) ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, []);

  const t = useCallback((key: string): string => {
    return translations[language]?.[key] || translations.en[key] || key;
  }, [language]);

  const isRTL = RTL_LANGUAGES.includes(language);

  const languages = Object.entries(LANGUAGE_NAMES).map(([code, name]) => ({
    code: code as Language,
    name,
  }));

  return (
    <I18nContext.Provider value={{ language, setLanguage, t, isRTL, languages }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}

export function LanguageSwitcher() {
  const { language, setLanguage, languages } = useI18n();

  return (
    <select
      value={language}
      onChange={e => setLanguage(e.target.value as Language)}
      className="px-2 py-1 rounded bg-card border border-border text-sm cursor-pointer"
    >
      {languages.map(lang => (
        <option key={lang.code} value={lang.code}>
          {lang.name}
        </option>
      ))}
    </select>
  );
}

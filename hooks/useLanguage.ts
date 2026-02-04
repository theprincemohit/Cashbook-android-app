/**
 * Deprecated: Use useLanguageContext from @/context/LanguageContext instead.
 * This hook is kept for backward compatibility but should be replaced with:
 * const { t } = useLanguageContext();
 */

import { useLanguageContext } from '@/context/LanguageContext';

// Kept for backward compatibility - redirects to new context
export const useTranslation = () => {
  const { t } = useLanguageContext();
  return { t };
};

// New hook for backward compatibility with existing code
export const useLanguage = () => {
  const { language, setLanguage, t } = useLanguageContext();
  return { language, setLanguage, t };
};

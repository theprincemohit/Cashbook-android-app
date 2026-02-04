import { englishTranslations } from './en';
import { hindiTranslations } from './hi';

export type Language = 'en' | 'hi';

export const translations: Record<Language, typeof englishTranslations> = {
  en: englishTranslations,
  hi: hindiTranslations,
};

export type TranslationKey = keyof typeof englishTranslations;

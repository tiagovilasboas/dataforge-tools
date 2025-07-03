import { useTranslation } from 'react-i18next';
import { useCallback } from 'react';

export function useLanguage() {
  const { i18n, t } = useTranslation();

  const changeLanguage = useCallback((language: string) => {
    i18n.changeLanguage(language);
    localStorage.setItem('i18nextLng', language);
  }, [i18n]);

  const currentLanguage = i18n.language;

  const availableLanguages = [
    { code: 'en', name: t('languages.en') },
    { code: 'pt', name: t('languages.pt') }
  ];

  return {
    currentLanguage,
    changeLanguage,
    availableLanguages,
    t
  };
} 
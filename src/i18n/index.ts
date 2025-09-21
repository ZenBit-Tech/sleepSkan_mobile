import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import { TOptions } from 'i18next'

import en from './locales/en'
import pt from './locales/pt'


const DEFAULT_LANG = 'pt'

const detectLang = async (
  cb: (lng: string | readonly string[] | undefined) => void,
) => {
  cb(DEFAULT_LANG)
}

export default i18next
  .use({
    type: 'languageDetector',
    async: true,
    detect: detectLang,
    init: () => {},
    cacheUserLanguage: () => {},
  })
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v3',
    fallbackLng: DEFAULT_LANG,
    debug: false,
    resources: {
      en: {
        ...en,
      },
      pt: {
        ...pt,
      },
    },
  })

type DefaultLocale = typeof pt.translation
export type TxKeyPath = RecursiveKeyOf<DefaultLocale>

type RecursiveKeyOf<TObj extends Record<string, any>> = {
  [TKey in keyof TObj & string]: TObj[TKey] extends Record<string, any>
    ? `${TKey}` | `${TKey}.${RecursiveKeyOf<TObj[TKey]>}`
    : `${TKey}`
}[keyof TObj & string]

declare module 'i18next' {
  // Extend the TFunction interface
  interface TFunction {
    (key: TxKeyPath, options?: TOptions | string): string
    <TResult>(key: TxKeyPath, options?: TOptions | string): TResult
  }
}

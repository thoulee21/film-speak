import i18next, { type ModuleType } from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as RNLocalize from 'react-native-localize';
import { MMKV } from 'react-native-mmkv';

import pkgData from '@/package.json';
import enUS from '@/src/i18n/resources/en-US.json';
import zhCN from '@/src/i18n/resources/zh-CN.json';
import zhTW from '@/src/i18n/resources/zh-TW.json';
import { LanguageCode } from '@/src/i18n/types';

export const storage = new MMKV();

const LANGUAGE_STORAGE_KEY = `@${pkgData.name}/language`;

export const resources = {
  [LanguageCode.EN_US]: { translation: enUS },
  [LanguageCode.ZH_CN]: { translation: zhCN },
  [LanguageCode.ZH_TW]: { translation: zhTW },
};

// 保存语言设置到本地存储
export const saveLanguage = (language: LanguageCode) => {
  storage.set(LANGUAGE_STORAGE_KEY, language);
};

// 从本地存储获取语言设置
export const getLanguage = (): LanguageCode => {
  const language = storage.getString(LANGUAGE_STORAGE_KEY);

  if (
    language && Object.values(LanguageCode)
      .includes(language as LanguageCode)
  ) {
    if (language === LanguageCode.SYSTEM) {
      return getSystemLanguage();
    }
    return language as LanguageCode;
  }

  return LanguageCode.EN_US;
};

const getSystemLanguage = (): LanguageCode => {
  const deviceLanguages = RNLocalize.getLocales();

  if (deviceLanguages.length > 0) {
    const deviceLanguage = deviceLanguages[0].languageCode;

    if (deviceLanguage === 'zh') {
      const countryCode = deviceLanguages[0].countryCode;
      if (countryCode === 'TW' || countryCode === 'HK') {
        return LanguageCode.ZH_TW;
      }
      return LanguageCode.ZH_CN;
    } else if (deviceLanguage === 'en') {
      return LanguageCode.EN_US;
    }
  }

  return LanguageCode.EN_US;
};

const languageDetector = {
  type: 'languageDetector' as ModuleType,
  async: true,
  detect: function (callback: (arg0: string) => void) {
    // 获取上次选择的语言
    const lng = storage.getString(LANGUAGE_STORAGE_KEY);

    // 如果是跟随本地，则获取系统语言
    if (lng === LanguageCode.SYSTEM) {
      callback(getSystemLanguage());
    } else {
      callback(lng || LanguageCode.EN_US);
    }
  },
  cacheUserLanguage: function (language: string) {
    storage.set(LANGUAGE_STORAGE_KEY, language);
  },
};

// 初始化 i18next
i18next
  .use(initReactI18next)
  .use(languageDetector)
  .init({
    compatibilityJSON: 'v3',
    resources,
    lng: getLanguage(),
    fallbackLng: LanguageCode.EN_US,
    interpolation: {
      escapeValue: false,
    },
  });

export default i18next;

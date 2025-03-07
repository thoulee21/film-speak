import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as RNLocalize from 'react-native-localize';
import { MMKV } from 'react-native-mmkv';

import pkgData from '@/package.json';
import enUS from '@/src/i18n/resources/en-US.json';
import zhCN from '@/src/i18n/resources/zh-CN.json';
import zhTW from '@/src/i18n/resources/zh-TW.json';
import { LanguageCode } from '@/src/i18n/types';

// 使用已有的 MMKV 实例存储语言设置
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

  if (language && Object.values(LanguageCode).includes(language as LanguageCode)) {
    return language as LanguageCode;
  }

  // 如果没有存储的语言设置，则使用设备语言
  const deviceLanguages = RNLocalize.getLocales();

  if (deviceLanguages.length > 0) {
    const deviceLanguage = deviceLanguages[0].languageCode;

    if (deviceLanguage === 'zh') {
      // 针对中文，检查是简体(CN)还是繁体(TW, HK)
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

// 初始化 i18next
i18next
  .use(initReactI18next)
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

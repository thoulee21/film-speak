export enum LanguageCode {
  EN_US = 'en-US',
  ZH_CN = 'zh-CN',
  ZH_TW = 'zh-TW',
}

export interface TranslationNamespace {
  translation: {
    [key: string]: string | TranslationNamespace;
  };
}

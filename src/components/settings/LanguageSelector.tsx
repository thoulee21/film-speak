import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, View } from 'react-native';
import { List, RadioButton, useTheme } from 'react-native-paper';

import { saveLanguage } from '@/src/i18n';
import { LanguageCode } from '@/src/i18n/types';
import type ListLRProps from '@/src/types/paperListItem';
import haptics from '@/src/utils/haptics';

const LanguageSelector = () => {
  const { i18n } = useTranslation();
  const appTheme = useTheme();

  const currentLanguage = i18n.language;

  const handleLanguageChange = useCallback((language: LanguageCode) => {
    haptics.light();
    i18n.changeLanguage(language);
    saveLanguage(language);
  }, [i18n]);

  const renderRadio = useCallback(({ color, lang }: {
    color: string, lang: LanguageCode
  }) => (
    <View pointerEvents='none'>
      <RadioButton
        value={lang}
        status={currentLanguage === lang ? "checked" : "unchecked"}
        color={appTheme.colors.primary}
        uncheckedColor={color}
      />
    </View>
  ), [appTheme.colors.primary, currentLanguage]);

  return (
    <FlatList
      data={[
        {
          title: '跟随系统',
          description: 'Follow system',
          onPress: () => handleLanguageChange(LanguageCode.SYSTEM),
          right: (props: ListLRProps) => renderRadio({
            ...props,
            lang: LanguageCode.SYSTEM
          })
        },
        {
          title: 'English',
          description: 'English',
          onPress: () => handleLanguageChange(LanguageCode.EN_US),
          right: (props: ListLRProps) => renderRadio({
            ...props,
            lang: LanguageCode.EN_US
          })
        },
        {
          title: '简体中文',
          description: 'Simplified Chinese',
          onPress: () => handleLanguageChange(LanguageCode.ZH_CN),
          right: (props: ListLRProps) => renderRadio({
            ...props,
            lang: LanguageCode.ZH_CN
          })
        },
        {
          title: '繁體中文',
          description: 'Traditional Chinese',
          onPress: () => handleLanguageChange(LanguageCode.ZH_TW),
          right: (props: ListLRProps) => renderRadio({
            ...props,
            lang: LanguageCode.ZH_TW
          })
        }
      ]}
      renderItem={({ item }) => (
        <List.Item
          title={item.title}
          description={item.description}
          onPress={item.onPress}
          right={item.right}
        />
      )}
      keyExtractor={item => item.title}
    />
  );
};

export default LanguageSelector;

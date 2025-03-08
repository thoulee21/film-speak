import { Stack } from "expo-router";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, View } from "react-native";
import { Divider, List, RadioButton, useTheme } from "react-native-paper";

import { LanguageCode } from "@/src/i18n/types";
import haptics from "@/src/utils/haptics";

const LANGS = [
  {
    title: 'English',
    languageCode: LanguageCode.EN_US,
  },
  {
    title: '简体中文',
    languageCode: LanguageCode.ZH_CN,
  },
  {
    title: '繁體中文',
    languageCode: LanguageCode.ZH_TW,
  }
];

export default function LangScreen() {
  const { t, i18n } = useTranslation();
  const appTheme = useTheme();

  const currentLanguage = i18n.language;

  const handleLanguageChange = useCallback((language: LanguageCode) => {
    haptics.light();
    i18n.changeLanguage(language);
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
    <>
      <Stack.Screen options={{ title: t('settings.language') }} />

      <FlatList
        data={LANGS}
        renderItem={({ item }) => (
          <List.Item
            title={item.title}
            onPress={() => {
              handleLanguageChange(item.languageCode);
            }}
            right={(props) => renderRadio({
              ...props,
              lang: item.languageCode
            })}
          />
        )}
        keyExtractor={item => item.title}
        ItemSeparatorComponent={() => (
          <Divider horizontalInset />
        )}
      />
    </>
  );
}
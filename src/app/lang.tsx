import { Stack } from "expo-router";
import { useTranslation } from "react-i18next";

import LanguageSelector from "@/src/components/settings/LanguageSelector";

export default function LangScreen() {
  const { t } = useTranslation();

  return (
    <>
      <Stack.Screen options={{
        title: t('settings.languageSelect')
      }} />

      <LanguageSelector />
    </>
  );
}
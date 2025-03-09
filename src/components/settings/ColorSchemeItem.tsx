import React, { useCallback } from "react"
import { Appearance } from "react-native"
import { IconButton, List } from "react-native-paper"

import { useColorScheme } from "@/src/hooks/useColorScheme"

export default function ColorSchemeItem() {
  const colorScheme = useColorScheme()

  const toggleColorScheme = useCallback(() => {
    Appearance.setColorScheme(colorScheme === "dark" ? "light" : "dark")
  }, [colorScheme])

  return (
    <List.Item
      title="Color Scheme"
      description="Manually toggle between light and dark, overrides the system setting"
      left={(props) => (
        <List.Icon {...props} icon="palette-outline" />
      )}
      right={(props) => (
        <IconButton
          {...props}
          mode="contained"
          icon={colorScheme === "dark" ? "brightness-4" : "brightness-7"}
          onPress={toggleColorScheme}
        />
      )}
      onPress={toggleColorScheme}
    />
  );
}
import React, { useCallback } from "react"
import { Appearance, View } from "react-native"
import { Avatar, IconButton, List } from "react-native-paper"

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
      left={({ style }) => (
        <Avatar.Icon
          style={[style, { backgroundColor: "brown" }]}
          size={40}
          icon="palette"
        />
      )}
      right={(props) => (
        <View pointerEvents="none" style={props.style}>
          <IconButton
            {...props}
            mode="contained"
            icon={colorScheme === "dark" ? "brightness-4" : "brightness-7"}
          />
        </View>
      )}
      onPress={toggleColorScheme}
    />
  );
}
import { router } from "expo-router"
import { useCallback, useState } from "react"
import { List, TextInput, useTheme } from "react-native-paper"

import type ListLRProps from "@/src/types/paperListItem"

export default function RouteItem() {
  const appTheme = useTheme()
  const [route, setRoute] = useState("")

  const renderNaviIcon = useCallback((props: ListLRProps) => (
    <List.Icon {...props} icon="navigation-outline" />
  ), [])

  const goRoute = useCallback(() => {
    router.navigate(route as any)
  }, [route])

  const renderRouteInput = useCallback((props: any) => (
    <TextInput
      {...props}
      mode="flat"
      style={{ backgroundColor: "transparent" }}
      contentStyle={{ paddingLeft: 0, paddingRight: 0 }}
      dense
      placeholder="Go anywhere"
      value={route}
      onChangeText={setRoute}
      onSubmitEditing={goRoute}
      submitBehavior="blurAndSubmit"

      right={
        <TextInput.Icon
          icon="arrow-right"
          color={appTheme.colors.primary}
          onPress={goRoute}
        />
      }
    />
  ), [appTheme.colors.primary, goRoute, route])

  return (
    <List.Item
      title="Route"
      left={renderNaviIcon}
      description={renderRouteInput}
    />
  )
}
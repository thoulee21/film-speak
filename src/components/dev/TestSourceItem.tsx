import { useCallback, useState } from "react"
import { ToastAndroid } from "react-native"
import HapticFeedback, {
  HapticFeedbackTypes,
} from "react-native-haptic-feedback"
import { List, TextInput, useTheme } from "react-native-paper"

import { useAppDispatch } from "@/src/hooks/redux"
import { setVideoSource } from "@/src/redux/slices/videoSource"
import type ListLRProps from "@/src/types/paperListItem"
import { router } from "expo-router"

export default function TestSourceItem() {
  const dispatch = useAppDispatch()
  const appTheme = useTheme()

  const [showSource, setShowSource] = useState('')

  const renderSourceIcon = useCallback((props: ListLRProps) => (
    <List.Icon {...props} icon="video-outline" />
  ), [])

  const commitSource = useCallback(() => {
    if (!showSource) { return; }

    HapticFeedback.trigger(HapticFeedbackTypes.effectClick)
    dispatch(setVideoSource(showSource))
    router.push("/")
    ToastAndroid.show(
      "Video source set",
      ToastAndroid.SHORT
    )
  }, [dispatch, showSource])

  const renderInput = useCallback((props: any) => (
    <TextInput
      {...props}
      mode="flat"
      style={{ backgroundColor: "transparent" }}
      contentStyle={{ paddingLeft: 0, paddingRight: 0 }}
      dense
      placeholder="https://example.com/video.mp4"
      numberOfLines={1}
      value={showSource}
      onChangeText={setShowSource}
      onSubmitEditing={commitSource}
      submitBehavior="blurAndSubmit"
      returnKeyType="done"
      selectTextOnFocus
      keyboardType="url"
      textContentType="URL"
      dataDetectorTypes="link"
      right={
        <TextInput.Icon
          icon="check"
          color={appTheme.colors.primary}
          onPress={commitSource}
        />
      }
    />
  ), [appTheme.colors.primary, commitSource, showSource])

  return (
    <List.Item
      title="Test Video Source"
      left={renderSourceIcon}
      description={renderInput}
    />
  )
}
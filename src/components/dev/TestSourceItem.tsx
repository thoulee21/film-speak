import { useCallback, useState } from "react"
import { useTranslation } from "react-i18next"
import { ToastAndroid } from "react-native"
import { List, TextInput, useTheme } from "react-native-paper"

import { useAppDispatch } from "@/src/hooks/redux"
import { setVideoSource } from "@/src/store/slices/videoSource"
import type ListLRProps from "@/src/types/paperListItem"
import haptics from "@/src/utils/haptics"

export default function TestSourceItem() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch()
  const appTheme = useTheme()

  const [showSource, setShowSource] = useState('')

  const renderSourceIcon = useCallback((props: ListLRProps) => (
    <List.Icon {...props} icon="video-outline" />
  ), [])

  const commitSource = useCallback(() => {
    if (!showSource) { return; }

    dispatch(setVideoSource(showSource))
    ToastAndroid.show(
      t('settings.videoSource.set'), ToastAndroid.SHORT
    )
  }, [dispatch, showSource, t])

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
          onPress={() => {
            haptics.heavy()
            commitSource()
          }}
        />
      }
    />
  ), [appTheme.colors.primary, commitSource, showSource])

  return (
    <List.Item
      title={t('settings.videoSource.title')}
      left={renderSourceIcon}
      description={renderInput}
    />
  )
}
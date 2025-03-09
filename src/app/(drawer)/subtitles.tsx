import { useLocalSearchParams } from "expo-router";
import Drawer from "expo-router/drawer";
import { useCallback, useState } from "react";
import { useTranslation } from 'react-i18next';
import { Alert, StyleSheet, View, type ListRenderItemInfo } from "react-native";
import { Banner, FAB, Icon, IconButton, List, Portal, useTheme } from "react-native-paper";
import Reanimated, { LinearTransition } from 'react-native-reanimated';

import LottieAnimation from "@/src/components/LottieAnimation";
import SubtitleItem from "@/src/components/subtitles/item";
import { useAppSelector } from "@/src/hooks/redux";
import { useRemoveSubtitle } from "@/src/hooks/useRemoveSubtitle";
import useSelectFile from "@/src/hooks/useSelectFile";
import { selectSubtitles, type Subtitle } from "@/src/store/slices/subtitles";
import haptics from "@/src/utils/haptics";

export default function Subtitles() {
  const appTheme = useTheme();
  const { inform } = useLocalSearchParams();

  const { t } = useTranslation();
  const selectFile = useSelectFile();
  const removeSubtitle = useRemoveSubtitle();

  const subtitles = useAppSelector(selectSubtitles);
  const [cacheBannerVisible, setCacheBannerVisible] = useState(
    (subtitles.length > 1) && inform === 'true'
  );

  const renderItem = useCallback(({
    item
  }: ListRenderItemInfo<Subtitle>) => (
    <SubtitleItem item={item} />
  ), []);

  const onPressClear = useCallback(() => {
    haptics.warning();
    Alert.alert(
      'Clear subtitles',
      'Are you sure you want to clear all subtitles?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            subtitles.forEach((subtitle) => {
              removeSubtitle(subtitle);
            });
          }
        }
      ]
    );
  }, [removeSubtitle, subtitles]);

  return (
    <Portal.Host>
      <Drawer.Screen options={{
        headerRight: () => (
          <IconButton
            icon="delete-forever-outline"
            iconColor={appTheme.colors.error}
            disabled={subtitles.length === 0}
            onPress={onPressClear}
          />
        )
      }} />

      <View style={styles.root}>
        <Banner
          visible={cacheBannerVisible}
          icon={(props) => (
            <Icon
              {...props}
              source="information-outline"
              color={appTheme.colors.secondary}
            />
          )}
          actions={[{
            label: t('common.ok'),
            onPress: () => setCacheBannerVisible(false),
          }]}
        >
          {t('subtitle.removeHistory')}
        </Banner>

        <Reanimated.FlatList
          data={subtitles}
          renderItem={renderItem}
          contentContainerStyle={styles.items}
          overScrollMode="never"
          ListEmptyComponent={
            <LottieAnimation
              animation="teapot"
              caption={t('subtitle.noSubtitles')}
            />
          }
          itemLayoutAnimation={LinearTransition}
          keyExtractor={(item) => item.fileUri}
          ListFooterComponent={
            <View style={{
              height: 100,
              alignItems: 'center',
            }}>
              <List.Subheader>
                {subtitles.length} item(s) in total
              </List.Subheader>
            </View>
          }
        />
      </View>

      <Portal>
        <FAB
          style={{
            position: 'absolute',
            margin: 16,
            right: 0,
            bottom: 0,
          }}
          icon="plus"
          onPress={selectFile}
        />
      </Portal>
    </Portal.Host>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  items: {
    flexGrow: 1,
    marginHorizontal: 10,
    marginTop: 5,
  }
})

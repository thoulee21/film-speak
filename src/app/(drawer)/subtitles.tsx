import { useLocalSearchParams } from "expo-router";
import { useCallback, useState } from "react";
import { useTranslation } from 'react-i18next';
import { StyleSheet, View, type ListRenderItemInfo } from "react-native";
import { Banner, FAB, Icon, List, Portal, useTheme } from "react-native-paper";
import Reanimated, { LinearTransition } from 'react-native-reanimated';

import LottieAnimation from "@/src/components/LottieAnimation";
import SubtitleItem from "@/src/components/subtitles/item";
import { useAppSelector } from "@/src/hooks/redux";
import useSelectFile from "@/src/hooks/useSelectFile";
import { selectSubtitles, type Subtitle } from "@/src/store/slices/subtitles";

export default function Subtitles() {
  const appTheme = useTheme();
  const { inform } = useLocalSearchParams();

  const { t } = useTranslation();
  const selectFile = useSelectFile();

  const subtitles = useAppSelector(selectSubtitles);
  const [cacheBannerVisible, setCacheBannerVisible] = useState(
    (subtitles.length > 1) && inform === 'true'
  );

  const renderItem = useCallback(({
    item
  }: ListRenderItemInfo<Subtitle>) => (
    <SubtitleItem item={item} />
  ), []);

  return (
    <Portal.Host>
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

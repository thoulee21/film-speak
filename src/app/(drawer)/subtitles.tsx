import { useLocalSearchParams } from "expo-router";
import { useCallback, useState } from "react";
import { useTranslation } from 'react-i18next';
import { StyleSheet, View, type ListRenderItemInfo } from "react-native";
import { Banner, Icon, useTheme } from "react-native-paper";
import Reanimated, { LinearTransition } from 'react-native-reanimated';

import LottieAnimation from "@/src/components/LottieAnimation";
import SubtitleItem from "@/src/components/subtitles/item";
import SelectVideoButton from '@/src/components/video/SelectVideoButton';
import { useAppSelector } from "@/src/hooks/redux";
import { selectSubtitles, type Subtitle } from "@/src/store/slices/subtitles";

export default function Subtitles() {
  const appTheme = useTheme();
  const { t } = useTranslation();
  const { inform } = useLocalSearchParams();

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
        ListFooterComponent={
          <SelectVideoButton
            style={styles.selectBtn}
            mode={subtitles.length === 0 ? 'contained' : 'text'}
          />
        }
      />
    </View>
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
  },
  selectBtn: {
    marginTop: 10,
    marginBottom: 25,
  }
})

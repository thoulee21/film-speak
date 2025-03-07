import { useTranslation } from "react-i18next";
import { ScrollView, View } from "react-native";
import { Banner, Divider } from "react-native-paper";

import VolFactorSlider from "@/src/components/videoEnhance/VolFactorSlider";
import VolumeSlider from "@/src/components/videoEnhance/VolumeSlider";

export default function VideoEnhanceScreen() {
  const { t } = useTranslation();

  return (
    <View>
      <Banner visible>
        {t('videoEnhance.banner')}
      </Banner>

      <ScrollView>
        <VolFactorSlider />
        <Divider />
        <VolumeSlider />
      </ScrollView>
    </View>
  );
}

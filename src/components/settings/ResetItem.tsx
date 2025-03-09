import React from "react";
import { Alert } from "react-native";
import { List, useTheme } from "react-native-paper";
import RNRestart from "react-native-restart";

import haptics from "@/src/utils/haptics";
import { reduxStorage } from "@/src/utils/mmkvStorage";

export default function ResetItem() {
  const appTheme = useTheme();

  const handleReset = () => {
    haptics.warning();
    Alert.alert(
      '重置',
      '确定要重置所有设置吗？',
      [
        {
          text: '取消',
          style: 'cancel'
        },
        {
          text: '确定',
          onPress: () => {
            reduxStorage.clearAll();
            RNRestart.Restart();
          }
        }
      ]
    );
  };

  return (
    <List.Item
      title='重置'
      description='重置所有设置并重启应用'
      left={(props) => (
        <List.Icon {...props} icon='restore' />
      )}
      onPress={handleReset}
      titleStyle={{ color: appTheme.colors.error }}
    />
  );
}
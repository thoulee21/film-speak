import { MD3DarkTheme, MD3LightTheme } from "react-native-paper";

import darkBlueColors from "@/src/constants/theme/dark.json";
import lightBlueColors from "@/src/constants/theme/light.json";

const ColorTheme = {
  light: {
    ...MD3LightTheme,
    ...lightBlueColors,
  },
  dark: {
    ...MD3DarkTheme,
    ...darkBlueColors,
  }
}

export default ColorTheme;

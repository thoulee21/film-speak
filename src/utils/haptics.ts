import { Platform } from "react-native";
import HapticFeedback, {
  HapticFeedbackTypes,
} from "react-native-haptic-feedback";

interface Haptics {
  light: () => void;
  medium: () => void;
  heavy: () => void;
  success: () => void;
  warning: () => void;
  error: () => void;
  selection: () => void;
};

let haptics: Haptics;

if (Platform.OS !== 'web') {
  haptics = {
    light: () => HapticFeedback.trigger(HapticFeedbackTypes.effectClick),
    medium: () => HapticFeedback.trigger(HapticFeedbackTypes.effectDoubleClick),
    heavy: () => HapticFeedback.trigger(HapticFeedbackTypes.effectHeavyClick),
    success: () => HapticFeedback.trigger(HapticFeedbackTypes.notificationSuccess),
    warning: () => HapticFeedback.trigger(HapticFeedbackTypes.notificationWarning),
    error: () => HapticFeedback.trigger(HapticFeedbackTypes.notificationError),
    selection: () => HapticFeedback.trigger(HapticFeedbackTypes.selection),
  };
} else {
  haptics = {
    light: () => console.log("Light haptic feedback not available on web."),
    medium: () => console.log("Medium haptic feedback not available on web."),
    heavy: () => console.log("Heavy haptic feedback not available on web."),
    success: () => console.log("Success haptic feedback not available on web."),
    warning: () => console.log("Warning haptic feedback not available on web."),
    error: () => console.log("Error haptic feedback not available on web."),
    selection: () => console.log("Selection haptic feedback not available on web."),
  };
}

export default haptics;
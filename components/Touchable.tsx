import { Pressable, type ColorValue, type StyleProp, type ViewStyle } from "react-native";
import { TouchableRipple, type TouchableRippleProps } from "react-native-paper";
import type { BaseRoute } from "react-native-paper/lib/typescript/components/BottomNavigation/BottomNavigation";

type TouchableProps<Route extends BaseRoute> = TouchableRippleProps & {
  key: string;
  route: Route;
  children: React.ReactNode;
  borderless?: boolean;
  centered?: boolean;
  rippleColor?: ColorValue;
};

const Touchable = <Route extends BaseRoute>({
  route: _0,
  style,
  children,
  borderless,
  centered,
  rippleColor,
  ...rest
}: TouchableProps<Route>) =>
  TouchableRipple.supported ? (
    <TouchableRipple
      {...rest}
      disabled={rest.disabled || undefined}
      borderless={borderless}
      centered={centered}
      rippleColor={rippleColor}
      style={style}
    >
      {children}
    </TouchableRipple>
  ) : (
    <Pressable style={style as StyleProp<ViewStyle>} {...rest}>
      {children}
    </Pressable>
  );

export default Touchable;
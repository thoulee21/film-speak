import { Icon } from "react-native-paper";

export default function TabBarIcon(props: {
  name: React.ComponentProps<typeof Icon>['source'];
  color: string;
  size: number;
}) {
  return (
    <Icon
      source={props.name}
      {...props}
    />
  );
}
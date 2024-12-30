import { Link } from "expo-router";
import { View } from "react-native";
import { List } from "react-native-paper";

import DevSwitchItem from "@/src/components/dev/DevSwitchItem";

export default function DevScreen() {
  return (
    <View>
      <DevSwitchItem />

      <Link href="/modal" asChild>
        <List.Item
          title="Open Modal"
          left={(props) => <List.Icon {...props} icon="window-maximize" />}
          right={(props) => <List.Icon {...props} icon="chevron-right" />}
        />
      </Link>
    </View>
  );
}
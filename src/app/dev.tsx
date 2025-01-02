import { View } from "react-native";
import { List } from "react-native-paper";

import DevSwitchItem from "@/src/components/dev/DevSwitchItem";
import RouteItem from "@/src/components/dev/RouteItem";
import ViewAppDataItem from "@/src/components/dev/ViewAppDataItem";

export default function DevScreen() {
  return (
    <View>
      <DevSwitchItem />
      <List.Section title="Developer's view" >
        <ViewAppDataItem />
      </List.Section>

      <List.Section title="Tools">
        <RouteItem />
      </List.Section>
    </View>
  );
}
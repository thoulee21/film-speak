import { Link } from "expo-router";
import { useCallback } from "react";
import { View } from "react-native";
import { List } from "react-native-paper";

import DevSwitchItem from "@/src/components/dev/DevSwitchItem";
import RouteItem from "@/src/components/dev/RouteItem";
import type ListLRProps from "@/src/types/paperListItem";

export default function DevScreen() {
  const renderModalIcon = useCallback((props: ListLRProps) => (
    <List.Icon {...props} icon="window-maximize" />
  ), []);

  return (
    <View>
      <DevSwitchItem />

      <RouteItem />
      <Link href="/modal" asChild>
        <List.Item
          title="Open Modal"
          description="Open a modal for testing purposes"
          left={renderModalIcon}
        />
      </Link>
    </View>
  );
}
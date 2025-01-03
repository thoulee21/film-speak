import { Link } from "expo-router";
import { useCallback } from "react";
import { View } from "react-native";
import { List, useTheme } from "react-native-paper";

import DevSwitchItem from "@/src/components/dev/DevSwitchItem";
import RouteItem from "@/src/components/dev/RouteItem";
import ViewAppDataItem from "@/src/components/dev/ViewAppDataItem";
import type ListLRProps from "@/src/types/paperListItem";

export default function DevScreen() {
  const appTheme = useTheme();

  const renderRightIcon = useCallback((props: ListLRProps) => (
    <List.Icon {...props} icon="chevron-right" />
  ), []);

  const renderCacheIcon = useCallback((props: ListLRProps) => (
    <List.Icon {...props} icon="folder-outline" />
  ), []);

  return (
    <View>
      <DevSwitchItem />
      <List.Section
        title="Developer's view"
        titleStyle={{ color: appTheme.colors.primary }}
      >
        <ViewAppDataItem />

        <Link href="/dev/cache" asChild>
          <List.Item
            title="Cache"
            description="View cached files"
            left={renderCacheIcon}
            right={renderRightIcon}
          />
        </Link>
      </List.Section>

      <List.Section
        title="Tools"
        titleStyle={{ color: appTheme.colors.primary }}
      >
        <RouteItem />
      </List.Section>
    </View>
  );
}
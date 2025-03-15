import { Link } from "expo-router";
import { useCallback } from "react";
import { ScrollView } from "react-native";
import { Divider, List, useTheme } from "react-native-paper";

import DevSwitchItem from "@/src/components/dev/DevSwitchItem";
import RouteItem from "@/src/components/dev/RouteItem";
import TestSourceItem from "@/src/components/dev/TestSourceItem";
import ResetItem from "@/src/components/settings/ResetItem";
import type ListLRProps from "@/src/types/paperListItem";

export default function DevScreen() {
  const appTheme = useTheme();

  const renderRightIcon = useCallback((props: ListLRProps) => (
    <List.Icon {...props} icon="chevron-right" />
  ), []);

  const renderCacheIcon = useCallback((props: ListLRProps) => (
    <List.Icon {...props} icon="folder-outline" />
  ), []);

  const renderDataBaseIcon = useCallback((props: ListLRProps) => (
    <List.Icon {...props} icon="database-cog-outline" />
  ), []);

  const renderLogcatIcon = useCallback((props: ListLRProps) => (
    <List.Icon {...props} icon="folder-eye-outline" />
  ), []);

  const renderAniIcon = useCallback((props: ListLRProps) => (
    <List.Icon {...props} icon="animation-outline" />
  ), []);

  return (
    <ScrollView>
      <DevSwitchItem />
      <Divider />

      <List.Section
        title="Developer's view"
        titleStyle={{ color: appTheme.colors.primary }}
      >
        <Link href="/dev/appdata" asChild>
          <List.Item
            title="View App Data"
            description="View the data that related to the app"
            left={renderDataBaseIcon}
            right={renderRightIcon}
          />
        </Link>

        <Link href="/dev/cache" asChild>
          <List.Item
            title="Cache"
            description="View files and directories that are under the cache directory"
            left={renderCacheIcon}
            right={renderRightIcon}
          />
        </Link>

        <Link href="/dev/logcat" asChild>
          <List.Item
            title="Logcat"
            description="View app logs"
            left={renderLogcatIcon}
            right={renderRightIcon}
          />
        </Link>

        <Link href="/dev/aniGallery" asChild>
          <List.Item
            title="Animation Gallery"
            description="View the animations that are used in the app"
            left={renderAniIcon}
            right={renderRightIcon}
          />
        </Link>
        <Divider />
      </List.Section>

      <List.Section
        title="Tools"
        titleStyle={{ color: appTheme.colors.primary }}
      >
        <TestSourceItem />
        <RouteItem />
        <ResetItem />
      </List.Section>
    </ScrollView>
  );
}
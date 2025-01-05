import { Link } from "expo-router";
import { useCallback } from "react";
import { ScrollView } from "react-native";
import { Divider, List, useTheme } from "react-native-paper";

import DevSwitchItem from "@/src/components/dev/DevSwitchItem";
import RouteItem from "@/src/components/dev/RouteItem";
import TestSourceItem from "@/src/components/dev/TestSourceItem";
import ExternalLink from "@/src/components/ExternalLink";
import type ListLRProps from "@/src/types/paperListItem";

const EXPO_DOCS_URL = "https://docs.expo.dev";

export default function DevScreen() {
  const appTheme = useTheme();

  const renderRightIcon = useCallback((props: ListLRProps) => (
    <List.Icon {...props} icon="chevron-right" />
  ), []);

  const renderOpenInBrowserIcon = useCallback((props: ListLRProps) => (
    <List.Icon {...props} icon="open-in-new" />
  ), []);

  const renderCacheIcon = useCallback((props: ListLRProps) => (
    <List.Icon {...props} icon="folder-outline" />
  ), []);

  const renderDocumentIcon = useCallback((props: ListLRProps) => (
    <List.Icon {...props} icon="file-document-outline" />
  ), []);

  const renderDataBaseIcon = useCallback((props: ListLRProps) => (
    <List.Icon {...props} icon="database-cog-outline" />
  ), []);

  const renderLogcatIcon = useCallback((props: ListLRProps) => (
    <List.Icon icon="folder-eye-outline" {...props} />
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
            description="View the log file"
            left={renderLogcatIcon}
            right={renderRightIcon}
          />
        </Link>

        <ExternalLink href={EXPO_DOCS_URL}>
          <List.Item
            title="Read the Expo documentation"
            description={EXPO_DOCS_URL}
            left={renderDocumentIcon}
            right={renderOpenInBrowserIcon}
          />
        </ExternalLink>

        <Divider />
      </List.Section>

      <List.Section
        title="Tools"
        titleStyle={{ color: appTheme.colors.primary }}
      >
        <RouteItem />
        <TestSourceItem />
      </List.Section>
    </ScrollView>
  );
}
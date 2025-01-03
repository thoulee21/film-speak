import { Link } from "expo-router";
import { useCallback } from "react";
import { View } from "react-native";
import { List, useTheme } from "react-native-paper";

import DevSwitchItem from "@/src/components/dev/DevSwitchItem";
import RouteItem from "@/src/components/dev/RouteItem";
import ExternalLink from "@/src/components/ExternalLink";
import type ListLRProps from "@/src/types/paperListItem";

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

  return (
    <View>
      <DevSwitchItem />
      <List.Section
        title="Tools"
        titleStyle={{ color: appTheme.colors.primary }}
      >
        <RouteItem />
      </List.Section>

      <List.Section
        title="Developer's view"
        titleStyle={{ color: appTheme.colors.primary }}
      >
        <Link
          //@ts-expect-error
          href="/appdata" asChild
        >
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
            description="View cached files"
            left={renderCacheIcon}
            right={renderRightIcon}
          />
        </Link>

        <ExternalLink href="https://docs.expo.dev">
          <List.Item
            title="Read the Expo documentation"
            description="https://docs.expo.dev"
            left={renderDocumentIcon}
            right={renderOpenInBrowserIcon}
          />
        </ExternalLink>
      </List.Section>
    </View>
  );
}
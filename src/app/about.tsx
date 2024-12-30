import { useCallback } from "react";
import { View } from "react-native";
import { List } from "react-native-paper";

import ExternalLink from "@/src/components/ExternalLink";
import VersionItem from "@/src/components/VersionItem";
import type ListLRProps from "@/src/types/paperListItem";

export default function AboutScreen() {
  const renderDocumentIcon = useCallback((props: ListLRProps) => (
    <List.Icon {...props} icon="file-document-outline" />
  ), []);

  return (
    <View>
      <VersionItem />

      <ExternalLink href="https://docs.expo.dev">
        <List.Item
          title="Read the Expo documentation"
          left={renderDocumentIcon}
          description="https://docs.expo.dev"
        />
      </ExternalLink>
    </View>
  );
}
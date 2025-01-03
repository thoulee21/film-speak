import { View } from "react-native";
import { Divider } from "react-native-paper";

import ContactMe from "@/src/components/about/ContactMe";
import CopyrightItem from "@/src/components/about/Copyright";
import UpdateChecker from "@/src/components/about/UpdateChecker";
import VersionItem from "@/src/components/about/VersionItem";

export default function AboutScreen() {
  return (
    <View>
      <VersionItem />
      <UpdateChecker />
      <Divider />

      <ContactMe />
      <CopyrightItem />
    </View>
  );
}
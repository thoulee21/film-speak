import { View } from "react-native";

import ContactMe from "@/src/components/about/ContactMe";
import CopyrightItem from "@/src/components/about/Copyright";
import VersionItem from "@/src/components/about/VersionItem";
import UpdateChecker from "@/src/components/settings/UpdateChecker";

export default function AboutScreen() {
  return (
    <View>
      <VersionItem />
      <UpdateChecker />

      <ContactMe />
      <CopyrightItem />
    </View>
  );
}
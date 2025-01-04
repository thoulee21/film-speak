import { ScrollView } from "react-native";
import { Divider } from "react-native-paper";

import ContactMe from "@/src/components/about/ContactMe";
import CopyrightItem from "@/src/components/about/Copyright";
import PoweredBy from "@/src/components/about/PoweredBy";
import UpdateChecker from "@/src/components/about/UpdateChecker";
import VersionItem from "@/src/components/about/VersionItem";

export default function AboutScreen() {
  return (
    <ScrollView>
      <VersionItem />
      <UpdateChecker />
      <Divider />

      <ContactMe />
      <CopyrightItem />
      <PoweredBy caption="Powered by Microsoft Cognitive Services" />
    </ScrollView>
  );
}
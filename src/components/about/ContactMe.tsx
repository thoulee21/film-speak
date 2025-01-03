import React, { useCallback } from 'react';
import { Linking } from 'react-native';
import { List, useTheme } from 'react-native-paper';

import packageData from '@/package.json';

const ContactMe = () => {
  const appTheme = useTheme();

  const OpenIcon = useCallback((props: any) => (
    <List.Icon {...props} icon="open-in-new" />
  ), []);

  const EmailIcon = useCallback((props: any) => (
    <List.Icon {...props} icon="email-outline" />
  ), []);

  return (
    <List.Section
      title="Contact Me"
      titleStyle={{ color: appTheme.colors.primary }}
    >
      <List.Item
        title="Email"
        description={packageData.author.email}
        onPress={() => {
          Linking.openURL(
            `mailto:${packageData.author.email}`
          );
        }}
        left={EmailIcon}
        right={OpenIcon}
      />
    </List.Section>
  );
};

export default ContactMe;

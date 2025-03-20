import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Linking } from 'react-native';
import { Avatar, IconButton, List, useTheme } from 'react-native-paper';

import packageData from '@/package.json';
import type ListLRProps from '@/src/types/paperListItem';
import haptics from '@/src/utils/haptics';

const ContactMe = () => {
  const { t } = useTranslation();
  const appTheme = useTheme();

  const openEmail = useCallback(async () => {
    haptics.heavy();
    await Linking.openURL(
      `mailto:${packageData.author.email}`
    );
  }, []);

  const renderOpenIcon = useCallback((props: ListLRProps) => (
    <IconButton {...props} icon="open-in-new" onPress={openEmail} />
  ), [openEmail]);

  const renderEmailIcon = useCallback(({ style }: ListLRProps) => (
    <Avatar.Icon
      style={[style, { backgroundColor: 'royalblue' }]}
      size={40}
      icon="email-outline"
    />
  ), []);

  return (
    <List.Section
      title={t('about.contactMe')}
      titleStyle={{ color: appTheme.colors.primary }}
    >
      <List.Item
        title="Email"
        description={packageData.author.email}
        left={renderEmailIcon}
        right={renderOpenIcon}
      />
    </List.Section>
  );
};

export default ContactMe;

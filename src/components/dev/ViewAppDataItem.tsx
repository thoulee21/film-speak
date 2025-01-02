import { Link } from 'expo-router';
import React, { useCallback } from 'react';
import { List } from 'react-native-paper';

import type ListLRProps from '@/src/types/paperListItem';

const ViewAppDataItem = () => {
  const renderDataBaseIcon = useCallback((props: ListLRProps) => (
    <List.Icon {...props} icon="database-cog-outline" />
  ), []);

  const renderChevronRightIcon = useCallback((props: ListLRProps) => (
    <List.Icon {...props} icon="chevron-right" />
  ), []);

  return (
    <Link href="/appdata" asChild>
      <List.Item
        title="View App Data"
        description="View the data that related to the app"
        left={renderDataBaseIcon}
        right={renderChevronRightIcon}
      />
    </Link>
  );
};

export default ViewAppDataItem;

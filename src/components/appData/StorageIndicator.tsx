import React from 'react';
import { Button } from 'react-native-paper';

import { formatDataSize } from '@/src/utils/formatDataSize';
import { reduxStorage as storage } from '@/src/utils/mmkvStorage';

export const MMKVStorageIndicator = () => {
  // const storageSize = useMemo(() => {
  //   const keys = storage.getAllKeys();
  //   const stores = keys.map((key) => (
  //     [key, storage.getString(key)]
  //   ));

  //   return (
  //     stores.reduce((
  //       acc, [_, value]
  //     ) => (
  //       acc + new Blob([value ?? '']).size
  //     ), 0)
  //   );
  // }, []);

  return (
    <Button icon="database-search-outline">
      {/* {formatDataSize(storageSize)} */}
      {formatDataSize(storage.size)}
    </Button>
  );
};

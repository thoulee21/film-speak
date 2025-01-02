import { useMemo } from "react";

import { DataList } from "@/src/components/appData/DataList";
import { reduxStorage as storage } from "@/src/utils/mmkvStorage";

const LocalStorage = () => {
  const dataItems = useMemo(() => (
    storage.getAllKeys().map((
      localDataName
    ) => ({
      name: localDataName,
      data: JSON.parse(
        storage.getString(localDataName) || ''
      ),
    }))
  ), []);

  return <DataList dataItems={dataItems} />;
};

export default LocalStorage;

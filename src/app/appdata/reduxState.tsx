import { memo, useMemo } from "react";

import { DataList } from "@/src/components/appData/DataList";
import { store } from "@/src/redux/store";

const ReduxState = () => {
  const state: { [key: string]: any } = store.getState();

  const stateList = useMemo(() => (
    Object.keys(state).map((
      key
    ) => ({
      name: key,
      data: state[key].value || state[key],
    }))
  ), [state]);

  return <DataList dataItems={stateList} />;
};

export default memo(ReduxState);

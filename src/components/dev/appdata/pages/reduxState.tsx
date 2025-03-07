import { useMemo } from "react";

import { DataList } from "@/src/components/dev/appdata/DataList";
import { store } from "@/src/store/store";

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

export default ReduxState;

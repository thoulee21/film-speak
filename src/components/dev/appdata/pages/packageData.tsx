import { useMemo } from "react";

import packageJson from '@/package.json';
import { DataList } from "@/src/components/dev/appdata/DataList";

const PackageData = () => {
  const packageData = useMemo(() => (
    Object.keys(packageJson).map((
      key
    ) => ({
      name: key,
      data: (packageJson as Record<string, any>)[key],
    }))
  ), []);

  return <DataList dataItems={packageData} />;
};

export default PackageData;

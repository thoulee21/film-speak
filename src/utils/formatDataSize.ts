export const formatDataSize = (dataSize: number): string => {
  if (dataSize < 1024) {
    return `${dataSize} B`;
  } else if (dataSize < 1024 * 1024) {
    return `${(dataSize / 1024).toFixed(2)} KB`;
  } else if (dataSize < 1024 * 1024 * 1024) {
    return `${(dataSize / 1024 / 1024).toFixed(2)} MB`;
  } else {
    return `${(dataSize / 1024 / 1024 / 1024).toFixed(2)} GB`;
  }
};

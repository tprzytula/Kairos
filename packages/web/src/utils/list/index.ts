export interface IAddPropertyToEachItemInList<T, K extends keyof any> {
  list: T[];
  properties: Record<K, any>;
}

export const addPropertyToEachItemInList = <T, K extends keyof any>({
  list,
  properties,
}: IAddPropertyToEachItemInList<T, K>): (T & Record<K, any>)[] => {
  return list.map(item => ({
    ...item,
    ...properties,
  }));
}

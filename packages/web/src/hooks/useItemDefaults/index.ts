import { useEffect, useState, useCallback } from "react";
import { IItemDefault, IUseItemDefaultsProps, IUseItemDefaultsResult } from "./types";

export const useItemDefaults = ({ fetchMethod }: IUseItemDefaultsProps): IUseItemDefaultsResult => {
  const [defaults, setDefaults] = useState<Array<IItemDefault>>([]);

  const fetchDefaults = useCallback(async () => {
    try {
      const defaults = await fetchMethod();
      setDefaults(defaults);
    } catch {
      // fetch errors are handled silently; component renders with empty defaults
    }
  }, [fetchMethod]);

  useEffect(() => {
    fetchDefaults();
  }, [fetchDefaults]);

  return { defaults };
};

import { IItemDefault } from "../../../../hooks/useItemDefaults/types";

export const findItemIcon = (name: string, defaults?: Array<IItemDefault>) => {
    const defaultItem = defaults?.find((defaultItem) => name.toLowerCase().includes(defaultItem.name.toLowerCase()));

    if (defaultItem && defaultItem.icon) {
        return defaultItem.icon;
    }

    return undefined;
};

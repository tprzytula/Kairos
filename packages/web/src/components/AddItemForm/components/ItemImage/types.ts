import { IItemDefault } from "../../../../hooks/useItemDefaults/types";

export interface IItemImageProps {
    itemName?: string;
    defaults?: Array<IItemDefault>;
    onChange: (imagePath: string) => void;
}

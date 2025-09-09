import { IItemDefault } from "../../../../hooks/useItemDefaults/types";

export interface IItemImageProps {
    itemName?: string;
    defaults?: Array<IItemDefault>;
    initialImagePath?: string;
    onChange: (imagePath: string) => void;
}

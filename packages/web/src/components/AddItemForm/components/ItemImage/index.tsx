import { useEffect, useMemo, useState } from "react";
import { StyledItemImage } from "./index.styled";
import { IItemImageProps } from "./types";
import { findItemIcon } from "./utils";

const GENERIC_ITEM_NAME = 'generic';

const ItemImage = ({ defaults, itemName, onChange }: IItemImageProps) => {
    const [imagePath, setImagePath] = useState<string | undefined>();
    const genericIcon = useMemo(() => findItemIcon(GENERIC_ITEM_NAME, defaults), [defaults]);

    useEffect(() => {
        if (genericIcon) {
            setImagePath(genericIcon);
        }
    }, [genericIcon]);

    useEffect(() => {
        if (!itemName) {
            return;
        }

        const icon = findItemIcon(itemName, defaults);

        if (icon) {
            setImagePath(icon);
        } else if (genericIcon) {
            setImagePath(genericIcon);
        }
    }, [defaults, itemName]);

    useEffect(() => {
        if (imagePath) {
            onChange(imagePath);
        }
    }, [imagePath, onChange]);

    if (!imagePath) {
        return <StyledItemImage aria-label="Placeholder image" />;
    }

    return (
        <StyledItemImage aria-label={`${itemName} image`} image={imagePath} />
    )
};

export default ItemImage;

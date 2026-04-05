import { IAdventure } from '../../../../types/adventure'

export interface IAdventureGroupedItemProps {
  adventure: IAdventure
  onClick: (id: string) => void
}

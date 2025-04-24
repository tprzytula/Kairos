import { ReactNode } from 'react'
import { INoiseTrackingItem } from '../../api/noiseTracking'

export interface INoiseTrackingProviderProps {
    children: ReactNode
}

export interface IState {
    noiseTrackingItems: Array<INoiseTrackingItem>
    isLoading: boolean
    refetchNoiseTrackingItems: () => Promise<void>
}

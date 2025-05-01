import { Route } from "../../enums/route"

export interface IStandardLayoutProps {
    title: string
    children: React.ReactNode
    previousRoute?: Route
    nextRoute?: Route
}

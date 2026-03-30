import { ReactNode } from 'react'
import { SxProps, Theme } from '@mui/material'
import DraggableBottomDrawer from '../DraggableBottomDrawer'
import {
  DrawerHeader,
  DrawerHeaderLeft,
  DrawerIconBox,
  DrawerTitle,
} from '../DrawerHeader/index.styled'

interface BasePreviewDrawerProps {
  open: boolean
  onClose: () => void
  icon: ReactNode
  title: string
  gradient: string
  headerRight?: ReactNode
  paperSx?: SxProps<Theme>
  children: ReactNode
}

const BasePreviewDrawer = ({
  open,
  onClose,
  icon,
  title,
  gradient,
  headerRight,
  paperSx,
  children,
}: BasePreviewDrawerProps) => (
  <DraggableBottomDrawer
    open={open}
    onClose={onClose}
    paperSx={paperSx}
    dragHandleContent={
      <DrawerHeader>
        <DrawerHeaderLeft>
          <DrawerIconBox gradient={gradient}>{icon}</DrawerIconBox>
          <DrawerTitle gradient={gradient}>{title}</DrawerTitle>
        </DrawerHeaderLeft>
        {headerRight}
      </DrawerHeader>
    }
  >
    {children}
  </DraggableBottomDrawer>
)

export default BasePreviewDrawer

import React from 'react'
import StorefrontIcon from '@mui/icons-material/Storefront'
import { styled } from '@mui/material/styles'
import { IShop } from '../../providers/AppStateProvider/types'

interface IShopIconBadgeProps {
  shop: IShop
  size?: number
  bottom?: number | string
  right?: number | string
}

const Badge = styled('div')<{ size: number; bottom: number | string; right: number | string }>(
  ({ size, bottom, right }) => ({
    position: 'absolute',
    bottom,
    right,
    width: `${size}px`,
    height: `${size}px`,
    borderRadius: '50%',
    backgroundColor: '#ffffff',
    border: '1.5px solid #ffffff',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    zIndex: 1,
    flexShrink: 0,
  })
)

const ShopIconBadge: React.FC<IShopIconBadgeProps> = ({
  shop,
  size = 20,
  bottom = '-4px',
  right = '-4px',
}) => {
  return (
    <Badge size={size} bottom={bottom} right={right}>
      {shop.icon ? (
        <img
          src={shop.icon}
          alt={shop.name}
          style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '50%' }}
        />
      ) : (
        <StorefrontIcon sx={{ fontSize: `${Math.round(size * 0.6)}px`, color: 'rgba(0,0,0,0.5)' }} />
      )}
    </Badge>
  )
}

export default ShopIconBadge

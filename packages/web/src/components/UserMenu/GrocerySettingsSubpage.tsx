import React, { useEffect, useState } from 'react'
import { Divider, CircularProgress } from '@mui/material'
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material'
import * as Styled from './index.styled'
import { retrieveGroceryListDefaults } from '../../api/groceryList'
import { IDBGroceryItemDefault } from '../../api/groceryList/retrieve/types'

interface GrocerySettingsSubpageProps {
  onBack: () => void
}

const GrocerySettingsSubpage: React.FC<GrocerySettingsSubpageProps> = ({ onBack }) => {
  const [defaults, setDefaults] = useState<Array<IDBGroceryItemDefault>>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    retrieveGroceryListDefaults()
      .then(setDefaults)
      .finally(() => setIsLoading(false))
  }, [])

  const groupedByCategory = defaults.reduce<Record<string, Array<IDBGroceryItemDefault>>>((acc, item) => {
    const category = item.category || 'Other'
    if (!acc[category]) acc[category] = []
    acc[category].push(item)
    return acc
  }, {})

  const sortedCategories = Object.keys(groupedByCategory).sort()

  return (
    <>
      <Styled.SubpageHeader>
        <Styled.BackButton onClick={onBack}>
          <ArrowBackIcon fontSize="small" />
        </Styled.BackButton>
        <Styled.SubpageTitle>Grocery Settings</Styled.SubpageTitle>
      </Styled.SubpageHeader>

      <Divider sx={{ my: 1 }} />

      {isLoading && (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '24px 0' }}>
          <CircularProgress size={24} />
        </div>
      )}

      {!isLoading && defaults.length === 0 && (
        <div style={{ fontSize: '13px', color: '#6b7280', textAlign: 'center', padding: '16px 0' }}>
          No default items configured.
        </div>
      )}

      {!isLoading && sortedCategories.map(category => (
        <div key={category}>
          <Styled.SectionTitle>{category}</Styled.SectionTitle>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '4px' }}>
            {groupedByCategory[category].map(item => (
              <div
                key={item.name}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px',
                  width: '60px',
                }}
              >
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '10px',
                    background: '#f3f4f6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    flexShrink: 0,
                  }}
                >
                  {item.icon ? (
                    <img
                      src={item.icon}
                      alt={item.name}
                      style={{ width: '32px', height: '32px', objectFit: 'contain' }}
                    />
                  ) : (
                    <span style={{ fontSize: '20px' }}>🛒</span>
                  )}
                </div>
                <span
                  style={{
                    fontSize: '10px',
                    color: '#374151',
                    textAlign: 'center',
                    lineHeight: '1.2',
                    wordBreak: 'break-word',
                    width: '100%',
                  }}
                >
                  {item.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </>
  )
}

export default GrocerySettingsSubpage

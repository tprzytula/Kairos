import React, { useEffect, useRef, useState } from 'react'
import { Divider, CircularProgress, Button, TextField, Select, MenuItem, FormControl, InputLabel, Collapse } from '@mui/material'
import { ArrowBack as ArrowBackIcon, Add as AddIcon } from '@mui/icons-material'
import * as Styled from './index.styled'
import { retrieveGroceryListDefaults, addGroceryItemDefault, getGroceryDefaultUploadUrl } from '../../api/groceryList'
import { IDBGroceryItemDefault } from '../../api/groceryList/retrieve/types'
import { GroceryItemUnit } from '../../enums/groceryItem'
import { useProjectContext } from '../../providers/ProjectProvider'

interface GrocerySettingsSubpageProps {
  onBack: () => void
}

const BACKEND_CATEGORIES = [
  'Fruits & Vegetables',
  'Meat & Poultry',
  'Dairy',
  'Bakery & Grains',
  'Pantry & Grains',
  'Beverages',
  'Household',
  'Other',
]

const GrocerySettingsSubpage: React.FC<GrocerySettingsSubpageProps> = ({ onBack }) => {
  const { currentProject } = useProjectContext()
  const [defaults, setDefaults] = useState<Array<IDBGroceryItemDefault>>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [name, setName] = useState('')
  const [unit, setUnit] = useState<GroceryItemUnit | ''>('')
  const [category, setCategory] = useState('')
  const [iconPath, setIconPath] = useState('')
  const [iconPreview, setIconPreview] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const fetchDefaults = () => {
    setIsLoading(true)
    retrieveGroceryListDefaults()
      .then(setDefaults)
      .finally(() => setIsLoading(false))
  }

  useEffect(() => {
    fetchDefaults()
  }, [])

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIconPreview(URL.createObjectURL(file))
    setIsUploading(true)
    setFormError('')

    try {
      const { uploadUrl, imagePath } = await getGroceryDefaultUploadUrl('jpg', currentProject?.id)
      await fetch(uploadUrl, {
        method: 'PUT',
        body: file,
        headers: { 'Content-Type': file.type || 'image/jpeg' },
      })
      setIconPath(imagePath)
    } catch {
      setFormError('Failed to upload image. Please try again.')
      setIconPreview('')
    } finally {
      setIsUploading(false)
      e.target.value = ''
    }
  }

  const handleSubmit = async () => {
    if (!name.trim()) {
      setFormError('Name is required.')
      return
    }

    setIsSubmitting(true)
    setFormError('')

    try {
      await addGroceryItemDefault(
        {
          name: name.trim(),
          ...(iconPath && { icon: iconPath }),
          ...(unit && { unit }),
          ...(category && { category }),
        },
        currentProject?.id
      )
      setName('')
      setUnit('')
      setCategory('')
      setIconPath('')
      setIconPreview('')
      setShowAddForm(false)
      fetchDefaults()
    } catch {
      setFormError('Failed to save. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const groupedByCategory = defaults.reduce<Record<string, Array<IDBGroceryItemDefault>>>((acc, item) => {
    const cat = item.category || 'Other'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(item)
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

      <Button
        size="small"
        startIcon={<AddIcon />}
        onClick={() => setShowAddForm(prev => !prev)}
        sx={{ mb: 1, textTransform: 'none', fontSize: '13px' }}
      >
        {showAddForm ? 'Cancel' : 'Add item'}
      </Button>

      <Collapse in={showAddForm}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '12px' }}>
          <TextField
            label="Name (keyword)"
            value={name}
            onChange={e => setName(e.target.value)}
            size="small"
            fullWidth
            required
          />

          <FormControl size="small" fullWidth>
            <InputLabel>Category</InputLabel>
            <Select
              value={category}
              label="Category"
              onChange={e => setCategory(e.target.value)}
            >
              <MenuItem value=""><em>None</em></MenuItem>
              {BACKEND_CATEGORIES.map(cat => (
                <MenuItem key={cat} value={cat}>{cat}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" fullWidth>
            <InputLabel>Unit</InputLabel>
            <Select
              value={unit}
              label="Unit"
              onChange={e => setUnit(e.target.value as GroceryItemUnit)}
            >
              <MenuItem value=""><em>None</em></MenuItem>
              {Object.values(GroceryItemUnit).map(u => (
                <MenuItem key={u} value={u}>{u}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
            <Button
              size="small"
              variant="outlined"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              sx={{ textTransform: 'none', fontSize: '12px', flexShrink: 0 }}
            >
              {isUploading ? <CircularProgress size={14} sx={{ mr: 1 }} /> : null}
              {isUploading ? 'Uploading…' : 'Upload icon'}
            </Button>
            {iconPreview && (
              <img
                src={iconPreview}
                alt="icon preview"
                style={{ width: '36px', height: '36px', objectFit: 'contain', borderRadius: '6px', background: '#f3f4f6' }}
              />
            )}
          </div>

          {formError && (
            <div style={{ fontSize: '12px', color: '#dc2626' }}>{formError}</div>
          )}

          <Button
            size="small"
            variant="contained"
            onClick={handleSubmit}
            disabled={isSubmitting || isUploading}
            sx={{ textTransform: 'none', fontSize: '13px', alignSelf: 'flex-start' }}
          >
            {isSubmitting ? <CircularProgress size={14} sx={{ mr: 1, color: 'white' }} /> : null}
            Save
          </Button>
        </div>

        <Divider sx={{ mb: 1 }} />
      </Collapse>

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

      {!isLoading && sortedCategories.map(cat => (
        <div key={cat}>
          <Styled.SectionTitle>{cat}</Styled.SectionTitle>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '4px' }}>
            {groupedByCategory[cat].map(item => (
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

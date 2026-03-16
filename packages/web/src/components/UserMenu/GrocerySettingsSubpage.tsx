import React, { useEffect, useRef, useState } from 'react'
import { Divider, CircularProgress, Button, TextField, Select, MenuItem, FormControl, InputLabel, Collapse, Menu, Dialog, DialogActions, DialogContent, DialogContentText } from '@mui/material'
import { ArrowBack as ArrowBackIcon, Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material'
import { type Area } from 'react-easy-crop'
import * as Styled from './index.styled'
import { retrieveGroceryListDefaults, addGroceryItemDefault, getGroceryDefaultUploadUrl, deleteGroceryItemDefault, updateGroceryItemDefault } from '../../api/groceryList'
import { IUpdateGroceryItemDefaultPayload } from '../../api/groceryList/updateDefault'
import { IDBGroceryItemDefault } from '../../api/groceryList/retrieve/types'
import { GroceryItemUnit } from '../../enums/groceryItem'
import { useProjectContext } from '../../providers/ProjectProvider'
import ImageCropModal from '../RecipeForm/ImageCropModal'
import { getCroppedBlob } from '../RecipeForm/cropUtils'

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

  // Add form state
  const [showAddForm, setShowAddForm] = useState(false)
  const [name, setName] = useState('')
  const [unit, setUnit] = useState<GroceryItemUnit | ''>('')
  const [category, setCategory] = useState('')
  const [iconPath, setIconPath] = useState('')
  const [iconPreview, setIconPreview] = useState('')
  const [pendingImageSrc, setPendingImageSrc] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Edit form state
  const [editingItem, setEditingItem] = useState<IDBGroceryItemDefault | null>(null)
  const [editUnit, setEditUnit] = useState<GroceryItemUnit | ''>('')
  const [editCategory, setEditCategory] = useState('')
  const [editIconPath, setEditIconPath] = useState('')
  const [editIconPreview, setEditIconPreview] = useState('')
  const [editPendingImageSrc, setEditPendingImageSrc] = useState<string | null>(null)
  const [isEditUploading, setIsEditUploading] = useState(false)
  const [isEditSubmitting, setIsEditSubmitting] = useState(false)
  const [editFormError, setEditFormError] = useState('')
  const editFileInputRef = useRef<HTMLInputElement>(null)

  // Tile popover menu state
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null)
  const [menuItem, setMenuItem] = useState<IDBGroceryItemDefault | null>(null)

  // Delete confirmation state
  const [deletingItemName, setDeletingItemName] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const fetchDefaults = () => {
    setIsLoading(true)
    retrieveGroceryListDefaults()
      .then(setDefaults)
      .finally(() => setIsLoading(false))
  }

  useEffect(() => {
    fetchDefaults()
  }, [])

  // Add form handlers
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setPendingImageSrc(URL.createObjectURL(file))
    e.target.value = ''
  }

  const handleCropConfirm = async (croppedAreaPixels: Area) => {
    if (!pendingImageSrc) return

    const previousPreview = iconPreview
    const previousPath = iconPath

    try {
      const croppedBlob = await getCroppedBlob(pendingImageSrc, croppedAreaPixels)
      setIconPreview(URL.createObjectURL(croppedBlob))
      setPendingImageSrc(null)
      setIsUploading(true)
      setFormError('')

      const { uploadUrl, imagePath } = await getGroceryDefaultUploadUrl('jpg', currentProject?.id)
      const uploadResponse = await fetch(uploadUrl, {
        method: 'PUT',
        body: croppedBlob,
        headers: { 'Content-Type': 'image/jpeg' },
      })
      if (!uploadResponse.ok) {
        throw new Error('Upload failed')
      }
      setIconPath(imagePath)
    } catch {
      setFormError('Failed to upload image. Please try again.')
      setIconPreview(previousPreview)
      setIconPath(previousPath)
      setPendingImageSrc(null)
    } finally {
      setIsUploading(false)
    }
  }

  const handleCropCancel = () => {
    setPendingImageSrc(null)
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

  // Edit form handlers
  const handleEditClick = (item: IDBGroceryItemDefault) => {
    setEditingItem(item)
    setEditUnit(item.unit || '')
    setEditCategory(item.category || '')
    setEditIconPath(item.icon || '')
    setEditIconPreview(item.icon || '')
    setEditFormError('')
  }

  const handleEditCancel = () => {
    setEditingItem(null)
    setEditUnit('')
    setEditCategory('')
    setEditIconPath('')
    setEditIconPreview('')
    setEditPendingImageSrc(null)
    setEditFormError('')
  }

  const handleEditSubmit = async () => {
    if (!editingItem) return

    const payload: IUpdateGroceryItemDefaultPayload = {
      ...(editUnit && { unit: editUnit }),
      ...(editCategory && { category: editCategory }),
      ...(editIconPath && { icon: editIconPath }),
    }

    if (Object.keys(payload).length === 0) {
      setEditFormError('Please change at least one field.')
      return
    }

    setIsEditSubmitting(true)
    setEditFormError('')

    try {
      await updateGroceryItemDefault(editingItem.name, payload, currentProject?.id)
      handleEditCancel()
      fetchDefaults()
    } catch {
      setEditFormError('Failed to save. Please try again.')
    } finally {
      setIsEditSubmitting(false)
    }
  }

  const handleEditFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setEditPendingImageSrc(URL.createObjectURL(file))
    e.target.value = ''
  }

  const handleEditCropConfirm = async (croppedAreaPixels: Area) => {
    if (!editPendingImageSrc) return

    const previousPreview = editIconPreview
    const previousPath = editIconPath

    try {
      const croppedBlob = await getCroppedBlob(editPendingImageSrc, croppedAreaPixels)
      setEditIconPreview(URL.createObjectURL(croppedBlob))
      setEditPendingImageSrc(null)
      setIsEditUploading(true)
      setEditFormError('')

      const { uploadUrl, imagePath } = await getGroceryDefaultUploadUrl('jpg', currentProject?.id)
      const uploadResponse = await fetch(uploadUrl, {
        method: 'PUT',
        body: croppedBlob,
        headers: { 'Content-Type': 'image/jpeg' },
      })
      if (!uploadResponse.ok) {
        throw new Error('Upload failed')
      }
      setEditIconPath(imagePath)
    } catch {
      setEditFormError('Failed to upload image. Please try again.')
      setEditIconPreview(previousPreview)
      setEditIconPath(previousPath)
      setEditPendingImageSrc(null)
    } finally {
      setIsEditUploading(false)
    }
  }

  const handleEditCropCancel = () => {
    setEditPendingImageSrc(null)
  }

  const handleTileClick = (e: React.MouseEvent<HTMLElement>, item: IDBGroceryItemDefault) => {
    setMenuAnchor(e.currentTarget)
    setMenuItem(item)
  }

  const handleMenuClose = () => {
    setMenuAnchor(null)
    setMenuItem(null)
  }

  const handleMenuEdit = () => {
    if (menuItem) handleEditClick(menuItem)
    handleMenuClose()
  }

  const handleMenuDelete = () => {
    if (menuItem) setDeletingItemName(menuItem.name)
    handleMenuClose()
  }

  // Delete handlers
  const handleDeleteClick = (itemName: string) => {
    setDeletingItemName(itemName)
  }

  const handleDeleteConfirm = async () => {
    if (!deletingItemName) return

    setIsDeleting(true)
    try {
      await deleteGroceryItemDefault(deletingItemName, currentProject?.id)
      setDeletingItemName(null)
      fetchDefaults()
    } catch {
      setDeletingItemName(null)
    } finally {
      setIsDeleting(false)
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

      {pendingImageSrc && (
        <ImageCropModal
          imageSrc={pendingImageSrc}
          aspect={1}
          onConfirm={handleCropConfirm}
          onCancel={handleCropCancel}
        />
      )}

      {editPendingImageSrc && (
        <ImageCropModal
          imageSrc={editPendingImageSrc}
          aspect={1}
          onConfirm={handleEditCropConfirm}
          onCancel={handleEditCropCancel}
        />
      )}

      {!isLoading && sortedCategories.map(cat => (
        <div key={cat}>
          <Styled.SectionTitle>{cat}</Styled.SectionTitle>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '4px' }}>
            {groupedByCategory[cat].map(item => (
              <div
                key={item.name}
                onClick={e => handleTileClick(e, item)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px',
                  width: '60px',
                  cursor: 'pointer',
                  borderRadius: '10px',
                  padding: '4px',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = '#f3f4f6')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
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

          {editingItem && groupedByCategory[cat].some(i => i.name === editingItem.name) && (
            <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '10px', marginBottom: '8px', marginTop: '4px' }}>
              <div style={{ fontSize: '12px', fontWeight: 500, color: '#374151', marginBottom: '8px' }}>
                Editing: {editingItem.name}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <FormControl size="small" fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={editCategory}
                    label="Category"
                    onChange={e => setEditCategory(e.target.value)}
                  >
                    <MenuItem value=""><em>None</em></MenuItem>
                    {BACKEND_CATEGORIES.map(c => (
                      <MenuItem key={c} value={c}>{c}</MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl size="small" fullWidth>
                  <InputLabel>Unit</InputLabel>
                  <Select
                    value={editUnit}
                    label="Unit"
                    onChange={e => setEditUnit(e.target.value as GroceryItemUnit)}
                  >
                    <MenuItem value=""><em>None</em></MenuItem>
                    {Object.values(GroceryItemUnit).map(u => (
                      <MenuItem key={u} value={u}>{u}</MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <input
                    ref={editFileInputRef}
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleEditFileChange}
                  />
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => editFileInputRef.current?.click()}
                    disabled={isEditUploading}
                    sx={{ textTransform: 'none', fontSize: '12px', flexShrink: 0 }}
                  >
                    {isEditUploading ? <CircularProgress size={14} sx={{ mr: 1 }} /> : null}
                    {isEditUploading ? 'Uploading…' : 'Change icon'}
                  </Button>
                  {editIconPreview && (
                    <img
                      src={editIconPreview}
                      alt="icon preview"
                      style={{ width: '36px', height: '36px', objectFit: 'contain', borderRadius: '6px', background: '#f3f4f6' }}
                    />
                  )}
                </div>

                {editFormError && (
                  <div style={{ fontSize: '12px', color: '#dc2626' }}>{editFormError}</div>
                )}

                <div style={{ display: 'flex', gap: '8px' }}>
                  <Button
                    size="small"
                    variant="contained"
                    onClick={handleEditSubmit}
                    disabled={isEditSubmitting || isEditUploading}
                    sx={{ textTransform: 'none', fontSize: '12px' }}
                  >
                    {isEditSubmitting ? <CircularProgress size={14} sx={{ mr: 1, color: 'white' }} /> : null}
                    Save
                  </Button>
                  <Button
                    size="small"
                    onClick={handleEditCancel}
                    sx={{ textTransform: 'none', fontSize: '12px' }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}

      <Menu
        anchorEl={menuAnchor}
        open={!!menuAnchor}
        onClose={handleMenuClose}
        slotProps={{ paper: { sx: { minWidth: 120 } } }}
      >
        <MenuItem onClick={handleMenuEdit} sx={{ fontSize: '14px', gap: 1 }}>
          <EditIcon sx={{ fontSize: '16px' }} /> Edit
        </MenuItem>
        <MenuItem onClick={handleMenuDelete} sx={{ fontSize: '14px', gap: 1, color: '#dc2626' }}>
          <DeleteIcon sx={{ fontSize: '16px' }} /> Delete
        </MenuItem>
      </Menu>

      <Dialog open={!!deletingItemName} onClose={() => setDeletingItemName(null)}>
        <DialogContent>
          <DialogContentText>
            Delete &quot;{deletingItemName}&quot;? This cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeletingItemName(null)} sx={{ textTransform: 'none' }}>
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            disabled={isDeleting}
            sx={{ textTransform: 'none' }}
          >
            {isDeleting ? <CircularProgress size={14} sx={{ mr: 1 }} /> : null}
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default GrocerySettingsSubpage

import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { ToggleButton, InputAdornment, IconButton, Box, MenuItem, CircularProgress, Typography } from '@mui/material'
import RestaurantIcon from '@mui/icons-material/Restaurant'
import SearchIcon from '@mui/icons-material/Search'
import VisibilityIcon from '@mui/icons-material/Visibility'
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate'
import { type Area } from 'react-easy-crop'
import dayjs from 'dayjs'
import { IMealPlan } from '../../types/mealPlan'
import { IRecipe } from '../../types/recipe'
import { MealType, MEAL_TYPE_ORDER } from '../../enums/mealType'
import { useRecipeContext } from '../../providers/RecipeProvider'
import { useProjectContext } from '../../providers/ProjectProvider'
import { useAppState } from '../../providers/AppStateProvider'
import { showAlert } from '../../utils/alert'
import { getMealPlanUploadUrl } from '../../api/mealPlans'
import ImageCropModal from '../RecipeForm/ImageCropModal'
import { getCroppedBlob } from '../RecipeForm/cropUtils'
import RecipeViewDrawer from '../RecipeViewDrawer'
import DraggableBottomDrawer from '../DraggableBottomDrawer'

import {
  DrawerContent,
  DrawerHeader,
  DateLabel,
  StyledTextField,
  ModeToggle,
  RecipeList,
  RecipeItem,
  SaveButton,
  DeleteButton,
  SearchField,
  RecipeItemRow,
  RecipeThumbnail,
  RecipeThumbnailPlaceholder,
  RecipeItemName,
  ImageUploadBox,
  ImagePreview,
} from './index.styled'

type Mode = 'recipe' | 'custom'

interface IMealPlanDrawerProps {
  open: boolean
  date: string | null
  mealPlan?: IMealPlan
  onClose: () => void
  onSave: (date: string, recipeName: string, recipeId?: string, mealType?: MealType, imagePath?: string | null) => void
  onDelete?: (id: string) => void
}

const MealPlanDrawer = ({ open, date, mealPlan, onClose, onSave, onDelete }: IMealPlanDrawerProps) => {
  const { recipes } = useRecipeContext()
  const { currentProject } = useProjectContext()
  const { dispatch } = useAppState()
  const [mode, setMode] = useState<Mode>('recipe')
  const [customName, setCustomName] = useState('')
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | undefined>(undefined)
  const [search, setSearch] = useState('')
  const [previewRecipe, setPreviewRecipe] = useState<IRecipe | null>(null)
  const [mealType, setMealType] = useState<MealType>(MealType.Dinner)

  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [uploadedImagePath, setUploadedImagePath] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [pendingImageSrc, setPendingImageSrc] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open && mealPlan) {
      if (mealPlan.recipeId) {
        setMode('recipe')
        setSelectedRecipeId(mealPlan.recipeId)
        setCustomName('')
      } else {
        setMode('custom')
        setCustomName(mealPlan.recipeName)
        setSelectedRecipeId(undefined)
      }
      setMealType(mealPlan.mealType ?? MealType.Dinner)
      setSearch('')
      setPreviewUrl(mealPlan.imagePath ?? null)
      setUploadedImagePath(mealPlan.imagePath ?? null)
      setPendingImageSrc(null)
    }
  }, [open, mealPlan])

  const handleImageClick = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setPendingImageSrc(URL.createObjectURL(file))
    e.target.value = ''
  }, [])

  const handleCropConfirm = useCallback(async (croppedAreaPixels: Area) => {
    if (!pendingImageSrc) return

    const previousPreview = previewUrl
    const previousPath = uploadedImagePath

    try {
      const croppedBlob = await getCroppedBlob(pendingImageSrc, croppedAreaPixels)
      const objectUrl = URL.createObjectURL(croppedBlob)
      setPreviewUrl(objectUrl)
      setPendingImageSrc(null)
      setIsUploading(true)

      const { uploadUrl, imagePath: path } = await getMealPlanUploadUrl('jpg', currentProject?.id)
      await fetch(uploadUrl, {
        method: 'PUT',
        body: croppedBlob,
        headers: { 'Content-Type': 'image/jpeg' },
      })
      setUploadedImagePath(path)
    } catch {
      showAlert({ description: 'Failed to upload image', severity: 'error' }, dispatch)
      setPreviewUrl(previousPreview)
      setUploadedImagePath(previousPath)
      setPendingImageSrc(null)
    } finally {
      setIsUploading(false)
    }
  }, [pendingImageSrc, previewUrl, uploadedImagePath, currentProject, dispatch])

  const handleCropCancel = useCallback(() => {
    setPendingImageSrc(null)
  }, [])

  const filteredRecipes = useMemo(
    () => recipes.filter(r => r.name.toLowerCase().includes(search.toLowerCase())),
    [recipes, search]
  )

  const selectedRecipe = useMemo(
    () => recipes.find(r => r.id === selectedRecipeId),
    [recipes, selectedRecipeId]
  )

  const canSave = mode === 'recipe'
    ? selectedRecipeId !== undefined
    : customName.trim().length > 0

  const handleSave = () => {
    if (!date) return

    if (mode === 'recipe' && selectedRecipe) {
      onSave(date, selectedRecipe.name, selectedRecipe.id, mealType, null)
    } else if (mode === 'custom' && customName.trim()) {
      onSave(date, customName.trim(), undefined, mealType, uploadedImagePath)
    }
  }

  const displayDate = date ? dayjs(date).format('dddd, D MMMM YYYY') : ''

  return (
    <>
      {pendingImageSrc && (
        <ImageCropModal
          imageSrc={pendingImageSrc}
          onConfirm={handleCropConfirm}
          onCancel={handleCropCancel}
        />
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      <DraggableBottomDrawer
        open={open}
        onClose={onClose}
        paperSx={{ maxHeight: '85vh' }}
        dragHandleContent={
          <Box sx={{ px: '1.25em' }}>
            <DrawerHeader>
              <RestaurantIcon sx={{ fontSize: '1.1rem', verticalAlign: 'middle', marginRight: '6px' }} />
              Edit Meal
            </DrawerHeader>
            <DateLabel>{displayDate}</DateLabel>
          </Box>
        }
      >
        <DrawerContent>
          <StyledTextField
            select
            size="small"
            label="Meal type"
            value={mealType}
            onChange={(e) => setMealType(e.target.value as MealType)}
            fullWidth
          >
            {MEAL_TYPE_ORDER.map(type => (
              <MenuItem key={type} value={type}>{type}</MenuItem>
            ))}
          </StyledTextField>

          <ModeToggle
            value={mode}
            exclusive
            onChange={(_, value) => { if (value) setMode(value) }}
          >
            <ToggleButton value="recipe">From Recipe</ToggleButton>
            <ToggleButton value="custom">Custom Name</ToggleButton>
          </ModeToggle>

          {mode === 'recipe' ? (
            <>
              <SearchField
                size="small"
                placeholder="Search recipes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
                fullWidth
              />
              <RecipeList>
                {filteredRecipes.length === 0 ? (
                  <RecipeItem sx={{ color: '#9ca3af', fontStyle: 'italic' }}>
                    {search ? 'No recipes found' : 'No recipes yet'}
                  </RecipeItem>
                ) : (
                  filteredRecipes.map(recipe => (
                    <RecipeItemRow
                      key={recipe.id}
                      selected={selectedRecipeId === recipe.id}
                      onClick={() => setSelectedRecipeId(recipe.id)}
                    >
                      {recipe.imagePath ? (
                        <RecipeThumbnail src={recipe.imagePath} alt={recipe.name} />
                      ) : (
                        <RecipeThumbnailPlaceholder seed={recipe.name.charCodeAt(0)}>
                          {recipe.name.charAt(0).toUpperCase()}
                        </RecipeThumbnailPlaceholder>
                      )}
                      <RecipeItemName>{recipe.name}</RecipeItemName>
                      <IconButton
                        size="small"
                        onClick={(e) => { e.stopPropagation(); setPreviewRecipe(recipe) }}
                        sx={{ color: '#9ca3af', flexShrink: 0, '&:hover': { color: '#1d4ed8' } }}
                      >
                        <VisibilityIcon sx={{ fontSize: '1rem' }} />
                      </IconButton>
                    </RecipeItemRow>
                  ))
                )}
              </RecipeList>
            </>
          ) : (
            <>
              <ImageUploadBox onClick={handleImageClick}>
                {previewUrl ? (
                  <ImagePreview src={previewUrl} alt="Meal cover" />
                ) : null}
                {isUploading ? (
                  <CircularProgress size={24} sx={{ position: 'relative', zIndex: 1 }} />
                ) : !previewUrl ? (
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <AddPhotoAlternateIcon fontSize="small" />
                    Add photo
                  </Typography>
                ) : null}
              </ImageUploadBox>

              <StyledTextField
                size="small"
                label="Meal name"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                fullWidth
                onKeyDown={(e) => { if (e.key === 'Enter' && canSave) handleSave() }}
              />
            </>
          )}

          <SaveButton
            variant="contained"
            fullWidth
            disabled={!canSave || isUploading}
            onClick={handleSave}
          >
            Save
          </SaveButton>

          {mealPlan && onDelete && (
            <DeleteButton
              variant="outlined"
              fullWidth
              onClick={() => onDelete(mealPlan.id)}
            >
              Delete
            </DeleteButton>
          )}
        </DrawerContent>
      </DraggableBottomDrawer>

      <RecipeViewDrawer
        recipe={previewRecipe}
        onClose={() => setPreviewRecipe(null)}
        onEdit={() => {}}
      />
    </>
  )
}

export default MealPlanDrawer

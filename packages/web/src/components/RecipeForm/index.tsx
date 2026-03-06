import { useState, useCallback, useRef, useEffect } from 'react'
import {
  TextField,
  Button,
  IconButton,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Typography,
  CircularProgress,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate'
import { type Area } from 'react-easy-crop'
import { IRecipe, IRecipeIngredient } from '../../types/recipe'
import { GroceryItemUnit, GroceryItemUnitLabelMap } from '../../enums/groceryItem'
import { useRecipeContext } from '../../providers/RecipeProvider'
import { useAppState } from '../../providers/AppStateProvider'
import { showAlert } from '../../utils/alert'
import { getRecipeUploadUrl } from '../../api/recipes'
import { useProjectContext } from '../../providers/ProjectProvider'
import { FormContainer, IngredientRow, IngredientsSection, FormActions, ImageUploadBox, ImagePreview } from './index.styled'
import ImageCropModal from './ImageCropModal'
import { getCroppedBlob } from './cropUtils'

interface RecipeFormProps {
  initialRecipe?: IRecipe | null
  onDone: () => void
}

const DEFAULT_INGREDIENT: IRecipeIngredient = {
  name: '',
  quantity: 1,
  unit: GroceryItemUnit.UNIT,
}

const RecipeForm = ({ initialRecipe, onDone }: RecipeFormProps) => {
  const { addRecipe, updateRecipe, removeRecipe } = useRecipeContext()
  const { currentProject } = useProjectContext()
  const { dispatch } = useAppState()
  const [name, setName] = useState(initialRecipe?.name ?? '')
  const [ingredients, setIngredients] = useState<IRecipeIngredient[]>(
    initialRecipe?.ingredients ?? [{ ...DEFAULT_INGREDIENT }]
  )
  const [instructions, setInstructions] = useState<string[]>(
    initialRecipe?.instructions ?? ['']
  )
  const [isSaving, setIsSaving] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(false)

  useEffect(() => {
    if (!deleteConfirm) return
    const timer = setTimeout(() => setDeleteConfirm(false), 3000)
    return () => clearTimeout(timer)
  }, [deleteConfirm])
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialRecipe?.imagePath ?? null)
  const [imagePath, setImagePath] = useState<string>(initialRecipe?.imagePath ?? '')
  const [isUploading, setIsUploading] = useState(false)
  const [pendingImageSrc, setPendingImageSrc] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleIngredientChange = useCallback(
    (index: number, field: keyof IRecipeIngredient, value: string | number) => {
      setIngredients((prev) =>
        prev.map((ing, i) =>
          i === index ? { ...ing, [field]: value } : ing
        )
      )
    },
    []
  )

  const handleAddIngredient = useCallback(() => {
    setIngredients((prev) => [...prev, { ...DEFAULT_INGREDIENT }])
  }, [])

  const handleRemoveIngredient = useCallback((index: number) => {
    setIngredients((prev) => prev.filter((_, i) => i !== index))
  }, [])

  const handleInstructionChange = useCallback((index: number, value: string) => {
    setInstructions((prev) => prev.map((step, i) => i === index ? value : step))
  }, [])

  const handleAddInstruction = useCallback(() => {
    setInstructions((prev) => [...prev, ''])
  }, [])

  const handleRemoveInstruction = useCallback((index: number) => {
    setInstructions((prev) => prev.filter((_, i) => i !== index))
  }, [])

  const handleImageClick = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setPendingImageSrc(URL.createObjectURL(file))
    // Reset so the same file can be picked again if the user cancels
    e.target.value = ''
  }, [])

  const handleCropConfirm = useCallback(async (croppedAreaPixels: Area) => {
    if (!pendingImageSrc) return

    const previousPreview = previewUrl
    const previousPath = imagePath

    try {
      const croppedBlob = await getCroppedBlob(pendingImageSrc, croppedAreaPixels)
      const objectUrl = URL.createObjectURL(croppedBlob)
      setPreviewUrl(objectUrl)
      setPendingImageSrc(null)
      setIsUploading(true)

      const { uploadUrl, imagePath: path } = await getRecipeUploadUrl('jpg', currentProject?.id)
      await fetch(uploadUrl, {
        method: 'PUT',
        body: croppedBlob,
        headers: { 'Content-Type': 'image/jpeg' },
      })
      setImagePath(path)
    } catch (error) {
      showAlert({ description: 'Failed to upload image', severity: 'error' }, dispatch)
      setPreviewUrl(previousPreview)
      setImagePath(previousPath)
      setPendingImageSrc(null)
    } finally {
      setIsUploading(false)
    }
  }, [pendingImageSrc, previewUrl, imagePath, currentProject, dispatch])

  const handleCropCancel = useCallback(() => {
    setPendingImageSrc(null)
  }, [])

  const handleDelete = useCallback(async () => {
    if (!deleteConfirm) {
      setDeleteConfirm(true)
      return
    }
    try {
      await removeRecipe(initialRecipe!.id)
      onDone()
    } catch (error) {
      showAlert({ description: 'Failed to delete recipe', severity: 'error' }, dispatch)
      setDeleteConfirm(false)
    }
  }, [deleteConfirm, removeRecipe, initialRecipe, onDone, dispatch])

  const handleSave = useCallback(async () => {
    const trimmedName = name.trim()
    if (!trimmedName) {
      showAlert({ description: 'Recipe name is required', severity: 'error' }, dispatch)
      return
    }

    const validIngredients = ingredients.filter((ing) => ing.name.trim().length > 0)
    if (validIngredients.length === 0) {
      showAlert({ description: 'At least one ingredient is required', severity: 'error' }, dispatch)
      return
    }

    setIsSaving(true)
    try {
      const imagePathValue = imagePath || undefined
      const validInstructions = instructions.map((s) => s.trim()).filter((s) => s.length > 0)
      const instructionsValue = validInstructions.length > 0 ? validInstructions : undefined
      if (initialRecipe) {
        await updateRecipe(initialRecipe.id, { name: trimmedName, ingredients: validIngredients, instructions: instructionsValue, imagePath: imagePathValue })
        showAlert({ description: 'Recipe updated', severity: 'success' }, dispatch)
      } else {
        await addRecipe(trimmedName, validIngredients, imagePathValue, instructionsValue)
        showAlert({ description: 'Recipe added', severity: 'success' }, dispatch)
      }
      onDone()
    } catch (error) {
      showAlert({ description: 'Failed to save recipe', severity: 'error' }, dispatch)
    } finally {
      setIsSaving(false)
    }
  }, [name, ingredients, instructions, imagePath, initialRecipe, addRecipe, updateRecipe, dispatch, onDone])

  return (
    <FormContainer>
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

      <ImageUploadBox onClick={handleImageClick} aria-label="Upload cover image">
        {previewUrl ? (
          <ImagePreview src={previewUrl} alt="Recipe cover" />
        ) : null}
        {isUploading ? (
          <CircularProgress size={24} sx={{ position: 'relative', zIndex: 1 }} />
        ) : !previewUrl ? (
          <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <AddPhotoAlternateIcon fontSize="small" />
            Add cover image
          </Typography>
        ) : null}
      </ImageUploadBox>

      <TextField
        label="Recipe name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        fullWidth
        size="small"
        placeholder="e.g. Pasta Carbonara"
      />

      <IngredientsSection>
        <Typography variant="body2" fontWeight={600} color="text.secondary">
          Ingredients
        </Typography>

        {ingredients.map((ingredient, index) => (
          <IngredientRow key={index}>
            <TextField
              label="Name"
              value={ingredient.name}
              onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
              size="small"
              placeholder="e.g. Milk"
            />
            <TextField
              label="Qty"
              type="number"
              value={ingredient.quantity}
              onChange={(e) => handleIngredientChange(index, 'quantity', Number(e.target.value))}
              size="small"
              inputProps={{ min: 0.1, step: 0.1 }}
            />
            <FormControl size="small">
              <InputLabel>Unit</InputLabel>
              <Select
                label="Unit"
                value={ingredient.unit}
                onChange={(e) => handleIngredientChange(index, 'unit', e.target.value)}
              >
                {Object.values(GroceryItemUnit).map((unit) => (
                  <MenuItem key={unit} value={unit}>
                    {GroceryItemUnitLabelMap[unit]}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <IconButton
              size="small"
              onClick={() => handleRemoveIngredient(index)}
              disabled={ingredients.length === 1}
              aria-label={`Remove ingredient ${index + 1}`}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </IngredientRow>
        ))}

        <Button
          variant="outlined"
          size="small"
          startIcon={<AddIcon />}
          onClick={handleAddIngredient}
          sx={{ alignSelf: 'flex-start', borderRadius: '8px' }}
        >
          Add Ingredient
        </Button>
      </IngredientsSection>

      <IngredientsSection>
        <Typography variant="body2" fontWeight={600} color="text.secondary">
          Instructions
        </Typography>

        {instructions.map((step, index) => (
          <IngredientRow key={index} sx={{ gridTemplateColumns: '1fr 36px' }}>
            <TextField
              label={`Step ${index + 1}`}
              value={step}
              onChange={(e) => handleInstructionChange(index, e.target.value)}
              size="small"
              multiline
              placeholder={`Describe step ${index + 1}...`}
            />
            <IconButton
              size="small"
              onClick={() => handleRemoveInstruction(index)}
              disabled={instructions.length === 1}
              aria-label={`Remove step ${index + 1}`}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </IngredientRow>
        ))}

        <Button
          variant="outlined"
          size="small"
          startIcon={<AddIcon />}
          onClick={handleAddInstruction}
          sx={{ alignSelf: 'flex-start', borderRadius: '8px' }}
        >
          Add Step
        </Button>
      </IngredientsSection>

      <FormActions>
        {initialRecipe && (
          <Button
            variant={deleteConfirm ? 'contained' : 'outlined'}
            size="small"
            onClick={handleDelete}
            disabled={isSaving}
            sx={{
              borderRadius: '8px',
              mr: 'auto',
              ...(deleteConfirm
                ? { background: '#d32f2f', color: '#fff', '&:hover': { background: '#b71c1c' } }
                : { borderColor: 'rgba(211,47,47,0.4)', color: '#d32f2f', '&:hover': { borderColor: '#d32f2f', background: 'rgba(211,47,47,0.05)' } }),
            }}
          >
            {deleteConfirm ? 'Confirm delete?' : 'Delete'}
          </Button>
        )}
        <Button variant="outlined" onClick={onDone} disabled={isSaving} sx={{ borderRadius: '8px' }}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={isSaving || isUploading}
          sx={{
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            boxShadow: 'none',
            '&:hover': { boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)' },
          }}
        >
          {isSaving ? 'Saving...' : (initialRecipe ? 'Update' : 'Save Recipe')}
        </Button>
      </FormActions>
    </FormContainer>
  )
}

export default RecipeForm

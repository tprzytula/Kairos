import { useState, useCallback } from 'react'
import {
  TextField,
  Button,
  IconButton,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Typography,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import { IRecipe, IRecipeIngredient } from '../../types/recipe'
import { GroceryItemUnit, GroceryItemUnitLabelMap } from '../../enums/groceryItem'
import { useRecipeContext } from '../../providers/RecipeProvider'
import { useAppState } from '../../providers/AppStateProvider'
import { showAlert } from '../../utils/alert'
import { FormContainer, IngredientRow, IngredientsSection, FormActions } from './index.styled'

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
  const { addRecipe, updateRecipe } = useRecipeContext()
  const { dispatch } = useAppState()
  const [name, setName] = useState(initialRecipe?.name ?? '')
  const [ingredients, setIngredients] = useState<IRecipeIngredient[]>(
    initialRecipe?.ingredients ?? [{ ...DEFAULT_INGREDIENT }]
  )
  const [isSaving, setIsSaving] = useState(false)

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
      if (initialRecipe) {
        await updateRecipe(initialRecipe.id, { name: trimmedName, ingredients: validIngredients })
        showAlert({ description: 'Recipe updated', severity: 'success' }, dispatch)
      } else {
        await addRecipe(trimmedName, validIngredients)
        showAlert({ description: 'Recipe added', severity: 'success' }, dispatch)
      }
      onDone()
    } catch (error) {
      showAlert({ description: 'Failed to save recipe', severity: 'error' }, dispatch)
    } finally {
      setIsSaving(false)
    }
  }, [name, ingredients, initialRecipe, addRecipe, updateRecipe, dispatch, onDone])

  return (
    <FormContainer>
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

      <FormActions>
        <Button variant="outlined" onClick={onDone} disabled={isSaving} sx={{ borderRadius: '8px' }}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={isSaving}
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

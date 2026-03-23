import DrawerActionButton from '../DrawerActionButton'
import ExploreIcon from '@mui/icons-material/Explore'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import { IAdventure } from '../../types/adventure'
import { usePreviewDrawerActions } from '../../hooks/usePreviewDrawerActions'
import DraggableBottomDrawer from '../DraggableBottomDrawer'
import { styled } from '@mui/material/styles'
import { Box } from '@mui/material'
import {
  DrawerHeader,
  DrawerHeaderLeft,
  DrawerIconBox,
  DrawerTitle,
  ContentContainer,
} from '../DrawerHeader/index.styled'

const ADVENTURE_GRADIENT = 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)'

const AdventureName = styled('h2')({
  margin: 0,
  fontSize: '1.2rem',
  fontWeight: 700,
  color: 'rgba(0,0,0,0.87)',
  lineHeight: 1.3,
})

const MetaRow = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  color: 'rgba(0,0,0,0.5)',
  fontSize: '0.875rem',
})

const NotesText = styled('p')({
  margin: 0,
  fontSize: '0.95rem',
  color: 'rgba(0,0,0,0.75)',
  lineHeight: 1.6,
  whiteSpace: 'pre-wrap',
})

const NoNotesText = styled('p')({
  margin: 0,
  fontSize: '0.875rem',
  color: 'rgba(0,0,0,0.35)',
  fontStyle: 'italic',
})

const Footer = styled(Box)({
  padding: '0.75rem 1.25rem',
  paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))',
  borderTop: '1px solid rgba(0,0,0,0.06)',
  flexShrink: 0,
  display: 'flex',
  gap: '0.75rem',
})

interface AdventurePreviewDrawerProps {
  item: IAdventure | null
  onClose: () => void
  onEdit: (item: IAdventure) => void
  onDelete: (id: string) => void
}

const AdventurePreviewDrawer = ({ item, onClose, onEdit, onDelete }: AdventurePreviewDrawerProps) => {
  const { handleEdit, handleDelete } = usePreviewDrawerActions({
    item,
    onEdit,
    onDelete,
    onClose,
  })

  return (
    <DraggableBottomDrawer
      open={item !== null}
      onClose={onClose}
      paperSx={{ maxHeight: '80vh' }}
      dragHandleContent={
        <DrawerHeader>
          <DrawerHeaderLeft>
            <DrawerIconBox gradient={ADVENTURE_GRADIENT}>
              <ExploreIcon />
            </DrawerIconBox>
            <DrawerTitle gradient={ADVENTURE_GRADIENT}>Adventure</DrawerTitle>
          </DrawerHeaderLeft>
        </DrawerHeader>
      }
    >
      <ContentContainer>
        <AdventureName>{item?.name}</AdventureName>

        <MetaRow>
          <CalendarTodayIcon sx={{ fontSize: '1rem' }} />
          {item?.date}{item?.endDate && item.endDate !== item.date ? ` – ${item.endDate}` : ''}
          {item?.time && (
            <>
              <AccessTimeIcon sx={{ fontSize: '1rem', ml: 0.5 }} />
              {item.time}
            </>
          )}
        </MetaRow>

        {item?.location && (
          <MetaRow>
            <LocationOnIcon sx={{ fontSize: '1rem' }} />
            {item.location}
          </MetaRow>
        )}

        {item?.notes ? (
          <NotesText>{item.notes}</NotesText>
        ) : (
          <NoNotesText>No notes</NoNotesText>
        )}
      </ContentContainer>

      <Footer>
        <DrawerActionButton
          gradient={ADVENTURE_GRADIENT}
          icon={<EditIcon />}
          label="Edit"
          onClick={handleEdit}
        />
        <DrawerActionButton
          variant="outlined"
          icon={<DeleteIcon />}
          label="Delete"
          onClick={handleDelete}
          color="error"
        />
      </Footer>
    </DraggableBottomDrawer>
  )
}

export default AdventurePreviewDrawer

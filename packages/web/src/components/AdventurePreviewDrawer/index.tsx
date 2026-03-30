import { Box, IconButton, Typography } from '@mui/material'
import DrawerActionButton from '../DrawerActionButton'
import PrivateItemBadge from '../PrivateItemBadge'
import ExploreIcon from '@mui/icons-material/Explore'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import CloseIcon from '@mui/icons-material/Close'
import { IAdventure } from '../../types/adventure'
import { getLocationLink } from '../../utils/location'
import { usePreviewDrawerActions } from '../../hooks/usePreviewDrawerActions'
import DraggableBottomDrawer from '../DraggableBottomDrawer'
import {
  DrawerHeader,
  DrawerHeaderLeft,
  DrawerIconBox,
  DrawerTitle,
  ContentContainer,
} from '../DrawerHeader/index.styled'
import {
  HeroImage,
  HeroPlaceholder,
  AdventureName,
  SectionHeader,
  SectionLabel,
  DetailRow,
  NotesText,
  NoNotesText,
  Footer,
} from './index.styled'

const ADVENTURE_GRADIENT = 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)'

const formatDate = (dateStr: string) => {
  const [year, month, day] = dateStr.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  return new Intl.DateTimeFormat(undefined, {
    weekday: 'short',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

const formatDateRange = (start: string, end?: string) => {
  const startFormatted = formatDate(start)
  if (!end || end === start) return startFormatted
  return `${startFormatted} – ${formatDate(end)}`
}

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

  const placeholderSeed = item?.name.charCodeAt(0) ?? 0

  return (
    <DraggableBottomDrawer
      open={item !== null}
      onClose={onClose}
      paperSx={{ height: 'calc(100% - env(safe-area-inset-top) - 16px)' }}
      dragHandleContent={
        <DrawerHeader>
          <DrawerHeaderLeft>
            <DrawerIconBox gradient={ADVENTURE_GRADIENT}>
              <ExploreIcon />
            </DrawerIconBox>
            <DrawerTitle gradient={ADVENTURE_GRADIENT}>Adventure</DrawerTitle>
          </DrawerHeaderLeft>
          <IconButton size="small" onClick={onClose} aria-label="Close">
            <CloseIcon />
          </IconButton>
        </DrawerHeader>
      }
    >
      <ContentContainer>
        {item?.imagePath ? (
          <HeroImage src={item.imagePath} alt={item.name} />
        ) : item ? (
          <HeroPlaceholder seed={placeholderSeed}>
            <Typography
              sx={{
                fontSize: '3rem',
                fontWeight: 700,
                color: 'rgba(255, 255, 255, 0.85)',
                lineHeight: 1,
                userSelect: 'none',
              }}
            >
              {item.name.charAt(0).toUpperCase()}
            </Typography>
          </HeroPlaceholder>
        ) : null}

        {item && (
          <AdventureName>
            {item.name}
            {item.visibility === 'private' && <PrivateItemBadge />}
          </AdventureName>
        )}

        <Box>
          <SectionHeader>
            <SectionLabel>Details</SectionLabel>
          </SectionHeader>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', mt: 0.75 }}>
            <DetailRow>
              <CalendarTodayIcon />
              {item && formatDateRange(item.date, item.endDate)}
            </DetailRow>

            {item?.time && (
              <DetailRow>
                <AccessTimeIcon />
                {item.time}
              </DetailRow>
            )}

            {item?.location && (() => {
              const { label, href } = getLocationLink(item.location)
              return (
                <DetailRow>
                  <LocationOnIcon />
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: 'inherit', textDecoration: 'underline' }}
                  >
                    {label}
                  </a>
                </DetailRow>
              )
            })()}
          </Box>
        </Box>

        <Box>
          <SectionHeader>
            <SectionLabel>Notes</SectionLabel>
          </SectionHeader>
          <Box sx={{ mt: 0.75 }}>
            {item?.notes ? (
              <NotesText>{item.notes}</NotesText>
            ) : (
              <NoNotesText>No notes added yet</NoNotesText>
            )}
          </Box>
        </Box>
      </ContentContainer>

      <Footer>
        <DrawerActionButton
          gradient={ADVENTURE_GRADIENT}
          icon={<EditIcon />}
          label="Edit Adventure"
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

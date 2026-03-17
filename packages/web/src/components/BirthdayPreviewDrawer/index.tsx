import { useCallback } from 'react'
import { Button } from '@mui/material'
import CakeIcon from '@mui/icons-material/Cake'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import dayjs from 'dayjs'
import { IBirthdayItem } from '../../api/birthdays/retrieve/types'
import DraggableBottomDrawer from '../DraggableBottomDrawer'
import {
  ContentContainer,
  DrawerHeader,
  DrawerHeaderLeft,
  DrawerIconBox,
  DrawerTitle,
  Footer,
  MetaRow,
  NoNotesText,
  NotesText,
  PersonName,
} from './index.styled'

const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December']

interface BirthdayPreviewDrawerProps {
  item: IBirthdayItem | null
  onClose: () => void
  onEdit: (item: IBirthdayItem) => void
  onDelete: (id: string) => void
}

const BirthdayPreviewDrawer = ({ item, onClose, onEdit, onDelete }: BirthdayPreviewDrawerProps) => {
  const handleEdit = useCallback(() => {
    if (!item) return
    onEdit(item)
    onClose()
  }, [item, onEdit, onClose])

  const handleDelete = useCallback(() => {
    if (!item) return
    onDelete(item.id)
    onClose()
  }, [item, onDelete, onClose])

  const birthdayDate = item
    ? `${item.day} ${MONTH_NAMES[item.month - 1]}`
    : ''

  const ageInfo = (() => {
    if (!item?.birthYear) return null
    const today = dayjs()
    const thisYear = today.year()
    const birthdayThisYear = dayjs(`${thisYear}-${String(item.month).padStart(2, '0')}-${String(item.day).padStart(2, '0')}`)
    const isToday = birthdayThisYear.isSame(today, 'day')
    const hasPassed = birthdayThisYear.isBefore(today, 'day')
    const age = thisYear - item.birthYear
    if (isToday) return { label: `${age} today! 🎉`, age }
    if (hasPassed) return { label: `${age} years old`, age }
    return { label: `turns ${age} in ${MONTH_NAMES[item.month - 1]}`, age }
  })()

  return (
    <DraggableBottomDrawer
      open={item !== null}
      onClose={onClose}
      paperSx={{ maxHeight: '80vh' }}
      dragHandleContent={
        <DrawerHeader>
          <DrawerHeaderLeft>
            <DrawerIconBox>
              <CakeIcon />
            </DrawerIconBox>
            <DrawerTitle>Birthday</DrawerTitle>
          </DrawerHeaderLeft>
        </DrawerHeader>
      }
    >
      <ContentContainer>
        <PersonName>{item?.name}</PersonName>

        <MetaRow>
          <CalendarTodayIcon sx={{ fontSize: '1rem' }} />
          {birthdayDate}
          {ageInfo !== null && (
            <span style={{ color: '#db2777', fontWeight: 600 }}>
              · {ageInfo.label}
            </span>
          )}
        </MetaRow>

        {item?.notes ? (
          <NotesText>{item.notes}</NotesText>
        ) : (
          <NoNotesText>No notes</NoNotesText>
        )}
      </ContentContainer>

      <Footer>
        <Button
          variant="contained"
          fullWidth
          startIcon={<EditIcon />}
          onClick={handleEdit}
          sx={{
            background: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
            borderRadius: '10px',
            textTransform: 'none',
            fontWeight: 600,
            py: 1.25,
            boxShadow: 'none',
            '&:hover': { boxShadow: 'none', opacity: 0.9 },
          }}
        >
          Edit
        </Button>
        <Button
          variant="outlined"
          fullWidth
          startIcon={<DeleteIcon />}
          onClick={handleDelete}
          color="error"
          sx={{
            borderRadius: '10px',
            textTransform: 'none',
            fontWeight: 600,
            py: 1.25,
          }}
        >
          Delete
        </Button>
      </Footer>
    </DraggableBottomDrawer>
  )
}

export default BirthdayPreviewDrawer

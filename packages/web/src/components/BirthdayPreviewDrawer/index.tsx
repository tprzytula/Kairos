import DrawerActionButton from '../DrawerActionButton'
import PrivateItemBadge from '../PrivateItemBadge'
import CakeIcon from '@mui/icons-material/Cake'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import dayjs from 'dayjs'
import { IBirthdayItem } from '../../api/birthdays/retrieve/types'
import { usePreviewDrawerActions } from '../../hooks/usePreviewDrawerActions'
import BasePreviewDrawer from '../BasePreviewDrawer'
import {
  BIRTHDAY_GRADIENT,
  ContentContainer,
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
  const { handleEdit, handleDelete } = usePreviewDrawerActions({
    item,
    onEdit,
    onDelete,
    onClose,
  })

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
    <BasePreviewDrawer
      open={item !== null}
      onClose={onClose}
      icon={<CakeIcon />}
      title="Birthday"
      gradient={BIRTHDAY_GRADIENT}
      paperSx={{ maxHeight: '80vh' }}
    >
      <ContentContainer>
        <PersonName>
          {item?.name}
          {item?.visibility === 'private' && <PrivateItemBadge />}
        </PersonName>

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
        <DrawerActionButton
          gradient="linear-gradient(135deg, #ec4899 0%, #db2777 100%)"
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
    </BasePreviewDrawer>
  )
}

export default BirthdayPreviewDrawer

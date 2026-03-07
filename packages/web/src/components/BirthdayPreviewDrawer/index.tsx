import { useCallback, useRef, useState } from 'react'
import { Box, Button, Drawer } from '@mui/material'
import CakeIcon from '@mui/icons-material/Cake'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import dayjs from 'dayjs'
import { IBirthdayItem } from '../../api/birthdays/retrieve/types'
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

const DRAG_CLOSE_THRESHOLD = 100

const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December']

interface BirthdayPreviewDrawerProps {
  item: IBirthdayItem | null
  onClose: () => void
  onEdit: (item: IBirthdayItem) => void
  onDelete: (id: string) => void
}

const BirthdayPreviewDrawer = ({ item, onClose, onEdit, onDelete }: BirthdayPreviewDrawerProps) => {
  const [dragOffset, setDragOffset] = useState(0)
  const isDragging = useRef(false)
  const dragStartY = useRef(0)

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

  const onPointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    isDragging.current = true
    dragStartY.current = e.clientY
    e.currentTarget.setPointerCapture(e.pointerId)
  }, [])

  const onPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging.current) return
    const offset = Math.max(0, e.clientY - dragStartY.current)
    setDragOffset(offset)
  }, [])

  const onPointerUp = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (isDragging.current) {
      const finalOffset = Math.max(0, e.clientY - dragStartY.current)
      if (finalOffset >= DRAG_CLOSE_THRESHOLD) {
        onClose()
      }
    }
    isDragging.current = false
    setDragOffset(0)
  }, [onClose])

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
    <Drawer
      anchor="bottom"
      open={item !== null}
      onClose={onClose}
      transitionDuration={{ enter: 350, exit: 300 }}
      PaperProps={{
        sx: {
          borderRadius: '16px 16px 0 0',
          overflow: 'hidden',
          background: 'transparent',
          maxHeight: '80vh',
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          bgcolor: 'background.paper',
          transform: `translateY(${dragOffset}px)`,
          transition: isDragging.current
            ? 'transform 0s'
            : 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        {/* Drag handle */}
        <Box
          role="button"
          aria-label="Drag to close"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          sx={{
            width: '100%',
            flexShrink: 0,
            cursor: 'grab',
            touchAction: 'none',
            userSelect: 'none',
            '& *': { touchAction: 'none', userSelect: 'none' },
            '&:active': { cursor: 'grabbing' },
          }}
        >
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              pt: '10px',
              pb: '2px',
            }}
          >
            <Box
              sx={{
                width: '36px',
                height: '4px',
                borderRadius: '2px',
                background: 'rgba(0,0,0,0.15)',
              }}
            />
          </Box>
          <DrawerHeader>
            <DrawerHeaderLeft>
              <DrawerIconBox>
                <CakeIcon />
              </DrawerIconBox>
              <DrawerTitle>Birthday</DrawerTitle>
            </DrawerHeaderLeft>
          </DrawerHeader>
        </Box>

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
      </Box>
    </Drawer>
  )
}

export default BirthdayPreviewDrawer

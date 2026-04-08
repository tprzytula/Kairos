import { memo } from 'react'
import {
  Container,
  OfficeIcon,
  AvatarRow,
  UserAvatar,
  OverflowChip,
} from './index.styled'
import { IOfficeAttendanceGroupProps } from './types'

const MAX_VISIBLE_AVATARS = 4

const OfficeAttendanceGroup = memo(
  ({ entries }: IOfficeAttendanceGroupProps) => {
    if (entries.length === 0) return null

    const visible = entries.slice(0, MAX_VISIBLE_AVATARS)
    const overflow = entries.length - MAX_VISIBLE_AVATARS

    return (
      <Container>
        <OfficeIcon />
        <AvatarRow>
          {visible.map((entry) => (
            <UserAvatar key={entry.id} src={entry.userAvatar}>
              {entry.userName.charAt(0).toUpperCase()}
            </UserAvatar>
          ))}
          {overflow > 0 && <OverflowChip label={`+${overflow}`} size="small" />}
        </AvatarRow>
      </Container>
    )
  }
)

OfficeAttendanceGroup.displayName = 'OfficeAttendanceGroup'

export default OfficeAttendanceGroup

import { IBirthday } from '@kairos/shared'

export type BirthdayItem = IBirthday & {
  [key: string]: string | number | undefined
}

export interface CreateBirthdayResponse {
  id: string
}

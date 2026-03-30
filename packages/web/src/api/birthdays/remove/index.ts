import { createDeleteFetcher } from '../../index'

export const removeBirthday = createDeleteFetcher('birthdays/items', 'birthday')

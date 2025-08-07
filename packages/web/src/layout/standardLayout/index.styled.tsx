import { styled } from '@mui/material/styles'

export const Container = styled('div')({
    display: 'flex',
    height: '100%',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'column',
    overflow: 'hidden',
})

interface IContentProps {
    centerVertically?: boolean
}

export const Content = styled('div')<IContentProps>(({ centerVertically }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: centerVertically ? 'center' : 'flex-start',
    width: '100%',
    flex: 1,
    overflow: 'scroll',
}))

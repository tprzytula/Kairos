import { StyledHeader } from "./index.styled"
import { IHeaderProps } from "./types"

const Header = ({ title }: IHeaderProps) => {
  return (
    <StyledHeader>
        {title}
    </StyledHeader>
  )
}

export default Header;

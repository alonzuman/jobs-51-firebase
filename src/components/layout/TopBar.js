import React from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import useTheme from '../../hooks/useTheme'
import useWindowSize from '../../hooks/useWindowSize'

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: ${props => props.disableGutters ? '' : '8px 16px'};
  position: ${props => props.sticky ? 'sticky' : 'relative'};
  top: ${props => props.top}px;
  z-index: 99;
  background-color: ${props => props.background};
  margin-bottom: ${props => props.bottomSpacing ? '8px' : ''};

  @media (max-width: 768px) {
    width: 100%;
  }
`

const TopBar = ({ sticky, bottomSpacing = true, disableGutters = false, children, ...rest }) => {
  const { theme } = useTheme();
  const { windowWidth: width } = useWindowSize()

  return (
    <Container bottomSpacing={bottomSpacing} disableGutters={disableGutters} top={sticky ? width > 768 ? 60 : 0 : ''} sticky={sticky} background={theme?.palette?.background?.main} {...rest}>
      {children}
    </Container>
  )
}

export default TopBar

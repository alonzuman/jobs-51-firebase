import { Button, Typography } from '@material-ui/core'
import React from 'react'
import { useSelector } from 'react-redux'
import Container from '../../components/atoms/Container'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import useCurrentUser from '../../hooks/useCurrentUser'

const TextContainer = styled.div`
  margin-top: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`

const PageDoesntExists = () => {
  const { uid } = useCurrentUser();
  const { translation } = useSelector(state => state.theme);

  return (
    <Container className='flex flex__column align__center justify__center'>
      <TextContainer>
        <Typography variant='h1'>{translation.pageDoesntExists}</Typography>
        <Link to={`/${uid}/activity`}>
          <Button>{translation.backToHome}</Button>
        </Link>
      </TextContainer>
    </Container>
  )
}

export default PageDoesntExists

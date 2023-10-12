import { Card, Flex } from '@pancakeswap/uikit'
import styled from 'styled-components'

export const AppWrapperContainer = styled(Card)`
  flex-shrink: 0;
  height: fit-content;

  ${({ theme }) => theme.mediaQueries.lg} {
    padding: 20px;
    min-width: 620px;
  }
`

export const AppWrapperBody = styled(Flex)`
  flex-direction: column;
  width: 100%;
  padding: 1em;
  gap: 1em;
`

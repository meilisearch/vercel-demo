import { useState } from 'react'
import styled from 'styled-components'

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: linear-gradient(to left, #3e1c6c, #2c075e, #270159);
`

const ContentWrapper = styled.div`
  border-radius: 14px;
  background-color: #111111;
  padding: 16px;
  color: #ffffff;
  width: 26rem;
`

const Title = styled.h1`
  font-size: 1.25rem;
  font-weight: bold;
  text-align: center;
`

const Subtitle = styled.p`
  margin-top: 8px;
  font-size: 0.875rem;
`

const Button = styled.button`
  margin-top: 16px;
  color: #ffffff;
  font-size: 13px;
  font-family: monospace;
  background-color: black;
  border: 1px solid #333333;
  transition: all 0.3s;
  border-radius: 4px;
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;

  &:hover {
    border-color: #ffffff;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

const IndexStatusLink = styled.a`
  font-family: monospace;
  font-size: 0.75rem;
  color: #b8b8b8;
  transition: all 0.3s;

  &:hover {
    color: #ffffff;
    text-decoration: underline;
  }
`

const ErrorText = styled.div`
  margin-top: 16px;
  color: #ff0000;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  space-x: 4px;
  font-weight: bold;
`

export default function DocumentProvisioning() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const onClick = async e => {
    e.preventDefault()

    setIsSubmitting(true)

    const res = await fetch('/api/seed')
    console.log(res)

    if (res.ok) {
      window.location.reload()
      setIsSubmitting(false)
      setError('')
    } else {
      const json = await res.json()

      setError(json.error.message)
      setIsSubmitting(false)
    }
  }

  return (
    <Container>
      <ContentWrapper>
        <Title>Almost ready!</Title>
        <Subtitle>
          It looks like your Meilisearch index does not have any documents yet.
        </Subtitle>
        <Button type="button" onClick={onClick} disabled={isSubmitting}>
          {isSubmitting ? 'Adding documents...' : 'Add documents'}
        </Button>

        <div className="text-center">
          <IndexStatusLink
            href="https://cloud.meilisearch.com/"
            target="_blank"
            rel="noreferrer"
          >
            Check index status
          </IndexStatusLink>
        </div>

        {error && (
          <ErrorText>
            <span>Error:</span>
            {error}
          </ErrorText>
        )}
      </ContentWrapper>
    </Container>
  )
}

import React from 'react'
import styled from 'styled-components'
import Head from 'next/head'
import { InstantSearch, Configure } from 'react-instantsearch-dom'
import { instantMeiliSearch } from '@meilisearch/instant-meilisearch'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { ClientProvider } from 'context/ClientContext'
import get from 'utils/get'
import Header from 'blocks/Header'
import Filters from 'blocks/Filters'
import MoviesList from 'blocks/MoviesList/index'
import { LANGUAGES } from 'data/constants'
import { LanguageProvider } from 'context/LanguageContext'
import useLocalStorage from 'hooks/useLocalStorage'
import DocumentIndexer from 'components/DocumentIndexer'

const MEILISEARCH_URL = process.env.MEILISEARCH_URL || 'http://0.0.0.0:7700'
const MEILISEARCH_SEARCH_KEY = process.env.MEILISEARCH_SEARCH_KEY || 'searchKey'

const Wrapper = styled.div`
  @media (min-width: ${get('breakpoints.desktop')}) {
    padding: 0 50px 50px;
  }
`

const Home = ({ host, apiKey, needsIndexing }) => {
  const [localStorageCountry, setLocalStorageCountry] =
    useLocalStorage('country-preference')
  const { t } = useTranslation('common')
  const [client, setClient] = React.useState(null)
  const [selectedLanguage, setSelectedLanguage] = React.useState(null)
  const [hasDocuments, setHasDocuments] = React.useState(false)

  const setSelectedCountry = React.useCallback(
    country => {
      setSelectedLanguage(country)
      setLocalStorageCountry(country.code)
    },
    [setLocalStorageCountry]
  )

  React.useEffect(() => {
    const preferedLanguage = LANGUAGES.find(e => e.code === localStorageCountry)
    const defaultLanguage = LANGUAGES.find(e => e.code === 'en-US')
    setSelectedLanguage(preferedLanguage || defaultLanguage)
  }, [localStorageCountry])

  React.useEffect(() => {
    if (host && apiKey)
      setClient(
        instantMeiliSearch(host, apiKey, {
          primaryKey: 'id',
          paginationTotalHits: 24,
        })
      )
  }, [host, apiKey])

  React.useEffect(() => {
    fetch('/api/stats')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        return response.json()
      })
      .then(data => {
        data.result === 0 ? setHasDocuments(false) : setHasDocuments(true)
      })
      .catch(error => {
        console.error('Error fetching data:', error)
      })
  })

  if (!host || !apiKey) return <div>{t('connexionFailed')}</div>

  return (
    <ClientProvider value={{ client, setClient, needsIndexing }}>
      <LanguageProvider
        value={{ selectedLanguage, setSelectedLanguage: setSelectedCountry }}
      >
        <Head>
          <title>{t('Meilisearch starter')}</title>
          <meta name="description" content={t('meta.description')} />
        </Head>
        {client &&
          (hasDocuments ? (
            <InstantSearch
              indexName={selectedLanguage.indexName}
              searchClient={client}
            >
              <Configure hitsPerPage={24} />
              <Wrapper>
                <Header />
                <Filters />
                <MoviesList />
              </Wrapper>
            </InstantSearch>
          ) : (
            <DocumentIndexer />
          ))}
      </LanguageProvider>
    </ClientProvider>
  )
}

export const getStaticProps = async ({ locale }) => {
  return {
    props: {
      host: MEILISEARCH_URL,
      apiKey: MEILISEARCH_SEARCH_KEY,

      ...(await serverSideTranslations(locale, ['common'])),
    },
  }
}

export default Home

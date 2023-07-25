import React from 'react'
import Card from 'components/Card'

export default {
  title: 'Components/Card',
  component: Card,
  parameters: {
    layout: 'padded',
  },
}

const Template = args => <Card {...args} />

export const Movie = Template.bind({})
Movie.args = {
  title: 'Batman, The Dark Knight',
  poster_path:
    'https://image.tmdb.org/t/p/w780/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
  release_date: '2008-07-14',
  vote_average: 8.5,
  style: { width: 200 },
}

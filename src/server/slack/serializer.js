'use strict'

const _ = require('lodash')

function serializeSearchResults(query, results) {

  const attachments = _.map(
    results,
    i => {

      let artists = _.map(i.artists, a => a.name)
      artists = artists.join(' ft. ')

      return {
        color: _getRandomColor(),
        author_name: artists,
        thumb_url: i.album.images[0].url,

        title: i.name,
        title_link: i.external_urls.spotify,

        text: `ID --> ${i.id}`
      }
    }
  )
    .slice(0, 5)

  let text = `Here's what we found for: _${query}_`

  if (!attachments.length) {
    text = `Sorry, mate. We couldn't find any results for that :\\`
  }

  return {
    response_type: 'in_channel',
    text,
    attachments
  }
}

function _getRandomColor() {

  const letters = '0123456789ABCDEF'
  let color = '#'
  color += _.times(6, () => letters[Math.floor(Math.random() * 16)]).join('')

  return color
}

module.exports = {
  serializeSearchResults
}

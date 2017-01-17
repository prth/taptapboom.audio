'use strict'

const _ = require('lodash')

function serializeSearchResults(searchResults) {

  const items = searchResults.tracks.items

  return _.map(
    items,
    i => {

      return {
        href: i.href,
        id: i.id,
        name: i.name,
        artists: _.map(i.artists, a => a.name)
      }
    }
  )
}

module.exports = {
  serializeSearchResults
}

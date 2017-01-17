'use strict'

const express = require('express')
const Serializer = require('server/admin/serializer')
const Spotify = require('spotify/app')

const router = express.Router({ mergeParams: true })

router.get('/spotify/search', (req, res) => {
  Spotify.search(req.query.q)
    // .then(Serializer.serializeSearchResults)
    .then(res.json.bind(res))
    .catch(err => res.send(err))
})

module.exports = router

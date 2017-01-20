'use strict'

const express = require('express')

const router = express.Router({ mergeParams: true })
const SpotifyRouter = require('src/server/authorization/spotify')
const SlackRouter = require('src/server/authorization/slack')

router.use('/spotify', SpotifyRouter)
router.use('/slack', SlackRouter)

module.exports = router

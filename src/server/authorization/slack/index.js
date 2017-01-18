'use strict'

const express = require('express')
const _ = require('lodash')
const co = require('bluebird').coroutine
const request = require('request-promise')
const config = require('config')
const Redis = require('db/redis')

const router = express.Router({ mergeParams: true })

router.get('/callback', (req, res) => {

  co(function* () {

    const code = req.query.code
    // TODO: Verify if state received is the state passed via button.
    const state = req.query.state

    const options = {
      uri: 'https://slack.com/api/oauth.access',
      query: {
        code,
        client_id: config.get('slack.clientId'),
        client_secret: config.get('slack.clientSecret')
      }
    }

    const response = yield request(options)
    const accessToken = _.get(response, 'body.access_token')

    yield Redis.set('slack:access_token', accessToken)

    res.sendStatus(200)
  })()
    .catch(err => res.send(err))
})

module.exports = router

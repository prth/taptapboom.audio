'use strict'

const debug = require('debug')('controller-slack')
const express = require('express')
const _ = require('lodash')
const request = require('request-promise')
const co = require('bluebird').coroutine

const Logger = require('src/util/logger')
const Commands = require('src/server/slack/commands')
const Constants = require('src/constants')
const Controller = require('src/server/slack/controller')
const Spotify = require('src/spotify/app')

const router = express.Router({ mergeParams: true })

router.use(Controller.authorizeSlack)

router.post('/command', (req, res) => {
  return co(function* () {

    const text = _.get(req, 'body.text')

    const tokens = text.split(' ')
    const command = tokens.shift()
    const query = tokens.join(' ')

    if (command === 'help' && !query) {
      return _getHelpText(Commands)
    }

    if (Commands[command]) {
      return Commands[command].execute(query, req.body.response_url)
    }

    return `We don't support that yet.`
  })()
    .then(result => {
      res.json({ text: result })
    })
})

router.post('/interactive', (req, res) => {

  return co(function* () {
    const callbackId = req.body.callback_id

    switch (callbackId) {
      case Constants.SLACK.INTERACTIVE.SONG_SEARCH.CALLBACK_ID:

        debug(`CallbackId received: ${Constants.SLACK.INTERACTIVE.SONG_SEARCH.CALLBACK_ID}`)

        const action = _.get(req, 'body.actions')[0]
        debug(`Action received: ${JSON.stringify(action)}`)
        const trackId = action.value
        const track = yield Spotify.getTrackFromId(trackId)
        const trackName = track.name

        res.send({ text: Constants.MESSAGING.WAIT_FOR_IT })

        const result = yield Spotify.addTrackToTargetPlaylist(trackId)

        if (result.status !== Constants.RESULT.STATUS.SUCCESS) {
          return { text: Constants.MESSAGING.UH_OH }
        }

        return { text: Constants.MESSAGING.SPOTIFY.getSONG_SUCCESSFULLY_ADDED(trackName) }

      default:
        Logger.error(`Unsupported callbackId received: ${callbackId}.`)
        return { text: Constants.MESSAGING.UH_OH }
    }
  })()
    .then(res => request({ uri: req.body.response_url, method: 'POST', json: res }))
})

let helpText

function _getHelpText(commands) {

  // if help text response is available in cache, return it
  if (helpText) {
    return helpText
  }

  const texts = []

  for (let commandKey of _.keys(commands)) {
    const command = commands[commandKey]

    // add help text in the format: "`bot command input` text explaining what it does"
    texts.push(`\`/${Constants.BOT_NAME} ${command.getSampleInput()}\` ${command.getHelpText()}`)
  }

  texts.push(`\`/${Constants.BOT_NAME} help\` Lists available commands.`)

  // cache the help text response
  helpText = texts.sort().join('\n')

  return helpText
}

module.exports = router

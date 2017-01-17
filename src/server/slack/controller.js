'use strict'

const _ = require('lodash')
const config = require('config')

function authorizeSlack(req, res, next) {

  const token = _.get(req, 'body.token')

  if (!token || token !== config.get('slack.token')) {
    return next(new Error('Invalid Slack Token!'))
  }

  next()
}

module.exports = {
  authorizeSlack
}

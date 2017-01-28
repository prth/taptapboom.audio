'use strict'

const Promise = require('bluebird')

const COMMAND_KEY = 'ping'

function getSampleInput() {
  return 'ping'
}

function getHelpText() {
  return 'Check the pulse'
}

function execute() {
  return Promise.resolve('pong')
}

module.exports = {
  COMMAND_KEY,
  getSampleInput,
  getHelpText,
  execute
}

'use strict'

import test from 'ava'

const should = require('chai').should()
const ping = require('src/server/slack/commands/ping')

test('getSampleInput() returns sample input for ping command', () => {
  const sampleInput = ping.getSampleInput()

  should.exist(sampleInput)
})

test('getHelpText() returns help text for ping command', () => {
  const helpText = ping.getHelpText()

  should.exist(helpText)
})

test('execute() returns pong for ping command', async () => {
  const pong = await ping.execute()

  should.exist(pong)
  pong.should.equal('pong')
})

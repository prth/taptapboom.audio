'use strict'

import test from 'ava'

const Promise = require('bluebird')
const should = require('chai').should()
const sinon = require('sinon')

const Serializer =  require('src/server/slack/serializer')
const Spotify = require('src/spotify/app')
const request = require('request-promise')

const add = require('src/server/slack/commands/add')

test('COMMAND_KEY must be add', () => {
  add.COMMAND_KEY.should.equal('add')
})

test('getSampleInput() returns sample input for add command', () => {
  const sampleInput = add.getSampleInput()

  should.exist(sampleInput)
})

test('getHelpText() returns help text for add command', () => {
  const helpText = add.getHelpText()

  should.exist(helpText)
})

test('execute() resolves for add command', async () => {
  const spotifySearchStub = sinon.stub(Spotify, 'search')
  spotifySearchStub.returns(Promise.resolve({ items: [] }))

  const serializerStub = sinon.stub(Serializer, 'serializeSearchResults')
  serializerStub.returns(Promise.resolve())

  var requestStub = sinon.stub(request, 'post')
  requestStub.returns(Promise.resolve())

  const query = 'Sa Ni Dha Pa'
  const callbackUrl = 'http://example.com'

  const res = await add.execute(query, callbackUrl)

  should.exist(res)

  spotifySearchStub.calledOnce.should.equal(true)
  spotifySearchStub.calledWith('Sa Ni Dha Pa')

  serializerStub.calledOnce.should.equal(true)
  serializerStub.calledWith('Sa Ni Dha Pa', { items: [] })

  requestStub.calledOnce.should.equal(true)
  requestStub.calledWith({
    url: 'http://example.com',
    json: {}
  })

  spotifySearchStub.restore()
  serializerStub.restore()
  requestStub.restore()
})

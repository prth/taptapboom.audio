'use strict'

import test from 'ava'

const rewire = require('rewire')
const should = require('chai').should()

const SlackRouter = rewire('src/server/slack/router')

test('_getHelpText() returns help text', () => {
  const _getHelpText = SlackRouter.__get__('_getHelpText')

  // unset the help text response cache
  SlackRouter.__set__('helpText', null)

  const commands = {
    cmdZ: {
      COMMAND_KEY: 'zzdZ',
      getSampleInput: () => "zzdZ hello",
      getHelpText: () => "helpZ",
    },
    cmdAB: {
      COMMAND_KEY: 'cmdAB',
      getSampleInput: () => "cmdAB",
      getHelpText: () => "helpAAAAABB",
    }
  }

  const res = _getHelpText(commands)

  should.exist(res)

  // help texts must be sorted alphabetically
  res.should.equal(
    `\`/taptapboom cmdAB\` helpAAAAABB\n` +
    `\`/taptapboom help\` Lists available commands.\n` +
    `\`/taptapboom zzdZ hello\` helpZ`
  )
})

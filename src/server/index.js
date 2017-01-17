'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const config = require('config')

const AuthorizationRouter = require('server/authorization/router')
const AdminRouter = require('server/admin/router')
const SlackRouter = require('server/slack/router')
const Logger = require('util/logger')

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(morgan('dev'))

app.use('', AuthorizationRouter)
app.use('/admin', AdminRouter)
app.use('/slack', SlackRouter)

const port = config.get('server.port')
app.listen(port)
Logger.info(`ExpressJS server running on port: ${port}`)

module.exports = app

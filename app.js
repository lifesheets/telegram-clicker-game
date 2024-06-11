'use strict';

require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const Sequelize = require('sequelize');
const TelegramBot = require('node-telegram-bot-api');
const { logger, createDebug } = require('./system/methods');
const path = require('path');
const https = require('https');
const fs = require('fs');

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });
const sslOptions = {
  key: fs.readFileSync('openssl/server.key'),
  cert: fs.readFileSync('openssl/server.crt')
};

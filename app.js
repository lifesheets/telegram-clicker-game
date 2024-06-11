'use strict'

require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const Sequelize = require('sequelize');
const TelegramBot = require('node-telegram-bot-api');
const { logger, createDebug } = require('./system/methods'); 
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });

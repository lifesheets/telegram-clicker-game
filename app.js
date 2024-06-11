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

const app = express();
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });
const sslOptions = {
  key: fs.readFileSync('openssl/server.key'),
  cert: fs.readFileSync('openssl/server.crt')
};
// Serve the Svelte app
app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
});
bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  const telegramId = msg.from.id;
  const options = {
    reply_markup: {
      inline_keyboard: [
        [{
          text: 'Грати',
          web_app: { url: 'https://dev-clicker.local' }
        }]
      ]
    }
  };
  try {
    await User.findOrCreate({ where: { telegramId } });
    bot.sendMessage(chatId, 'Добро пожаловать в игру кликер! Начните кликать, чтобы зарабатывать монеты.', options);
  } catch (err) {
    logger.error('Error on /start command', err);
    bot.sendMessage(chatId, 'Произошла ошибка при запуске игры.');
  }
});

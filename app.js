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
const debug = createDebug('debug:server');

const VIEW_HOST = process.env.VIEW_HOST;
const VIEW_PORT = process.env.VIEW_PORT ;

const sslOptions = {
  key: fs.readFileSync('openssl/server.key'),
  cert: fs.readFileSync('openssl/server.crt')
};

app.use(helmet());
app.use(express.static('public'));

// Serve the Svelte app
app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
});

// Telegram Bot Setup
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'mysql',
});

const User = sequelize.define('user', {
  telegramId: {
    type: Sequelize.STRING,
    unique: true,
  },
  coins: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
  },
  clicks: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
  },
});

sequelize.sync();

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

bot.onText(/\/click/, async (msg) => {
  const chatId = msg.chat.id;
  const telegramId = msg.from.id;

  try {
    const user = await User.findOne({ where: { telegramId } });
    if (user) {
      user.clicks += 1;
      user.coins += 1;
      await user.save();
      bot.sendMessage(chatId, `Вы кликнули! Теперь у вас ${user.coins} монет.`);
    } else {
      bot.sendMessage(chatId, 'Вам нужно сначала начать игру с помощью команды /start.');
    }
  } catch (err) {
    logger.error('Error on /click command', err);
    bot.sendMessage(chatId, 'Произошла ошибка при клике.');
  }
});

const httpsServer = https.createServer(sslOptions, app);

httpsServer.listen(VIEW_PORT, VIEW_HOST, () => {
  debug(`Server is running at https://${VIEW_HOST}:${VIEW_PORT}`);
  logger.info(`Server is running at https://${VIEW_HOST}:${VIEW_PORT}`);
});

process.once('SIGINT', () => bot.stopPolling());
process.once('SIGTERM', () => bot.stopPolling());

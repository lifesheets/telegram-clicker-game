'use strict'

require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const Sequelize = require('sequelize');
const TelegramBot = require('node-telegram-bot-api');

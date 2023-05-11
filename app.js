require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { errors } = require('celebrate');
const helmet = require('helmet');
// База данных
const mongoose = require('mongoose');
// ПОРТ
const { NODE_ENV, PORT = 3000, DATA_BASE } = process.env;
// РОУТЫ
const routes = require('./routes/index');

// Middlewares
const error = require('./middlewares/error');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const limiter = require('./middlewares/rate-limiter');

const app = express();

// helmet
app.use(helmet());

// BodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB
mongoose.connect(
  NODE_ENV === 'production' ? DATA_BASE : 'mongodb://localhost:27017/bitfilmdb'
);

// логгер запросов
app.use(requestLogger);

app.use(
  cors({
    origin: [
      'http://movies-explorer.yurovdigital.ru',
      'https://movies-explorer.yurovdigital.ru',
      'http://localhost:3000',
      'https://locahost:3000',
    ],
    credentials: true,
    methods: 'GET, PUT, PATCH, POST, DELETE',
    allowedHeaders: ['Content-Type', 'origin', 'Authorization'],
  })
);

// rate limiter
app.use(limiter);

// Подключение роутов
app.use('/api', routes);

// Обработка ошибок
app.use(errorLogger);
app.use(errors());
app.use(error);

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту: ${PORT}`);
});

require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { errors } = require('celebrate');
// База данных
const mongoose = require('mongoose');
// ПОРТ
const { PORT = 3000 } = process.env;
// РОУТЫ
const authRoutes = require('./routes/auth');
const usersRoutes = require('./routes/users');
const moviesRoutes = require('./routes/movies');
// Middlewares
const auth = require('./middlewares/auth');
const error = require('./middlewares/error');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const app = express();

// BodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB
mongoose.connect('mongodb://localhost:27017/bitfilmdb');

// Логгер запросов
app.use(requestLogger);

app.use(
  cors({
    origin: [
      'https://yurov.mesto.nomoredomains.rocks',
      'http://yurov.mesto.nomoredomains.rocks',
      'http://localhost:3000',
    ],
    credentials: true,
    methods: 'GET, PUT, PATCH, POST, DELETE',
    allowedHeaders: ['Content-Type', 'origin', 'Authorization'],
  // eslint-disable-next-line comma-dangle
  })
);

app.use('/', authRoutes);

app.use(auth);

app.use('/', usersRoutes);
app.use('/', moviesRoutes);

// Логгер ошибок
app.use(errorLogger);

app.use(errors());
app.use(error);

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту: ${PORT}`);
});

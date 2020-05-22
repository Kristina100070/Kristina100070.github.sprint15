require('dotenv').config();
/* eslint-disable no-unused-vars */
/* eslint-disable import/order */
const express = require('express');
// const path = require('path')
const router = require('./routes');
const mongoose = require('mongoose');
// eslint-disable-next-line import/no-extraneous-dependencies
const bodyParser = require('body-parser');

const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const BadRequstError = require('./errors/bad-request-err');
const { userCreateValidator, loginValidator } = require('./middlewares/validator');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT } = require('./config/index');

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(requestLogger);
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});
app.post('/signin', loginValidator, login);
app.post('/signup', userCreateValidator, createUser);

app.use(auth);

app.use('/', router);
app.use('*', (req, res) => {
  throw new BadRequstError('Запрашиваемый ресурс не найден');
});
app.use(errorLogger);
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});

// eslint-disable-next-line consistent-return
app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).send({ message: err.message });
  next();
});

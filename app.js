require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const { errors } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { PORT, MONGO_DB } = require('./utils/config');
const centralError = require('./middlewares/centralError');
const routes = require('./routes');

const app = express();

app.use(cors());
app.use(requestLogger);
mongoose.connect(MONGO_DB, { family: 4 });

const limiter = rateLimit({
  max: 160,
  windowMS: 55000,
  message: 'Превышено количество запросов на сервер. Повторить запрос позже',
});

app.use(limiter);
app.use(helmet());
app.use(bodyParser.json());

app.use(routes);

app.use(errorLogger);
app.use(errors());
app.use(centralError);

app.listen(PORT, (err) => {
  if (err) {
    console.log('Ошибка при запуске сервера');
  } else {
    console.log(`Сервер запущен на ${PORT} порту`);
  }
});

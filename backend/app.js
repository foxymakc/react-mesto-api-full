require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const { auth } = require('./middlewares/auth');
const { login, createUser, logout } = require('./controllers/users');
const { loginValidation, createUserValidation } = require('./middlewares/validation');
const ErrorNotFound = require('./errors/ErrorNotFound');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000 } = process.env;
const app = express();

// eslint-disable-next-line no-unused-vars
const corsOptions = {
  origin: ['http://localhost:3000', 'http://domain15pr.chelovskiy.nomoredomains.sbs', 'https://domain15pr.chelovskiy.nomoredomains.sbs'],
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(cookieParser());

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  autoIndex: true,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.post('/signin', loginValidation, login);
app.post('/signup', createUserValidation, createUser);
app.post('/signout', logout);

app.use('/', auth, require('./routes/users'));
app.use('/', auth, require('./routes/cards'));

app.use('*', auth, () => {
  throw new ErrorNotFound('Запрашиваемый ресурс не найден');
});

app.use(errorLogger);

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-template-curly-in-string, no-console
  console.log(`App listening on port ${PORT}`);
});

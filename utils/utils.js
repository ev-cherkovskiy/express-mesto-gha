// Импорт парсера тела запроса
const bodyParser = require('body-parser');
const { isEmail, isURL } = require('validator');
const { NotFoundError } = require('./errors');

// Функция, применяющая к приложению парсинг тела запроса
const applyBodyParser = (app) => {
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
};

// Функция, применяющая к приложению проверку на неправильный путь
const applyIncorrectPathCheck = (app) => {
  app.use((req, res, next) => {
    next(new NotFoundError('Неправильный путь'));
  });
};

const validateURL = (value) => {
  if (!isURL(value, { require_protocol: true })) {
    throw new Error('Неправильный формат ссылки');
  }
  return value;
};

const validateEmail = (value) => {
  if (!isEmail(value, { require_protocol: true })) {
    throw new Error('Неправильный формат почты');
  }
  return value;
};

// Экспорт всех вспомогательных функций
module.exports = {
  applyBodyParser,
  applyIncorrectPathCheck,
  validateURL,
  validateEmail,
};

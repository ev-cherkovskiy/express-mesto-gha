// Импорт парсера тела запроса
const bodyParser = require('body-parser');
// Импорт констант
const {
  VALIDATION_ERROR_CODE,
  NOT_FOUND_ERROR_CODE,
  OTHER_ERROR_CODE
} = require('./constants');

// Функция, применяющая к приложению парсинг тела запроса
const applyBodyParser = (app) => {
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
};

// Функция, применяющая к приложению фиктивную авторизацию
const applyFictitiousAuthorization = (app) => {
  app.use((req, res, next) => {
    req.user = {
      _id: "629773170e9357dd0d53447b"
    };
    next();
  });
};

// Функция, применяющая к приложению проверку на неправильный путь
const applyIncorrectPathCheck = (app) => {
  app.use((req, res) => {
    res
      .status(NOT_FOUND_ERROR_CODE)
      .send({
        message: "Данные не найдены"
      });
  });
};

// Функция, анализирующая ошибки
const analyseError = (res, err) => {
  const errorName = err.name;
  // console.log(errorName);
  if (errorName === "ValidationError" || errorName === "BadRequest" || errorName === "CastError") {
    return res
      .status(VALIDATION_ERROR_CODE)
      .send({
        message: "Переданы некорректные данные"
      });
  };
  if (errorName === "NotFound" || errorName === "ReferenceError") {
    return res
      .status(NOT_FOUND_ERROR_CODE)
      .send({
        message: "Данные не найдены"
      });
  };
  return res
    .status(OTHER_ERROR_CODE)
    .send({
      message: "Возникла ошибка на стороне сервера"
    });
};

// Экспорт всех вспомогательных функций
module.exports = {
  applyBodyParser,
  applyFictitiousAuthorization,
  applyIncorrectPathCheck,
  analyseError
};
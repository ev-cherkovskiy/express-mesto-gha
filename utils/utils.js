const bodyParser = require('body-parser');
const {
  VALIDATION_ERROR_CODE,
  NOT_FOUND_ERROR_CODE,
  OTHER_ERROR_CODE
} = require('./constants');

const applyBodyParser = (app) => {
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
}

const applyFictitiousAuthorization = (app) => {
  app.use((req, res, next) => {
    req.user = {
      _id: "629773170e9357dd0d53447b"
    };

    next();
  });
}

const analyseError = (res, err) => {
  const errorName = err.name;

  if (errorName === "ValidationError" || errorName === "BadRequest") {
    return res
      .status(VALIDATION_ERROR_CODE)
      .send({
        message: "Переданы некорректные данные"
      });
  };

  if (errorName === "NotFound") {
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
}

module.exports = {
  applyBodyParser,
  applyFictitiousAuthorization,
  analyseError
}
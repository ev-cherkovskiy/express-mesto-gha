// Подключение Express и Mongoose
const express = require('express');
const mongoose = require('mongoose');
// Подключение парсера куки
const cookieParser = require('cookie-parser');
// Подключение celebrate
const { errors, Joi, celebrate } = require('celebrate');
// Подключение мидлвэра с авторизацией
const auth = require('./middlewares/auth');

// Импорт функций входа в систему и создания пользователя
const { login, createUser } = require('./controllers/users');
// Импорт вспомогательных функций
const {
  applyBodyParser,
  applyIncorrectPathCheck,
  validateURL,
} = require('./utils/utils');
// Импорт роутов
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');

// Инициация приложения и порта подключения
const app = express();
const { PORT = 3000 } = process.env;
// Подключение БД
mongoose.connect('mongodb://localhost:27017/mestodb');

// Использовать куки парсер
app.use(cookieParser());
// Применить парсер тела запроса
applyBodyParser(app);
// Использовать роутинг для входа в систему
app.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  login,
);
// Использовать роутинг для регистрации
app.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string().custom(validateURL),
    }),
  }),
  createUser,
);
// Использовать мидлвэр с авторизацией
app.use(auth);
// Подключить роутинг, связанный с юзер-запросами
app.use('/users', usersRouter);
// Подключить роутинг, связанный с запросами карточек
app.use('/cards', cardsRouter);
// Применить проверку на неправильный путь
applyIncorrectPathCheck(app);
// Использовать вывод ошибок с помощью celebrate
app.use(errors());
// Использовать централизованный обработчик ошибок
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = (statusCode === 500) ? 'На сервере произошла ошибка' : err.message;
  res.status(statusCode).send({ message });
});

// Запуск приложения
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Приложение запущено на порте ${PORT}`);
});

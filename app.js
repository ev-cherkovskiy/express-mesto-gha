// Подключение Express и Mongoose
const express = require('express');
const mongoose = require('mongoose');
// Подключение парсера куки
const cookieParser = require('cookie-parser');
// Подключение мидлвэра с авторизацией
const auth = require('./middlewares/auth');
// Подключение celebrate
const { errors, Joi, celebrate } = require('celebrate');

// Импорт функций входа в систему и создания пользователя
const { login, createUser } = require('./controllers/users');
// Импорт вспомогательных функций
const {
  applyBodyParser,
  applyIncorrectPathCheck
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
      email: Joi.string().required(),
      password: Joi.string().required().min(6),
    })
  }),
  login
);
// Использовать роутинг для регистрации
app.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required(),
      password: Joi.string().required().min(6),
    })
  }),
  createUser
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

// Запуск приложения
app.listen(PORT, () => {
  console.log(`Приложение запущено на порте ${PORT}`);
});
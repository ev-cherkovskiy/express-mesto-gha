// Подключение Express и Mongoose
const express = require('express');
const mongoose = require('mongoose');

//
const cookieParser = require('cookie-parser');
//
const auth = require('./middlewares/auth');

//
const { errors, Joi, celebrate } = require('celebrate');

// Импорт вспомогательных функций
const {
  applyBodyParser,
  // applyFictitiousAuthorization,
  applyIncorrectPathCheck
} = require('./utils/utils');

// Импорт роутов
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');

//
const { login, createUser } = require('./controllers/users');

// Инициация приложения и порта подключения
const app = express();
const { PORT = 3000 } = process.env;

// Подключение БД
mongoose.connect('mongodb://localhost:27017/mestodb');

//
app.use(cookieParser());

// Обработка запросов
// 1) Применить парсер тела запроса
applyBodyParser(app);

//



// 2) Применить фиктивную авторизацию (временное решение)
// applyFictitiousAuthorization(app);

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

app.use(auth);

// 3) Подключить роутинг, связанный с юзер-запросами
app.use('/users', usersRouter);
// 4) Подключить роутинг, связанный с запросами карточек
app.use('/cards', cardsRouter);
// 5) Применить проверку на неправильный путь
applyIncorrectPathCheck(app);

app.use(errors());


// Запуск приложения
app.listen(PORT, () => {
  console.log(`Приложение запущено на порте ${PORT}`);
});
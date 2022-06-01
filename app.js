const express = require('express');
const mongoose = require('mongoose');

const {
  applyBodyParser,
  applyFictitiousAuthorization,
  applyIncorrectPathCheck
} = require('./utils/utils');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards')

const app = express();
const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/mestodb');

applyBodyParser(app);
applyFictitiousAuthorization(app);
app.use('/users', usersRouter);
app.use('/cards', cardsRouter);
applyIncorrectPathCheck(app);



app.listen(PORT, () => {
  console.log(`Приложение запущено на порте ${PORT}`);
});
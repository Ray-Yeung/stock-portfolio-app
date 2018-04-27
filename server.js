'use strict';

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const passport = require('passport');

const { router: authRouter, localStrategy, jwtStrategy } = require('./auth');
const { router: userRouter } = require('./routes/userRouter');
const { router: stockRouter } = require('./routes/stockRouter');
// const { router: userRouter2 } = require('./routes/userRouter2');
// const { router: userRouter } = require('./routes/userRouter');

const { PORT, CLIENT_ORIGIN } = require('./config');
const { dbConnect } = require('./db-mongoose');
// const {dbConnect} = require('./db-knex');

const app = express();

app.use(
  morgan(process.env.NODE_ENV === 'production' ? 'common' : 'dev', {
    skip: (req, res) => process.env.NODE_ENV === 'test'
  })
);

app.use(
  cors({
    origin: CLIENT_ORIGIN
  })
);

passport.use(localStrategy);
passport.use(jwtStrategy);

app.use('/auth', authRouter);
app.use('/api/stock', userRouter);
app.use('/api', stockRouter);
// app.use('/api', userRouter2);
// app.use('/api/users', userRouter);

function runServer(port = PORT) {
  const server = app
    .listen(port, () => {
      console.info(`App listening on port ${server.address().port}`);
    })
    .on('error', err => {
      console.error('Express failed to start');
      console.error(err);
    });
}

if (require.main === module) {
  dbConnect();
  runServer();
}

module.exports = { app };

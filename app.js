const path = require('path');

const fs = require('fs');
const express = require('express');
const morgan = require('morgan');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');

const app = express();

const requestLogger = require('./utils/requestLogger');

const userRouter = require('./routes/userRoutes.js');
const postRouter = require('./routes/postRoutes.js');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const cors = require('cors');

// user route : /v1/users
// // post route : /v1/posts
// app.use(helmet());
// app.use(mongoSanitize());
app.use(express.json());
app.use(xss());
if (process.env.NODE_ENV === 'development') {
  // console.log('in development');
  app.use(morgan('dev'));
}

app.use(cookieParser());
// if (process.env.NODE_ENV === 'production') {
//   // console.log('in production mode');
// }
// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', '*');
//   res.header(
//     'Access-Control-Allow-Headers',
//     'Origin, X-Requested-With, Content-Type, Accept'
//   );
//   next();
// });

app.use(requestLogger);

app.use(
  cors({
    origin: 'http://localhost:3001',
    credentials: true,
  })
);

app.use(express.static(path.join(__dirname, 'client/build')));

app.use('/api/v1/users', userRouter);
app.use('/api/v1/posts', postRouter);

app.use('*', (req, res, next) => {
  res.sendFile(path.join(__dirname, '/client/build/index.html'));
});

module.exports = app;

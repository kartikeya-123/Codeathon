const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app.js');

dotenv.config({ path: './config.env' });
// const DB = process.env.DATABASE.replace(
//   '<PASSWORD>',
//   process.env.DATABASE_PASSWORD
// );
//setting up connection with hosted DATABASE
// if we want to connect with local database then use proceess.env.DATABASE_LOCAL//
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log('db connection successful');
  });

// connection to the port//
const port = process.env.PORT || 7000;

app.listen(port, () => {
  console.log(`listening to port ${port}`);
});

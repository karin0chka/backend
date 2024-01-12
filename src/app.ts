import express, { Request, Response } from 'express';
import listEndpoints from 'express-list-endpoints';
import 'reflect-metadata';
import './.database/mongo/mongo.config';
import { myDataSource } from './.database/pg/db';
import user_router from './user/user.controller';
import cookieParser from 'cookie-parser';
import authRoute from './auth/auth.controller';
import testingRoute from './testing/testing.controller';
import todoRoute from './todo/todo.controllers';

// import jwt from "jsonwebtoken"
// create and setup express app
const app = express();
app.use(express.json());
app.use(cookieParser());

myDataSource
  .initialize()
  .then(() => {
    console.log('\n💫 DB Connected 💫\n');
  })
  .catch((err) => {
    console.error('\n❌Error during DB initialization:', err);
  });

app.get('/', (_: Request, res: Response) => {
  res.send('Hello from server!');
});

app.use('/user', user_router);
app.use('/auth', authRoute);
app.use('/testing', testingRoute);
app.use('/todo', todoRoute);


// start express server
app.listen(3000, () => {
  console.log('\n\nServer is up 🚀\n');
  console.table(listEndpoints(app));
});

import express, { Request, Response } from 'express';
import listEndpoints from 'express-list-endpoints';
import 'reflect-metadata';
import './.database/mongo/mongo.config';
import { myDataSource } from './.database/pg/db';
import user_router from './user/user.controller';
import cookieParser from 'cookie-parser';
import authRoute from './auth/auth.controler';
import testingRoute from './testing/testing.controller';

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

// register routes
// app.post('/register', async function (req: Request, res: Response) {
//   try {
//     const { first_name, last_name, email, password } = req.body;
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const userRepository = await myDataSource.getRepository(User);
//     const newUser = userRepository.create({
//       first_name,
//       last_name,
//       email,
//       password: hashedPassword,
//     });
//     await userRepository.save(newUser);

//     res.status(201).json({ message: 'User registered successfully' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Registration failed' });
//   }
// });

// app.post('/login' async function (req: Request, res: Response) {
//   try {
//     const { email, password } = req.body;
//     const user = await myDataSource.getRepository(User).findOne(email);

//     if (!user) {
//       return res.status(401).json({ error: 'Authentication failed' });
//     }

//     const passwordMatch = await bcrypt.compare(password, user.password);

//     if (!passwordMatch) {
//       return res.status(401).json({ error: 'Authentication failed' });
//     }
//     return res.status(200).json({ message: 'User is logged in'});
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ error: 'Login failed' });
//   }
// });

// start express server
app.listen(3000, () => {
  console.log('\n\nServer is up 🚀\n');
  console.table(listEndpoints(app));
});

import express, { Request, Response } from 'express';
import { jwtAuth } from '../.middleware/auth.middleware';
import UserService from './user.service';
import asyncHandler from 'express-async-handler';

const user_router = express.Router();
user_router.use(express.json());

user_router.get('/', jwtAuth, (req: Request, res: Response) => {
  //@ts-ignore
  res.send(req.user);
});
user_router.put(
  '/',
  jwtAuth,
  asyncHandler(async (req: Request, res: Response) => {
    //@ts-ignore
    const userId = req.user.id;
    if ('password' in req.body) delete req.body.password;
    await UserService.updateUserInfo(req.body, userId);
    res.send('User info is successfully changed');
  }),
);

user_router.delete(
  '/:id',
  jwtAuth,
  asyncHandler(async (req: Request, res: Response) => {
    //@ts-ignore
    const userId = req.user.id;
    await UserService.deleteUser(userId);
    res.send('User is deleted');
  }),
);
user_router.get(
  '/todos',
  jwtAuth,
  asyncHandler(async (req: Request, res: Response) => {
    //@ts-ignore
    const user = req.user;
    const todos = await UserService.getUserTodos(user.id);
    res.status(200).json({ todos });
  }),
);

export default user_router;

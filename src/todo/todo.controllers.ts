import express, { Request, Response } from 'express';
import TodoService from './todo.service';
import { jwtAuth } from '../.middleware/auth.middleware';
import { isTodoEligible } from '../.middleware/todo.middleware';
import asyncHandler from 'express-async-handler';

const todoRoute = express.Router();
todoRoute.use(express.json());

todoRoute.post(
  '/',
  jwtAuth,
  asyncHandler(async (req: Request, res: Response) => {
    //@ts-ignore
    const user = req.user;
    res.json(await TodoService.createTodo(req.body, user));
  }),
);

todoRoute.put(
  '/:id',
  jwtAuth,
  isTodoEligible,
  asyncHandler(async (req: Request, res: Response) => {
    await TodoService.updateTodo(req.body, +req.params.id);
    res.send('OK');
  }),
);

todoRoute.delete(
  '/:id',
  jwtAuth,
  isTodoEligible,
  asyncHandler(async (req: Request, res: Response) => {
    await TodoService.softDelete(+req.params.id);
    res.send('OK');
  }),
);
export default todoRoute;

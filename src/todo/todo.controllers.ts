import express, { Request, Response } from 'express';
import TodoService from './todo.service';
import { jwtAuth } from '../.middleware/auth.middleware';
import { isTodoEligible } from '../.middleware/todo.middleware';
import asyncHandler from "express-async-handler"

const todoRoute = express.Router();
todoRoute.use(express.json());

todoRoute.post('/', jwtAuth, asyncHandler(async (req: Request, res: Response) => {
  try {
    //@ts-ignore
    const user = req.user;
    res.json(await TodoService.createTodo(req.body, user));
  } catch {
    res.status(500).json({ error: 'Todo is not generated' });
  }
}));

todoRoute.put('/:id', jwtAuth, isTodoEligible, asyncHandler(async (req: Request, res: Response) => {
  try {
    await TodoService.updateTodo(req.body, +req.params.id);
    res.send('OK');
  } catch {
    res.status(500).json({ error: 'Todo is not generated' });
  }
}));

todoRoute.delete('/:id', jwtAuth, isTodoEligible, asyncHandler(async (req: Request, res: Response) => {
  try {
    await TodoService.softDelete(+req.params.id);
    res.send('OK');
  } catch {
    res.status(500).json({ error: 'Todo is not generated' });
  }
}));
export default todoRoute;

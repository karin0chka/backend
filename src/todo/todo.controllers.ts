import express, { Request, Response } from 'express';
import TodoService from './todo.service';
import { jwtAuth } from '../.middleware/auth.middleware';

const todoRoute = express.Router();
todoRoute.use(express.json());

todoRoute.post('/create',jwtAuth, (req: Request, res: Response) => {
  try {
    TodoService.createTodo(req.body, res);
  } catch {
    res.status(500).json({ error: 'Todo is not generated' });
  }
});

todoRoute.post('/delete', (req: Request, res: Response) => {});

todoRoute.post('/update', (req: Request, res: Response) => {});

export default todoRoute;

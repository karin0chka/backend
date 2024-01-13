import Todo from '../.database/pg/.entities/todo.entity';
import { myDataSource } from './../.database/pg/db';
import { NextFunction, Request, Response } from 'express';

export async function isTodoEligible(req: Request, res: Response, next: NextFunction) {
  const id = +req.params.id;
  //@ts-ignore
  const user = req.user;
  const todo = await myDataSource.getRepository(Todo).findOne({ where: { id, user: { id: user.id } }, relations: { user: true } });
  if (todo) {
    next();
  } else {
    res.status(403).send;
  }
}

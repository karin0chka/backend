import { Response } from 'express';
import { ITodo } from '../../interfaces/entities.interface';
import Todo from '../.database/pg/.entities/todo.entity';
import { myDataSource } from '../.database/pg/db';


namespace TodoService {
  export async function createTodo(todoFill: ITodo, res: Response) {
    // use middleware to check if user is auth
    const todoRepository = myDataSource.getRepository(Todo);
    const newTodo = todoRepository.create({
      user:todoFill.user,
      title: todoFill.title,
      description: todoFill.description,
      is_done: todoFill.is_done,
    });
    const todo = await todoRepository.save(newTodo);
    res.json(todo);
  }
}

export default TodoService;

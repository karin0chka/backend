import { ITodo, IUser } from '../../interfaces/entities.interface';
import Todo from '../.database/pg/.entities/todo.entity';
import { myDataSource } from '../.database/pg/db';

namespace TodoService {
  export async function createTodo(todoFill: ITodo, user: IUser) {
    const todoRepository = myDataSource.getRepository(Todo);
    const newTodo = todoRepository.create({
      user: user,
      title: todoFill.title,
      description: todoFill.description,
    });
    return await todoRepository.save(newTodo);
  }

  export async function updateTodo(dto: Partial<ITodo>, id: number) {
    return myDataSource.getRepository(Todo).update(id, dto);
  }
  export async function softDelete(id: number) {
    return myDataSource.getRepository(Todo).softDelete(id);
    
  }

  
}

export default TodoService;

import { ITodo, IUser } from "../../interfaces/entities.interface"
import Todo from "../.database/pg/.entities/todo.entity"
import { myDataSource } from "../.database/pg/db"
import notificationService from "../notification/notification.service"
import { sendNotificationMessage } from "../utils/handlers"

namespace TodoService {
  export async function createTodo(todoFill: Pick<ITodo, "title" | "description">, user: IUser) {
    const todoRepository = myDataSource.getRepository(Todo)
    const newTodo = todoRepository.create({
      user: user,
      title: todoFill.title,
      description: todoFill.description,
    })
    const todo = await todoRepository.save(newTodo)
    const notificaton = await notificationService.create(
      {
        title: "New todo created",
        message: "Hello",
      },
      user
    )

    notificaton.user= undefined
    sendNotificationMessage(user.id, notificaton)
    return todo
  }

  export async function updateTodo(todo: Pick<ITodo, "title" | "description" | "is_done">, id: number) {
    return await myDataSource.getRepository(Todo).update(id, todo)
  }

  export async function softDelete(id: number) {
    return await myDataSource.getRepository(Todo).softDelete(id)
  }
}

export default TodoService

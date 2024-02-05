import { NextFunction, Request, Response } from "express"
import Todo from "../.database/pg/.entities/todo.entity"
import { AppError } from "../utils/errorHandler"
import { myDataSource } from "./../.database/pg/db"

async function isTodoEligible ( req: Request, res: Response, next: NextFunction){
  console.log("🚀 ~ isTodoEligible ~ req:", req)
  const id = +req.params.id
  //@ts-ignore
  const user = req.user
  const todo = await myDataSource.getRepository(Todo).findOne({ where: { id, user: { id: user.id } }, relations: { user: true } })
  console.log(todo)
  try {
    if (todo) {
      next()
    }
  } catch (error) {
    next(new AppError("Sorry, you are not eligible", 403))
  }
}

export { isTodoEligible }


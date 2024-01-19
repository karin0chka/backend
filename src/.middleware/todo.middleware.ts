import Todo from "../.database/pg/.entities/todo.entity"
import { AppError, catchWrapper } from "../utils/errorHandler"
import { myDataSource } from "./../.database/pg/db"
import { NextFunction, Request, Response } from "express"

const isTodoEligible = catchWrapper(async (error: Error, req: Request, res: Response, next: NextFunction) => {
  const id = +req.params.id
  //@ts-ignore
  const user = req.user
  const todo = await myDataSource.getRepository(Todo).findOne({ where: { id, user: { id: user.id } }, relations: { user: true } })
  try {
    if (todo) {
      console.log("I am here todo exist")
      next()
    }
  } catch (error) {
    throw new AppError("Sorry, you are not eligible", 401)
  }
})

export { isTodoEligible }

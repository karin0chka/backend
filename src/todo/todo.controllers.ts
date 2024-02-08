import express, { Request, Response } from "express"
import TodoService from "./todo.service"
import { jwtAuth } from "../.middleware/auth.middleware"
import { isTodoEligible } from "../.middleware/todo.middleware"
import { catchWrapper } from "../utils/errorHandler"
import { logger } from "../utils/winston.createLogger"

const todoRoute = express.Router()
todoRoute.use(express.json())

todoRoute.post(
  "/",
  jwtAuth,
  catchWrapper(async (req: Request, res: Response) => {
    logger.info(`Todo is created with: ${JSON.stringify(req.body)}`, "create todo router")
    //@ts-ignore
    const user = req.user
    const { title, description } = req.body
    res.json(await TodoService.createTodo({ title, description }, user))
  })
)

todoRoute.put(
  "/:id",
  jwtAuth,
  isTodoEligible,
  catchWrapper(async (req: Request, res: Response) => {
    const { title, description, is_done } = req.body
    console.log(+req.params.id)
    console.log("🚀 ~ catchWrapper ~ ", title, description, is_done)
    await TodoService.updateTodo({ title, description, is_done }, +req.params.id)
    logger.info(`Todo was updated with: ${JSON.stringify({ title, description, is_done })}`, "update todo router")
    res.send("OK")
  })
)

todoRoute.delete(
  "/:id",
  jwtAuth,
  isTodoEligible,
  catchWrapper(async (req: Request, res: Response) => {
    console.log(+req.params.id)
    await TodoService.softDelete(+req.params.id)
    logger.info(`Todo was deleted: ${JSON.stringify(+req.params.id)}`, "delete todo router")
    res.send("OK")
  })
)
export default todoRoute

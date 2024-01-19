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
    res.json(await TodoService.createTodo(req.body, user))
  })
)

todoRoute.put(
  "/:id",
  jwtAuth,
  isTodoEligible,
  catchWrapper(async (req: Request, res: Response) => {
    logger.info(`Todo was updated with: ${JSON.stringify(req.body)}`, "update todo router")
    await TodoService.updateTodo(req.body, +req.params.id)
    res.send("OK")
  })
)

todoRoute.delete(
  "/:id",
  jwtAuth,
  isTodoEligible,
  catchWrapper(async (req: Request, res: Response) => {
    logger.info(`Todo was deleted: ${JSON.stringify(req.body)}`, "delete todo router")
    await TodoService.softDelete(+req.params.id)
    res.send("OK")
  })
)
export default todoRoute

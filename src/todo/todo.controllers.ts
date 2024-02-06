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
    logger.info(`Todo was updated with: ${JSON.stringify(req.body)}`, "update todo router")
    const { title, description } = req.body
    console.log(+req.params.id)
    console.log("🚀 ~ catchWrapper ~ ", title, description)
    await TodoService.updateTodo({ title, description }, +req.params.id)
    res.send("OK")
  })
)

todoRoute.put(
  "/:id",
  jwtAuth,
  isTodoEligible,
  catchWrapper(async (req: Request, res: Response) => {
    logger.info(`Todo is done: ${JSON.stringify(req.body)}`, "is_done todo router")
    console.log(+req.params.id)
    const { is_done } = req.body
    await TodoService.isDoneTodo({ is_done }, +req.params.id)
    res.send("Todo is done")
  })
)

todoRoute.delete(
  "/:id",
  jwtAuth,
  isTodoEligible,
  catchWrapper(async (req: Request, res: Response) => {
    logger.info(`Todo was deleted: ${JSON.stringify(req.body)}`, "delete todo router")
    console.log(+req.params.id)
    await TodoService.softDelete(+req.params.id)
    res.send("OK")
  })
)
export default todoRoute

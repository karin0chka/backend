import express, { Request, Response } from "express"
import { jwtAuth } from "../.middleware/auth.middleware"
import { catchWrapper } from "../utils/errorHandler"
import { notificationEvent } from "../utils/handlers"
import { logger } from "../utils/winston.createLogger"
import NotificationService from "./notification.service"

const notificationRoute = express.Router()

notificationRoute.get(
  "/connect",
  jwtAuth,
  catchWrapper((req: Request, res: Response) => {
    //@ts-ignore
    const user = req.user
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      Connection: "keep-alive",
      "Cache-Control": "no-cache",
    })
    res.write("\n")

    const handleNotification = (message: string) => {
      if (message) {
        res.write(`data: ${JSON.stringify({ message })}\n\n`)
      } else {
        console.error("error")
        res.write("Sorry something went wrong")
      }
    }
    notificationEvent.on(`notification-user-${user.id}`, handleNotification)

    req.on("close", () => {
      notificationEvent.off(`notification-user-${user.id}`, handleNotification)
      logger.info(`Connection closed`, "notification router")
    })

    logger.info(`Connection is established`, "notification router")
  })
)
notificationRoute.post(
  "/create",
  jwtAuth,
  catchWrapper((req: Request, res: Response) => {
    //@ts-ignore
    const user = req.user
    const { title, message, is_read } = req.body
    NotificationService.create({ title, message, is_read }, user)
    res.status(200)
  })
)

notificationRoute.put(
  "/update/:id",
  jwtAuth,
  catchWrapper((req: Request, res: Response) => {
    const { title, message, is_read } = req.body
    NotificationService.update({ title, message, is_read }, +req.params.id)
    res.status(200)
  })
)

notificationRoute.delete(
  "/delete/:id",
  jwtAuth,
  catchWrapper((req: Request, res: Response) => {
    NotificationService.softDelete(+req.params.id)
    res.status(200)
  })
)

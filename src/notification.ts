import express, { Request, Response } from "express"
import { catchWrapper } from "./utils/errorHandler"
import { logger } from "./utils/winston.createLogger"
import { EventEmitter } from "events"
import { jwtAuth } from "./.middleware/auth.middleware"

const notificationRoute = express.Router()
const notificationEvent = new EventEmitter()

notificationRoute.get(
  "/",
  jwtAuth,
  catchWrapper((req: Request, res: Response) => {
    //@ts-ignore
    const user = req.user
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      Connection: "keep-alive",
      "Cache-Control": "no-cache",
    })
    res.write('\n')

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
notificationRoute.get("/send-message", jwtAuth,(req: Request, res: Response) => {
  //@ts-ignore
  const user = req.user

  const message = "This event is triggered"
  notificationEvent.emit(`notification-user-${user.id}`, message)
  res.status(200).json({ message })
  logger.info(`Message sent: ${message}`, "send-message router")
})

export default notificationRoute

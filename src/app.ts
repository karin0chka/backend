import express, { Request, Response } from "express"
import listEndpoints from "express-list-endpoints"
import "reflect-metadata"
import "./.database/mongo/mongo.config"
import { myDataSource } from "./.database/pg/db"
import user_router from "./user/user.controller"
import cookieParser from "cookie-parser"
import authRoute from "./auth/auth.controller"
import notificationRoute from "./notification/notification"
import testingRoute from "./testing/testing.controller"
import todoRoute from "./todo/todo.controllers"
import helmet from "helmet"
import cors from "cors"
import rateLimit from "express-rate-limit"
import { logger } from "./utils/winston.createLogger"
import { errorHandler } from "./utils/errorHandler"
import reportRoute from "./report/report.controller"
import config from "./utils/config"

// import jwt from "jsonwebtoken"
// create and setup express app
const app = express()
app.use(express.json())
app.use(cookieParser())
app.use(helmet())
//TODO spesify origin
const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
  optionSuccessStatus: 200,
}
app.use(cors(corsOptions))

const limiter = rateLimit({
  windowMs: 2 * 60 * 1000,
  max: 20,
  message: "Sorry, too many requests(try again after 2 min)",
})
app.use(limiter)

myDataSource
  .initialize()
  .then(() => {
    logger.info("\n💫 DB Connected 💫\n")
  })
  .catch((err) => {
    logger.error("\n❌Error during DB initialization:", err)
  })

app.get("/", (_: Request, res: Response) => {
  res.send("Hello from server!")
})
app.get("/health", (_: Request, res: Response) => {
  res.status(200).send("Connected")
})
app.use("/user", user_router)
app.use("/auth", authRoute)
app.use("/testing", testingRoute)
app.use("/todo", todoRoute)
app.use("/report", reportRoute)
app.use("/notification", notificationRoute)

app.use(errorHandler)

// start express server
app.listen(config.SERVER.PORT, () => {
  logger.info(`Server is up 🚀 ${config.SERVER.PORT}`, "CoreApp")
  console.table(listEndpoints(app))
})

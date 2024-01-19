import cookieParser from "cookie-parser"
import express, { Request, Response } from "express"
import Report from "../.database/mongo/schemas/report.schema"
import { isUserAnAdmin, jwtAuth } from "../.middleware/auth.middleware"
import ReportService from "./report.service"
import { IReport } from "../../interfaces/entities.interface"
import { logger } from "../utils/winston.createLogger"
import { catchWrapper } from "../utils/errorHandler"

const reportRoute = express.Router()
reportRoute.use(express.json())
reportRoute.use(cookieParser())

reportRoute.post(
  "/create",
  jwtAuth,
  catchWrapper(async (req: Request, res: Response) => {
    //@ts-ignore
    const user = req.user
    const report = await ReportService.createReport(req.body, user.id)
    res.status(200).json({ report })
  })
)

reportRoute.get(
  "/read/:id",
  jwtAuth,
  isUserAnAdmin,
  catchWrapper(async (req: Request, res: Response) => {
    const reportId = req.params.id
    const report = await Report.findOne({ _id: reportId })
    res.json(report)
  })
)

reportRoute.put(
  "/update/:id",
  catchWrapper(async (req: Request, res: Response) => {
    const reportId = req.params.id
    logger.info(`Updating report:${reportId}`)
    const dto: Partial<IReport> = {
      is_reviewed: req.body.is_reviewed || false,
      is_completed: req.body.is_completed || false,
    }

    const report = await Report.updateOne({ _id: reportId }, { $set: dto })
    res.json(report)
  })
)

export default reportRoute

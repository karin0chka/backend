import cookieParser from 'cookie-parser';
import express, { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import Report from '../.database/mongo/schemas/report.schema';
import { isUserAnAdmin, jwtAuth } from '../.middleware/auth.middleware';
import ReportService from './report.service';

const reportRoute = express.Router();
reportRoute.use(express.json());
reportRoute.use(cookieParser());

reportRoute.post(
  '/create',
  jwtAuth,
  asyncHandler(async (req: Request, res: Response) => {
    //@ts-ignore
    const user = req.user;
    const report = await ReportService.createReport(req.body, user.id);
    res.status(200).json({ report });
  }),
);

reportRoute.get(
  '/read/:id',
  jwtAuth,
  isUserAnAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const userId = +req.params.id;

    const report = await Report.updateMany({ id: userId, is_reviewed: false }, { $set: { is_reviewed: true } });
    res.json({ report });
  }),
);

reportRoute.put(
  '/update/:id',
  jwtAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const userId = +req.params.id;
    const report = await Report.updateMany({ user_id: userId, is_completed: false }, { $set: { is_completed: true } });
    res.json({ report });
  }),
);

export default reportRoute;

import cookieParser from "cookie-parser"
import express, { Request, Response } from "express"
import { jwtAuth, jwtRefresh } from "../.middleware/auth.middleware"
import AuthService from "./auth.service"
import { logger } from "../utils/winston.createLogger"
import { catchWrapper } from "../utils/errorHandler"

// import { jwtRefresh } from '../.middleware/auth.middleware';

const authRoute = express.Router()
authRoute.use(express.json())
authRoute.use(cookieParser())

authRoute.post(
  "/register",
  catchWrapper(async (req: Request, res: Response) => {
    logger.info(`User is registering with data: ${JSON.stringify(req.body)}`, "register router")
    const userInfo = await AuthService.register(req.body, res)
    res.setHeader("Set-Cookie", userInfo.cookies)
    res.json(userInfo.user)
  })
)

authRoute.post(
  "/login",
  catchWrapper(async (req: Request, res: Response) => {
    logger.info(`User is loged in with data: ${JSON.stringify(req.body)}`, "login router")
    const loginUser = await AuthService.login(req)
    res.setHeader("Set-Cookie", loginUser.cookies)
    res.json(loginUser.user)
  })
)
// Create refresh middleware and put it bellow
authRoute.post(
  "/refresh",
  jwtRefresh,
  catchWrapper(async (req: Request, res: Response) => {
    // create authJWT & refreshJWT
    // set both cookies
    logger.info(`User token is refreshed with data: ${JSON.stringify(req.body)}`, "refreshed router")
    //@ts-ignore
    const user = req.user
    const cookies = AuthService.validateRefreshAndGenerateCookies(req, user)
    res.setHeader("Set-Cookie", await cookies)

    res.status(200).send("Refresh successful")
  })
)
authRoute.post(
  "/log-out",
  jwtAuth,
  catchWrapper(async (req: Request, res: Response) => {
    logger.info(`User is loged-out: ${JSON.stringify(req.body)}`, "log-out router")
    //@ts-ignore
    const user = req.user
    AuthService.deleteUserRefreshToken(user.id)
    res.setHeader("Set-Cookie", "").send()
  })
)
authRoute.get(
  "/change-password",
  jwtAuth,
  catchWrapper(async (req: Request, res: Response) => {
    logger.info(`User has change his password: ${JSON.stringify(req.body)}`, "change-password router")
    //@ts-ignore
    const user = req.user
    await AuthService.changePassword(req, user)
    res.status(200).send("Your password is successfully changed")
  })
)

export default authRoute

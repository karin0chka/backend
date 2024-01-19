import { NextFunction, Request, Response } from "express"
import { IUser } from "../../interfaces/entities.interface"
import { UserType } from "../../interfaces/enums"
import AuthService from "../auth/auth.service"
import UserService from "../user/user.service"
import { AppError } from "../utils/errorHandler"

export async function jwtAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies["Authentication"]
  if (!token) {
    res.status(401).send()
  }
  try {
    const payload = AuthService.verifyAuthToken(token)
    const user = await UserService.findOneOrFail({ where: { id: payload.userID } })
    // @ts-ignore
    req.user = user
    next()
  } catch {
    res.status(401).send()
  }
}

const jwtRefresh = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies["Refresh"]
  if (!token) {
    throw new AppError("Access denied", 401)
  } else {
    try {
      const payload = AuthService.verifyRefreshToken(token)
      const user = await UserService.findOneOrFail({ where: { id: payload.userID } })
      // @ts-ignore
      req.user = user
      next()
    } catch {
      throw new AppError("Access denied", 401)
    }
  }
}

const isUserAnAdmin = async (req: Request, res: Response, next: NextFunction) => {
  //@ts-ignore
  const user = req.user as IUser
  if (user && user.user_type === UserType.ADMIN) {
    next()
  } else {
    throw new AppError("Access denied", 401)
  }
}

export { isUserAnAdmin, jwtRefresh }

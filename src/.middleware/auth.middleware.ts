import bcrypt from "bcrypt"
import { NextFunction, Request, Response } from "express"
import { IUser } from "../../interfaces/entities.interface"
import { UserType } from "../../interfaces/enums"
import AuthService from "../auth/auth.service"
import UserService from "../user/user.service"
import { AppError } from "../utils/errorHandler"

async function jwtAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies["Authentication"]
  if (!token) {
    next(new AppError("Access denied", 401))
  } else {
    try {
      const payload = AuthService.verifyAuthToken(token)
      const user = await UserService.findOneOrFail({ where: { id: payload.userID } })
      // @ts-ignore
      req.user = user
      next()
    } catch (error) {
      next(new AppError("Access denied", 401))
    }
  }
}

async function jwtRefresh(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies["Refresh"]
  if (!token) {
    next(new AppError("Access denied", 401))
  }
  try {
    const payload = AuthService.verifyRefreshToken(token)
    const user = await UserService.findOneOrFail({ where: { id: payload.userID } })
    const compareToken = await bcrypt.compare(token, user.refresh_token)
    if (!compareToken) {
      next(new AppError("Access denied", 401))
    }
    // @ts-ignore
    req.user = user
    next()
  } catch {
    next(new AppError("Access denied", 401))
  }
}

async function isUserAnAdmin(req: Request, res: Response, next: NextFunction) {
  //@ts-ignore
  const user = req.user as IUser
  if (user && user.user_type === UserType.ADMIN) {
    next()
  } else {
    next(new AppError("Access denied", 401))
  }
}

export { isUserAnAdmin, jwtAuth, jwtRefresh }

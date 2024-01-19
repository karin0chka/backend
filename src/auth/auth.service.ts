import bcrypt from "bcrypt"
import { Request, Response } from "express"
import jwt from "jsonwebtoken"
import { IUser } from "../../interfaces/entities.interface"
import User from "../.database/pg/.entities/user.entity"
import { myDataSource } from "../.database/pg/db"
import UserService from "../user/user.service"
import config from "../utils/config"
import { AppError } from "../utils/errorHandler"
import { UserType } from "../../interfaces/enums"

const jwtSecret = config.JWT.JWT_SECRET
const jwtRefreshSecret = config.JWT.JWT_REFRESH_SECRET

namespace AuthService {
  export function generateJwtToken(userID: number) {
    const data = {
      userID: userID,
    }
    const validFor = { expiresIn: "1h" }
    return jwt.sign(data, jwtSecret, validFor)
  }

  export function generateRefreshToken(userID: number) {
    const data = {
      userID: userID,
    }
    const validFor = { expiresIn: "3d" }
    return jwt.sign(data, jwtRefreshSecret, validFor)
  }
  export function generateRefreshCookie(token: string) {
    const secureText = config.SERVER.NODE_TYPE === "development" ? "" : "secure"

    const domain = config.SERVER.NODE_TYPE === "development" ? "localhost" : ".mydomain"
    return `Refresh=${token}; HttpOnly; Path=/; Max-Age=${config.JWT.JWT_REFRESH_EXPIRE_TIME}; domain=${domain}; SameSite=Lax; ${secureText};`
  }

  export function generateAuthCookie(token: string) {
    const secureText = config.SERVER.NODE_TYPE === "development" ? "" : "secure"

    const domain = config.SERVER.NODE_TYPE === "development" ? "localhost" : ".mydomain"
    return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${config.JWT.JWT_EXPIRE_TIME}; domain=${domain}; SameSite=Lax; ${secureText};`
  }

  export function verifyAuthToken(token: string) {
    return jwt.verify(token, jwtSecret) as { userID: number }
  }
  export function verifyRefreshToken(token: string) {
    return jwt.verify(token, jwtRefreshSecret) as { userID: number }
  }

  export async function register(userDto: Omit<IUser, "id" | "created_at" | "updated_at" | "deleted_at">, res: Response) {
    const existingUser = await UserService.findOne({ where: { email: userDto.email.toLowerCase() } })
    if (existingUser) {
      throw new AppError("User alredy exist", 400)
    } else {
      const hashedPassword = await bcrypt.hash(userDto.password, 10)
      const userRepository = myDataSource.getRepository(User)
      const newUser = userRepository.create({
        first_name: userDto.first_name,
        last_name: userDto.last_name,
        email: userDto.email.toLowerCase(),
        password: hashedPassword,
        refresh_token: "",
        user_type: UserType.CLIENT,
      })
      const user = await userRepository.save(newUser)
      const authToken = generateJwtToken(user.id)
      const refreshToken = generateRefreshToken(user.id)

      user.refresh_token = await bcrypt.hash(refreshToken, 10)

      await userRepository.save(user)

      const authCookies = generateAuthCookie(authToken)
      const refreshCookie = generateRefreshCookie(refreshToken)
      return { user, cookies: [authCookies, refreshCookie] }
    }
  }

  export async function login(req: Request) {
    type loginData = {
      email: string
      password: string
    }
    const loginData: loginData = { email: req.body.email, password: req.body.password }
    const user = await UserService.findOneOrFail({ where: { email: loginData.email } })
    const passwordMatch = await bcrypt.compare(loginData.password, user.password)
    if (!passwordMatch) throw new AppError("Authentication failed", 401)

    const authToken = generateJwtToken(user.id)
    const refreshToken = generateRefreshToken(user.id)
    const userRepository = myDataSource.getRepository(User)
    const hashedJwt = await bcrypt.hash(refreshToken, 10)
    await userRepository.update(user.id, { refresh_token: hashedJwt })
    const authCookies = generateAuthCookie(authToken)
    const refreshCookie = generateRefreshCookie(refreshToken)
    return { user, cookies: [authCookies, refreshCookie] }
  }

  export async function deleteUserRefreshToken(userID: number) {
    const userDB = myDataSource.getRepository(User)
    const user = await userDB.findOne({ where: { id: userID } })
    await userDB.update(user!.refresh_token, { refresh_token: "" })
  }
  export async function validateRefreshAndGenerateCookies(req: Request, user: IUser) {
    const token = req.cookies["Refresh"]
    const jwtRefreshMatch = await bcrypt.compare(token, user.refresh_token)
    if (jwtRefreshMatch) {
      const newAccessToken = AuthService.generateJwtToken(req.body.userID)
      const newRefreshToken = AuthService.generateRefreshToken(req.body.userID)

      const authCookie = AuthService.generateAuthCookie(newAccessToken)
      const refreshCookie = AuthService.generateRefreshCookie(newRefreshToken)
      return [authCookie, refreshCookie]
    } else {
      throw new AppError("Token refresh failed", 400)
    }
  }
  export async function changePassword(req: Request, user: IUser) {
    const isPasswordMatch = await bcrypt.compare(req.body.oldPassword, user.password)
    if (isPasswordMatch) {
      const userRepository = myDataSource.getRepository(User)
      const newPassword = await bcrypt.hash(req.body.newPassword, 10)
      await userRepository.update(user.id, { password: newPassword })
    } else {
      throw new AppError("Password do not match", 401)
    }
  }
}

export default AuthService

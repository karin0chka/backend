import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { IUser } from "../../interfaces/entities.interface"
import { UserType } from "../../interfaces/enums"
import Todo from "../.database/pg/.entities/todo.entity"
import User from "../.database/pg/.entities/user.entity"
import { myDataSource } from "../.database/pg/db"
import UserService from "../user/user.service"
import config from "../utils/config"
import { AppError } from "../utils/errorHandler"

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

  export async function register(userDto: Omit<IUser, "id" | "created_at" | "updated_at" | "deleted_at">) {
    const existingUser = await UserService.findOne({ where: { email: userDto.email.toLowerCase() } })
    if (existingUser) {
      throw new AppError("User alredy exist", 400)
    } else {
      const hashedPassword = await bcrypt.hash(userDto.password, 10)
      //   const userRepository = myDataSource.getRepository(User)
      return await myDataSource.transaction(async (entityManager) => {
        const user = await entityManager.save(
          User,
          entityManager.create(User, {
            first_name: userDto.first_name,
            last_name: userDto.last_name,
            email: userDto.email.toLowerCase(),
            password: hashedPassword,
            refresh_token: "",
            user_type: UserType.CLIENT,
          })
        )
        await entityManager.save(
          Todo,
          entityManager.create(Todo, {
            user,
            title: "Your first todo",
            description: "Just click done",
          })
        )

        const authToken = generateJwtToken(user.id)
        const refreshToken = generateRefreshToken(user.id)

        user.refresh_token = await bcrypt.hash(refreshToken, 10)

        await entityManager.save(User, user)

        const authCookies = generateAuthCookie(authToken)
        const refreshCookie = generateRefreshCookie(refreshToken)
        return { user, cookies: [authCookies, refreshCookie] }
      })
    }
  }

  export async function login(email: string, password: string) {
    type loginData = {
      email: string
      password: string
    }
    const loginData: loginData = { email: email, password: password }
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
    await userDB.update(userID, { refresh_token: null })
  }
  export async function generateAuthAndRefreshCookie(user: IUser) {
    const newAccessToken = AuthService.generateJwtToken(user.id)
    const newRefreshToken = AuthService.generateRefreshToken(user.id)
    const authCookie = AuthService.generateAuthCookie(newAccessToken)
    const refreshCookie = AuthService.generateRefreshCookie(newRefreshToken)
    return [authCookie, refreshCookie]
  }
  export async function changePassword(oldPassword: string, newPassword: string, user: IUser) {
    const isPasswordMatch = await bcrypt.compare(oldPassword, user.password)
    if (isPasswordMatch) {
      const userRepository = myDataSource.getRepository(User)
      const updatePassword = await bcrypt.hash(newPassword, 10)
      await userRepository.update(user.id, { password: updatePassword })
    } else {
      throw new AppError("Password do not match", 401)
    }
  }
}

export default AuthService

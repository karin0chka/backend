import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { IUser } from '../../interfaces/entities.interface';
import User from '../.database/pg/.entities/user.entity';
import { myDataSource } from '../.database/pg/db';
import UserService from '../user/user.service';
import config from '../utils/config';

const jwtSecret = config.JWT.JWT_SECRET;
const jwtRefreshSecret = config.JWT.JWT_REFRESH_SECRET;

namespace AuthService {
  export function generateJwtToken(userID: number) {
    const data = {
      userID: userID,
    };
    const validFor = { expiresIn: '1h' };
    return jwt.sign(data, jwtSecret, validFor);
  }

  export function generateRefreshToken(userID: number, res: Response) {
    const data = {
      userID: userID,
    };
    const validFor = { expiresIn: '3d' };
    return jwt.sign(data, jwtRefreshSecret, validFor);
  }
  export function generateRefreshCookie(token: string) {
    const secureText = config.SERVER.NODE_TYPE === 'development' ? '' : 'secure';

    const domain = config.SERVER.NODE_TYPE === 'development' ? 'localhost' : '.mydomain';
    return `Refresh=${token}; HttpOnly; Path=/; Max-Age=${config.JWT.JWT_REFRESH_EXPIRE_TIME}; domain=${domain}; SameSite=Lax; ${secureText};`;
  }

  export function generateAuthCookie(token: string) {
    const secureText = config.SERVER.NODE_TYPE === 'development' ? '' : 'secure';

    const domain = config.SERVER.NODE_TYPE === 'development' ? 'localhost' : '.mydomain';
    return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${config.JWT.JWT_EXPIRE_TIME}; domain=${domain}; SameSite=Lax; ${secureText};`;
  }

  export function verifyAuthToken(token: string) {
    return jwt.verify(token, jwtSecret) as { userID: number };
  }
  export function verifyRefreshToken(token: string) {
    return jwt.verify(token, jwtRefreshSecret) as { userID: number };
  }

  export async function register(userDto: Omit<IUser, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>, res: Response) {
    const existingUser = await UserService.findOne({ where: { email: userDto.email.toLowerCase() } });
    if (existingUser) {
      res.status(400).json({ error: 'User already exists' });
    } else {
      const hashedPassword = await bcrypt.hash(userDto.password, 10);
      const userRepository = myDataSource.getRepository(User);
      const newUser = userRepository.create({
        first_name: userDto.first_name,
        last_name: userDto.last_name,
        email: userDto.email,
        password: hashedPassword,
      });
      const user = await userRepository.save(newUser);
      const token = AuthService.generateJwtToken(user.id);
      const cookies = generateAuthCookie(token);
      res.setHeader('Set-Cookie', cookies);
      res.json(user);
    }
  }

  export async function login(req: Request, res: Response) {
    type loginData = {
      email: string;
      password: string;
    };
    const loginData: loginData = { email: req.body.email, password: req.body.password };
    const user = await UserService.findOne({ where: { email: loginData.email } });
    const passwordMatch = await bcrypt.compare(loginData.password, user.password);
    if (!user || !passwordMatch) {
      res.status(401).json({ error: 'Authentication failed' });
    } else {
      const token = AuthService.generateJwtToken(user.id);
      const cookies = generateAuthCookie(token);
      res.setHeader('Set-Cookie', cookies);
      res.json(user);
    }
  }
}

export default AuthService;

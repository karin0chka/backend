import { NextFunction, Request, Response } from 'express';
import AuthService from '../auth/auth.service';
import { AppError } from '../errorHandler';
import UserService from '../user/user.service';

export async function jwtAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies['Authentication'];
  if (!token) {
    res.status(401).send();
  }
  try {
    const payload = AuthService.verifyAuthToken(token);
    const user = await UserService.findOneOrFail({ where: { id: payload.userID } });
    // @ts-ignore
    req.user = user;
    next();
  } catch {
    res.status(401).send();
  }
}

export async function jwtRefresh(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies['Refresh'];
  if (!token) {
    res.status(401).send('Error');
  }
  try {
    const payload = AuthService.verifyRefreshToken(token);
    const user = await UserService.findOneOrFail({ where: { id: payload.userID } });
    // @ts-ignore
    req.user = user;
    next();
  } catch {
    res.status(401).send();
  }
}

export async function isUserAnAdmin(req: Request, res: Response, next: NextFunction) {
  //@ts-ignore
  const user = req.user;
  if (user && user.user_type && user.user_type === 'admin') {
    next();
  } else {
    new AppError('Access denied', 401);
  }
}

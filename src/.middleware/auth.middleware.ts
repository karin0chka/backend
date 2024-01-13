import { NextFunction, Request, Response } from 'express';
import AuthService from '../auth/auth.service';
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

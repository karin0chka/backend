import { NextFunction, Request, Response } from 'express';
import AuthService from '../auth/auth.service';
import UserService from '../user/user.service';

export async function jwtAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies['Authentication'];
  if (!token) {
    next(new Error());
    return res.status(500).send();
  }
  try {
    const payload = AuthService.verifyAuthToken(token);
    const user = await UserService.findOne({ where: { id: payload.userID } });
    if (!user) {
      return res.status(500).send();
    }
    // @ts-ignore
    req.user = user;
    return next();
  } catch {
    return res.status(500).send();
  }
}

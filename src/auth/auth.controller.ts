import cookieParser from 'cookie-parser';
import express, { Request, Response } from 'express';
import AuthService from './auth.service';
import { jwtAuth, jwtRefresh } from '../.middleware/auth.middleware';
import asyncHandler from 'express-async-handler';

// import { jwtRefresh } from '../.middleware/auth.middleware';

const authRoute = express.Router();
authRoute.use(express.json());
authRoute.use(cookieParser());

authRoute.post(
  '/register',
  asyncHandler(async (req: Request, res: Response) => {
    const userInfo = await AuthService.register(req.body, res);
    res.setHeader('Set-Cookie', userInfo.cookies);
    res.json(userInfo.user);
  }),
);

authRoute.post('/login', async (req: Request, res: Response) => {
  const loginUser = await AuthService.login(req);
  res.setHeader('Set-Cookie', loginUser.cookies);
  res.json(loginUser.user);
});
// Create refresh middleware and put it bellow
authRoute.post(
  '/refresh',
  jwtRefresh,
  asyncHandler(async (req: Request, res: Response) => {
    // create authJWT & refreshJWT
    // set both cookies

    //@ts-ignore
    const user = req.user;
    const cookies = AuthService.validateRefreshAndGenerateCookies(req, user);
    res.setHeader('Set-Cookie', await cookies);

    res.status(200).send('Refresh successful');
  }),
);

authRoute.post(
  '/log-out',
  jwtAuth,
  asyncHandler(async (req: Request, res: Response) => {
    res.setHeader('Set-Cookie', '').send();
  }),
);
authRoute.get(
  '/change-password',
  jwtAuth,
  asyncHandler(async (req: Request, res: Response) => {
    //@ts-ignore
    const user = req.user;
    await AuthService.changePassword(req, user);
    res.status(200).send('Your password is successfully changed');
  }),
);

export default authRoute;

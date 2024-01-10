import cookieParser from 'cookie-parser';
import express, { Request, Response } from 'express';
import AuthService from './auth.service';

const authRoute = express.Router();
authRoute.use(express.json());
authRoute.use(cookieParser());

authRoute.post('/register', (req: Request, res: Response) => {
  try {
    AuthService.register(req.body, res);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

authRoute.post('/login', (req: Request, res: Response) => {
  try {
    AuthService.login(req, res);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Login failed' });
  }
});
// Create refresh middleware and put it bellow
authRoute.post('/refresh', (req: Request, res: Response) => {
// create authJWT & refreshJWT
// set both cookies
});

authRoute.post('/log-out', (req: Request, res: Response) => {
  res.setHeader('Set-Cookie', '');
});

export default authRoute;

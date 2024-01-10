import express, { Request, Response } from 'express';
import { jwtAuth } from '../.middleware/auth.middleware';
const user_router = express.Router();

user_router.get('/me', jwtAuth, (req: Request, res: Response) => {
    //@ts-ignore
  res.send(req.user);
});

export default user_router;

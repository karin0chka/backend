import express from 'express';
import { Request, Response } from 'express';
const authRoute = express.Router();


authRoute.get('/register', (req: Request, res: Response) => {});

authRoute.post('/login', (req: Request, res: Response) => {});

authRoute.post('/refresh', (req: Request, res: Response) => {});

authRoute.post('/log-out', (req: Request, res: Response) => {
    res.setHeader('Set-Cookie', "")
});

export default authRoute





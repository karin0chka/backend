import express from 'express';
import { Request, Response } from 'express';
const user_router = express.Router();

user_router.get('/me', (req: Request, res: Response) => {
    //implement getter

});

export default user_router

import jwt from 'jsonwebtoken';
import express from 'express';
import { Request, Response } from 'express';
import config from '../utils/config';

const jwtSecret = config.JWT.JWT_SECRET;
const testingRoute = express.Router();

testingRoute.get('/jwt-sign', (req: Request, res: Response) => {
  const payload = {
    test: 'testId',
  };

  const options = { expiresIn: '1h' };

  const token = jwt.sign(payload, jwtSecret, options);
  res.send(token);
});

testingRoute.post('/jwt-verify', (req: Request, res: Response) => {
  //decode is just decoding when verify is verifuing + decoding the token
  const payload = jwt.decode(req.body.token);
  const verify = jwt.verify(req.body.token, jwtSecret);
  res.send({ payload, verify });
});

export default testingRoute;

// import jwt from 'jsonwebtoken';
// import { Request, Response, NextFunction } from 'express';
// import config from '../src/utils/config';

// const jwtSecret = config.JWT.JWT_SECRET;

// export function generateAccessToken(user) {
//   const payload = {
//     email: user.email,
//     password: user.password,
//   };


//   const options = { expiresIn: '1h' };

//   return jwt.sign(payload, jwtSecret, options);
  
// }

// export function verifyAccessToken(token: string) {
//   try {
//     const decoded = jwt.verify(token, jwtSecret);
//     return { success: true, data: decoded };
//   } catch (error) {
//     return { success: false, error: error.message };
//   }
// }

// export function authenticateToken(req: Request, res: Response, next: NextFunction) {
//   const authHeader = req.headers.token_key;
//   const token = authHeader && authHeader.split(' ')[1];

//   if (!token) {
//     return res.status(401).json({ error: 'Missing token' });
//   }

//   const result = verifyAccessToken(token);

//   if (!result.success) {
//     return res.status(401).json({ error: result.error });
//   }else{
//       return (req as any).user = result.data;
//       next();
//   }

// }

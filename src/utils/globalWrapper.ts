// import { Request, Response, NextFunction } from "express"

// declare module "express-serve-static-core" {
//   interface Layer {
//     __handle?: Function
//   }
// }

// function isGenerator(fn: Function): boolean {
//   const type = Object.toString.call(fn.constructor)
//   return type.indexOf("GeneratorFunction") !== -1
// }

// function isAsync(fn: Function): boolean {
//   const type = Object.toString.call(fn.constructor)
//   return type.indexOf("AsyncFunction") !== -1
// }

// async function wrapGenerator(original: Function, req: Request, res: Response, next: NextFunction) {
//   try {
//     await original(req, res)
//     if (!res) {
//       next()
//     }
//   } catch (error) {
//     next(error)
//   }
// }

// function wrapAsync(fn: Function) {
//   return async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       await fn(req, res, next)
//       if (!res) {
//         next()
//       }
//     } catch (error) {
//       next(error)
//     }
//   }
// }

// export function globalWrapper(req: Request, res: Response, next: NextFunction) {
//   const originalHandle = res.locals.layer.handle
//   if (originalHandle) {
//     if (isGenerator(originalHandle)) {
//       res.locals.layer.handle = (req: Request, res: Response) => wrapGenerator(originalHandle, req, res, next)
//     }

//     if (isAsync(originalHandle)) {
//       res.locals.layer.handle = wrapAsync(originalHandle)
//     }
//   }
//   next()
// }

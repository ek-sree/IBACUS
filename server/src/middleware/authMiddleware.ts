import { Request, Response, NextFunction, RequestHandler } from "express";
import { verifyAccessToken } from "../utils/jwtUtlis.js";
import { TokenPayload } from "../types/tokenPayload.js";

export const authMiddleware = (allowedRoles: string[]):RequestHandler => {
  return (req: Request, res: Response, next: NextFunction):void => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
         res.status(401).json({ message: "No token provided" });
         return;
      }

      const token = authHeader.split(" ")[1];
      const payload = verifyAccessToken(token) as TokenPayload;


    
      if (!allowedRoles.includes(payload.role)) {
         res.status(403).json({ message: "Access denied" });
         return
      }

       (req as any).user = payload;
      next();
    } catch (error:any) {
       res.status(401).json({ message: "Unauthorized", error: error?.message || "No token provided" });
    }
  };
};

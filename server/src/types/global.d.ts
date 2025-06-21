// global.d.ts
import { Multer } from 'multer';

declare global {
  namespace Express {
    export interface Request {
      files?: {
        attachments?: Express.Multer.File[];
        images?: Express.Multer.File[];
      };
    }
  }
}

declare module 'multer';
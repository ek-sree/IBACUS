import multer, { FileFilterCallback } from 'multer';
import { Request, Response, NextFunction } from 'express';
import { StatusCode } from '../interface/statusCode.js';

const storage = multer.memoryStorage();

const allowedTypes = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
];

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type (${file.mimetype})`));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

export const uploadMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const uploader = upload.fields([
    { name: 'attachments', maxCount: 10 },
    { name: 'images', maxCount: 10 }
  ]);

  uploader(req, res, (err: unknown) => {
    console.log("HERE to");
    
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(StatusCode.BadRequest).json({ message: 'File too big!' });
      }
      console.log("ERR",err.message);
      
      return res.status(StatusCode.BadRequest).json({ message: err.message });
    } else if (err instanceof Error) {
      console.log("ERR2",err.message);
      return res.status(StatusCode.BadRequest).json({ message: err.message });
    }
    console.log("je");
    
    next();
  });
};
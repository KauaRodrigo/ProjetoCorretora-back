import { diskStorage } from 'multer';
import { Request } from 'express';
import { randomUUID } from 'crypto';
import { extname } from 'path';

type MulterCallback = (error: Error | null, filename: string) => void;
type FileFilterCallback = (error: Error | null, acceptFile: boolean) => void;

export const multerConfig = {
  storage: diskStorage({
    destination: './uploads',
    filename: (
      req: Request,
      file: any,
      callback: MulterCallback
    ) => {
      const fileExtension = extname(file.originalname);
      const fileName = `${randomUUID()}${fileExtension}`;
      callback(null, fileName);
    },
  }),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (
    req: Request,
    file: any,
    callback: FileFilterCallback
  ) => {
    const allowedMimes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'application/pdf'
    ];

    if (allowedMimes.includes(file.mimetype)) {
      callback(null, true);
    } else {
      callback(new Error('Tipo de arquivo não suportado.'), false);
    }
  },
};
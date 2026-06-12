import { FileFilterCallback, memoryStorage } from 'multer';
import { BadRequestException } from '@nestjs/common';
import { Request } from 'express';

export const multerConfig = {
  storage: memoryStorage(),
  fileFilter: (
    _req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback,
  ) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new BadRequestException('Only image files are allowed'));
    }
  },
  limits: {
    fileSize: 100 * 1024 * 1024, // 100 MB per file
  },
};

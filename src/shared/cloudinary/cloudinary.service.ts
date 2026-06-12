import {
  Injectable,
  InternalServerErrorException,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  UploadApiErrorResponse,
  UploadApiResponse,
  v2 as cloudinary,
} from 'cloudinary';

@Injectable()
export class CloudinaryService implements OnModuleInit {
  private initialized = false;

  constructor(private readonly configService: ConfigService) {}

  onModuleInit(): void {
    this.initialize();
  }

  private initialize(): void {
    if (this.initialized) {
      return;
    }

    const cloudName = this.configService.get<string>('CLOUDINARY_CLOUD_NAME');
    const apiKey = this.configService.get<string>('CLOUDINARY_API_KEY');
    const apiSecret = this.configService.get<string>('CLOUDINARY_API_SECRET');

    if (!cloudName || !apiKey || !apiSecret) {
      throw new Error(
        'Cloudinary configuration is incomplete. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.',
      );
    }

    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
      secure: true,
    });

    this.initialized = true;
  }

  uploadImage(file: Express.Multer.File, folder = 'cardinar'): Promise<string> {
    this.initialize();

    if (!file?.buffer) {
      throw new InternalServerErrorException('Image buffer is unavailable');
    }

    return new Promise((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'image',
        },
        (
          error: UploadApiErrorResponse | undefined,
          result: UploadApiResponse | undefined,
        ) => {
          if (error || !result?.secure_url) {
            reject(
              new InternalServerErrorException(
                error?.message ?? 'Cloudinary upload failed',
              ),
            );
            return;
          }

          resolve(result.secure_url);
        },
      );

      upload.end(file.buffer);
    });
  }
}

import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { multerConfig } from '../../config/multer.config';

@Module({
  imports: [
    MulterModule.register(multerConfig)
  ],
  exports: [MulterModule]
})
export class MulterConfigModule {}
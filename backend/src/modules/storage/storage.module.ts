import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StorageController } from './storage.controller';
import { StorageService } from './storage.service';
import { FileUpload } from '@database/entities/file-upload.entity';
import { AuthModule } from '@modules/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([FileUpload]),
    AuthModule, // Import AuthModule for guards
  ],
  controllers: [StorageController],
  providers: [StorageService],
  exports: [StorageService], // Export for use in other modules
})
export class StorageModule {}

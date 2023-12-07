import { Module } from '@nestjs/common';
import { AttachedFilesController } from './attached-files.controller';
import { AttachedFilesService } from './attached-files.service';
import { FileService } from '../file/file.service';

@Module({
  controllers: [AttachedFilesController],
  providers: [AttachedFilesService,FileService]
})
export class AttachedFilesModule {}

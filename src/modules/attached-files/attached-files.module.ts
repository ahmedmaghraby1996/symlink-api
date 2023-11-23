import { Module } from '@nestjs/common';
import { AttachedFilesController } from './attached-files.controller';
import { AttachedFilesService } from './attached-files.service';

@Module({
  controllers: [AttachedFilesController],
  providers: [AttachedFilesService]
})
export class AttachedFilesModule {}

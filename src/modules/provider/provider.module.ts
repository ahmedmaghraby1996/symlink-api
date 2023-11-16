import { Module } from '@nestjs/common';
import { ProviderController } from './provider.controller';
import { ProviderService } from './provider.service';
import { FileService } from '../file/file.service';

@Module({
  controllers: [ProviderController],
  providers: [ProviderService,FileService]
})
export class ProviderModule {}

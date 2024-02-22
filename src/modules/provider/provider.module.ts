import { Inject, Module } from '@nestjs/common';
import { ProviderController } from './provider.controller';
import { ProviderService } from './provider.service';
import { FileService } from '../file/file.service';
import { UserService } from '../user/user.service';

@Module({
  controllers: [ProviderController],
  providers: [ProviderService, FileService, UserService]
})
export class ProviderModule { }

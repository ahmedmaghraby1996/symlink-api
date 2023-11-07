import { UserService } from './user.service';
import { Module } from '@nestjs/common';
import { Global } from '@nestjs/common/decorators';
import { UserController } from './user.controller';
import { FileService } from '../file/file.service';

@Global()
@Module({
    imports: [],
    controllers: [UserController],
    providers: [UserService,FileService],
    exports: [UserService]
})
export class UserModule { }

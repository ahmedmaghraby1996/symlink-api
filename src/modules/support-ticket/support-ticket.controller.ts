import {
    Body,
    ClassSerializerInterceptor,
    Controller,
    Post,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from '../authentication/guards/jwt-auth.guard';
import { RolesGuard } from '../authentication/guards/roles.guard';
import { ApiBearerAuth, ApiConsumes, ApiHeader, ApiTags } from '@nestjs/swagger';
import { SupportTicketService } from './support-ticket.service';
import { CreateTicketRequest } from './dto/request/create-ticket.request';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadValidator } from 'src/core/validators/upload.validator';

@ApiBearerAuth()
@ApiHeader({
    name: 'Accept-Language',
    required: false,
    description: 'Language header: en, ar',
})
@ApiTags('Support Ticket')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('support-ticket')
export class SupportTicketController {
    constructor(private readonly supportTicketService: SupportTicketService) { }

    @Post()
    @UseInterceptors(ClassSerializerInterceptor, FileInterceptor('file'))
    @ApiConsumes('multipart/form-data')
    async createTicket(
        @Body() createTicketRequest: CreateTicketRequest,
        @UploadedFile(new UploadValidator().build()) file: Express.Multer.File,
    ) {
        createTicketRequest.file = file;
        return this.supportTicketService.createTicket(createTicketRequest);
    }
}

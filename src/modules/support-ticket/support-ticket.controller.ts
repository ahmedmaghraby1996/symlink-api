import {
    Body,
    ClassSerializerInterceptor,
    Controller,
    Get,
    Post,
    Query,
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
import { ActionResponse } from 'src/core/base/responses/action.response';
import { SupportTicketResponse } from './dto/response/support-ticket.response';
import { plainToInstance } from 'class-transformer';
import { PaginatedRequest } from 'src/core/base/requests/paginated.request';

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
    ): Promise<ActionResponse<SupportTicketResponse>> {
        createTicketRequest.file = file;
        const createdTicket = await this.supportTicketService.createTicket(createTicketRequest);
        const result = plainToInstance(SupportTicketResponse, createdTicket, {
            excludeExtraneousValues: true,
        });
        return new ActionResponse<SupportTicketResponse>(result);
    }

    @Get()
    async getTickets(@Query() query: PaginatedRequest): Promise<ActionResponse<SupportTicketResponse[]>> {
        const tickets = await this.supportTicketService.getTickets(query);
        const result = plainToInstance(SupportTicketResponse, tickets, {
            excludeExtraneousValues: true,
        });
        return new ActionResponse<SupportTicketResponse[]>(result);
    }
}

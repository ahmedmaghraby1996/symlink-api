import {
    Controller,
    Post,
    UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../authentication/guards/jwt-auth.guard';
import { RolesGuard } from '../authentication/guards/roles.guard';
import { ApiBearerAuth, ApiHeader, ApiTags } from '@nestjs/swagger';
import { SupportTicketService } from './support-ticket.service';

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
    constructor(private readonly supportTicketService: SupportTicketService ) { }
}

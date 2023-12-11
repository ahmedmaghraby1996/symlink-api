import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../authentication/guards/jwt-auth.guard';
import { RolesGuard } from '../authentication/guards/roles.guard';
import { CreateDiscussionObjectDTO } from './dto/create-discussion-entity.dto';
import { ApiBearerAuth, ApiHeader, ApiTags } from '@nestjs/swagger';
import { DiscussionService } from './discussion.service';
import { OptionalMessageQueryDTO } from './dto/optional-message-query.dto';
import { LockDiscussionGuard } from './guards/lock-discussion.guard';

@ApiBearerAuth()
@ApiHeader({
    name: 'Accept-Language',
    required: false,
    description: 'Language header: en, ar',
})
@ApiTags('Discussion')
@UseGuards(JwtAuthGuard, RolesGuard,LockDiscussionGuard)
@Controller('discussion')
export class DiscussionController {
    constructor(
        private readonly messageService: DiscussionService,
        ) { }
        @Post(':multi_RFP_id/messages')
        async createMessage(
            @Param("multi_RFP_id") multi_RFP_id: string,
            @Query() query: OptionalMessageQueryDTO,
            @Body() message: CreateDiscussionObjectDTO
    ) {
        return await this.messageService.createMessage(multi_RFP_id, query, message);
    }
    
    @Get(':multi_RFP_id/messages/:offset/:limit')
    async getMessagesByChunk(
        @Param("multi_RFP_id") multi_RFP_id: string,
        @Query() query: OptionalMessageQueryDTO,
        @Param("offset") offset: number,
        @Param("limit") limit: number
    ) {
        return await this.messageService.getItemsByChunk(multi_RFP_id, query, offset, limit);
    }
}

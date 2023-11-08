import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiHeader, ApiTags } from '@nestjs/swagger';
import { RequestForProposalService } from './request-for-proposal.service';
import { CreateRequestForProposalRequest } from './dto/create-request-for-proposal.request';
import { ActionResponse } from 'src/core/base/responses/action.response';
import { RequestForProposal } from 'src/infrastructure/entities/request-for-proposal/request-for-proposal.entity';
import { Role } from 'src/infrastructure/data/enums/role.enum';
import { JwtAuthGuard } from '../authentication/guards/jwt-auth.guard';
import { Roles } from '../authentication/guards/roles.decorator';
import { RolesGuard } from '../authentication/guards/roles.guard';
import { RequestForProposalResponse } from './dto/request-for-proposal.response';
@ApiBearerAuth()
@ApiHeader({
  name: 'Accept-Language',
  required: false,
  description: 'Language header: en, ar',
})
@ApiTags('Request-For-Proposal')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('request-for-proposal')
export class RequestForProposalController {
  constructor(
    private readonly requestForProposalService: RequestForProposalService,
  ) {}
  @Roles(Role.CLIENT)
  @Post()
  async createRequestForProposal(
    @Body() createRequestForProposalRequest: CreateRequestForProposalRequest,
  ) {
    const requestForProposal =
      await this.requestForProposalService.createRequestForProposal(
        createRequestForProposalRequest,
      );
    return new ActionResponse<RequestForProposal>(requestForProposal);
  }

  @Get()
  async getAllRequestForProposal(){
    const requestForProposal = await this.requestForProposalService.getAllRequestForProposal();
    return new ActionResponse<RequestForProposalResponse[]>(requestForProposal);

  }
}

import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiHeader, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../authentication/guards/jwt-auth.guard';
import { RolesGuard } from '../authentication/guards/roles.guard';
import { MultiRfpService } from './multi-rfp.service';
import { CreateMultiRFPRequest } from './dto/create-multi-RFP.request';
@ApiBearerAuth()
@ApiHeader({
  name: 'Accept-Language',
  required: false,
  description: 'Language header: en, ar',
})
@ApiTags('Multi-rfp')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('multi-rfp')
export class MultiRfpController {

    constructor(private readonly multiRfpService: MultiRfpService) {
        
    }
    @Post()
    async createMultiRFP(@Body() createMultiRFPRequest: CreateMultiRFPRequest) {
        console.log('createMultiRFPRequest', createMultiRFPRequest);
        return await this.multiRfpService.createMultiRFP(createMultiRFPRequest);
    }

    @Get()
    async getAllMultiRFP() {
        return await this.multiRfpService.getAllMultiRFP();
    }
}

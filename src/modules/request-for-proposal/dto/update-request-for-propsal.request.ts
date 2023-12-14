import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { CreateRequestForProposalRequest } from './create-request-for-proposal.request';

export class UpdateRequestForProposalRequest extends CreateRequestForProposalRequest {
    @IsOptional()
    category_id: string;

    @ApiProperty({ nullable: false, required: true })
    @IsNotEmpty()
    @IsString()
    id: string;
}

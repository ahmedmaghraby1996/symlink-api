import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, ValidateIf } from 'class-validator';
import { CreateRequestForProposalRequest } from './create-request-for-proposal.request';

export class UpdateRequestForProposalRequest extends CreateRequestForProposalRequest {
    @ValidateIf((object, value) => !object.id) // Only validate if `id` doesn't exist
    @IsNotEmpty()
    category_id: string;

    @ApiProperty({ nullable: false, required: true })
    @IsOptional()
    @IsString()
    id: string;
}
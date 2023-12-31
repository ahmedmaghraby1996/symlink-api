import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, ValidateIf } from 'class-validator';
import { CreateRequestForProposalRequest } from './create-request-for-proposal.request';

export class UpdateRequestForProposalRequest extends CreateRequestForProposalRequest {
    @ValidateIf((object, value) => !object.id) // Only validate if `id` doesn't exist
    @IsNotEmpty()
    category_id: string;

    @IsOptional()
    category_name:string;

    @IsOptional()
    target_ip_address: string;

    @IsOptional()
    approach_of_assessment: string;

    @IsOptional()
    is_active_directory: boolean;

    @IsOptional()
    target_mobile_application_url: string;

    @IsOptional()
    how_many_custom_lines_of_code: string;

    @IsOptional()
    what_is_programming_language: string;

    @IsOptional()
    how_many_server_to_review: string;

    @IsOptional()
    how_many_network_devices_to_review: string;

    @IsOptional()
    how_many_workstation_to_review: string;

    @IsOptional()
    is_hld_lld_available: boolean;


    @ApiProperty({ nullable: false, required: true })
    @IsOptional()
    @IsString()
    id: string;
}
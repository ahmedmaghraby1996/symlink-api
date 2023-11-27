import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateRequestForProposalRequest {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  category_id: string;

  
  @ApiProperty({ nullable: true, required: false })
  @IsOptional()
  @IsString()
  assessments_type_id: string;

  @ApiProperty({ nullable: true, required: false })
  @IsOptional()
  @IsString()
  apis_size_id: string;

  @ApiProperty({ nullable: true, required: false })
  @IsOptional()
  @IsString()
  average_applications_id: string;

  @ApiProperty({ nullable: true, required: false })
  @IsOptional()
  @IsString()
  color_mobile_id: string;

  @ApiProperty({ nullable: true, required: false })
  @IsOptional()
  @IsString()
  evaluation_is_internal_or_external_id: string;

  @ApiProperty({ nullable: true, required: false })
  @IsOptional()
  @IsNumber()
  internal_applications_num: number;

  @ApiProperty({ nullable: true, required: false })
  @IsOptional()
  @IsNumber()
  external_applications_num: number;

  @ApiProperty({ nullable: true, required: false })
  @IsOptional()
  @IsString()
  list_applications_with_scope: string;

  @ApiProperty({ nullable: true, required: false })
  @Transform(({ value }) => {
    return value === 'true';
  })
  @IsOptional()
  @IsBoolean()
  Verify_that_vulnerabilities_are_fixed: boolean;

  @ApiProperty({ nullable: true, required: false })
  @Transform(({ value }) => {
    return value === 'true';
  })
  @IsOptional()
  @IsBoolean()
  necessary_resident_be_on_site: boolean;


  @ApiProperty({ nullable: true, required: false })
  @IsOptional()
  @IsNumber()
  how_many_times_on_site: number;


  @ApiProperty({ nullable: true, required: false })
  @IsOptional()
  @IsNumber()
  How_many_user_roles: number;


  @ApiProperty({ nullable: true, required: false })
  @IsOptional()
  @IsString()
  how_to_access_the_application: string;

  @ApiProperty({ nullable: true, required: false })
  @IsOptional()
  @IsString()
  how_can_the_assessor_access_it: string;
  
  @ApiProperty({ nullable: true, required: false })
  @IsOptional()
  @IsNumber()
  how_many_IPS_should_be_tested_in_servers: number;

  @ApiProperty({ nullable: true, required: false })
  @IsOptional()
  @IsNumber()
  how_many_IPS_should_be_tested_in_workstations: number;

  @ApiProperty({ nullable: true, required: false })
  @IsOptional()
  @IsNumber()
  how_many_IPS_should_be_tested_in_network_devices: number;

  @ApiProperty({ nullable: true, required: false })
  @Transform(({ value }) => {
    return value === 'true';
  })
  @IsOptional()
  @IsBoolean()
  vpn_access_to_the_resident: boolean;

  @ApiProperty({ nullable: true, required: false })
  @IsOptional()
  @IsString()
  evaluation_approach: string;

  @ApiProperty({ nullable: true, required: false })
  @IsOptional()
  @IsString()
  details_evaluation_approach: string;

  @ApiProperty({ nullable: true, required: false })
  @Transform(({ value }) => {
    return value === 'true';
  })
  @IsOptional()
  @IsBoolean()
  active_directory: boolean;

  @ApiProperty({ nullable: true, required: false })
  @IsOptional()
  @IsString()
  details_ips_scoped: string;
}

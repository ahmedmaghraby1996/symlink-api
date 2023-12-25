import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Validate, ValidateIf } from 'class-validator';

export class CreateRequestForProposalRequest {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  category_id: string;

  @ApiProperty({ nullable: false, required: true, enum: ["Web", "Network", "Code Source", "Mobile Application", "Architecture Configuration"] })
  @IsNotEmpty()
  @IsEnum(["Web", "Network", "Code Source", "Mobile Application", "Architecture Configuration"])
  category_name: string;

  // Target URL/IP address
  @ApiProperty({ nullable: true, required: false })
  @IsNotEmpty()
  @IsString()
  @ValidateIf((object) =>
    object.category_name === 'Web' ||
    object.category_name === 'Network'
  )
  target_ip_address: string;

  // The approach of the assessment:
  @ApiProperty({ nullable: true, required: false, enum: ['WHITE', 'BLACK'] })
  @IsEnum(['WHITE', 'BLACK'])
  @IsNotEmpty()
  @ValidateIf((object) =>
    object.category_name === 'Web' ||
    object.category_name === 'Network' ||
    object.category_name === 'Mobile Application'
  )
  approach_of_assessment: string;

  // Notes
  @ApiProperty({ nullable: true, required: false })
  @IsOptional()
  @IsString()
  notes: string;

  // Is Active Directory part of the assessment
  @ApiProperty({ nullable: true, required: false })
  @IsNotEmpty()
  @IsBoolean()
  @ValidateIf((object) => object.category_name === 'Network')
  is_active_directory: boolean;

  // Target mobile application URL
  @ApiProperty({ nullable: true, required: false })
  @IsNotEmpty()
  @IsString()
  @ValidateIf((object) => object.category_name === 'Mobile Application')
  target_mobile_application_url: string;

  // How many custom lines of code want to assess
  @ApiProperty({ nullable: true, required: false })
  @IsNotEmpty()
  @IsString()
  @ValidateIf((object) => object.category_name === 'Code Source ')
  how_many_custom_lines_of_code: string;

  // What is the programming language of the code or frameworks
  @ApiProperty({ nullable: true, required: false })
  @IsNotEmpty()
  @IsString()
  @ValidateIf((object) => object.category_name === 'Code Source ')
  what_is_programming_language: string;

  // How many servers, network devices, and workstations do you want to review - Servers
  @ApiProperty({ nullable: true, required: false })
  @IsNotEmpty()
  @IsString()
  @ValidateIf((object) => object.category_name === 'Architecture Configuration ')
  how_many_server_to_review: string;

  // How many servers, network devices, and workstations do you want to review - Network
  @ApiProperty({ nullable: true, required: false })
  @IsNotEmpty()
  @IsString()
  @ValidateIf((object) => object.category_name === 'Architecture Configuration ')
  how_many_network_devices_to_review: string;

  // How many servers, network devices, and workstations do you want to review - Workstations
  @ApiProperty({ nullable: true, required: false })
  @IsNotEmpty()
  @IsString()
  @ValidateIf((object) => object.category_name === 'Architecture Configuration ')
  how_many_workstation_to_review: string;

  // Is the High-Level Diagram (HLD)/Low-Level Diagram (LLD) available and updated?
  @ApiProperty({ nullable: true, required: false })
  @IsNotEmpty()
  @IsBoolean()
  @ValidateIf((object) => object.category_name === 'Architecture Configuration ')
  is_hld_lld_available: boolean;
}

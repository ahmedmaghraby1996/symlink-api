import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Validate,
  ValidateNested,
} from 'class-validator';
import { IsEnumArray } from 'src/core/validators/is-enum-array-validator';
import { PreferredTestingTime } from 'src/infrastructure/data/enums/prefered-testing-times.types';
import { CreateRequestForProposalRequest } from 'src/modules/request-for-proposal/dto/create-request-for-proposal.request';

export class CreateMultiRFPRequest {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  project_name: string;

  @ApiProperty({ default: new Date().toISOString().split('T')[0] }) //extract only the date
  @IsNotEmpty()
  expiration_date: Date;

  @ApiProperty()
  @IsOptional()
  @IsString()
  firstFullName: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  firstEmail: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  firstMobile: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  secondFullName: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  secondEmail: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  secondMobile: string;

  @ApiProperty({ enum: PreferredTestingTime, isArray: true })
  @IsArray()
  @Type(() => String)
  @IsEnumArray(Object.values(PreferredTestingTime), {
    message: `preferred_testing_time must be an array of valid enum values ${Object.values(PreferredTestingTime)}`,
  })
  preferred_testing_time: PreferredTestingTime[];


  @ApiProperty({ type: [CreateRequestForProposalRequest] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateRequestForProposalRequest)
  readonly projects: CreateRequestForProposalRequest[];
  requestForProposalList: CreateRequestForProposalRequest[];
}

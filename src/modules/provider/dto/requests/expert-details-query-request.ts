import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class ExpertDetailsQueryRequest {
    @ApiProperty({ nullable: true, required: false })
    @IsOptional()
    @IsString()
    user_id: string;
}
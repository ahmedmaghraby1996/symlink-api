import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class OptionalUseridRequest {
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    user_id?: string;
}
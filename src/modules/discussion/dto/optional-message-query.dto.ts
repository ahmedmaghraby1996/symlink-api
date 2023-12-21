import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class OptionalMessageQueryDTO {
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    message_id?: string;
}
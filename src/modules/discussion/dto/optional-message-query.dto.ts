import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class OptionalMessageQueryDTO {
    @IsOptional()
    @IsString()
    message_id?: string;
}
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class RequestResetPassword {
    @ApiProperty({ required: true, description: 'Authentication email', example: 'ahmed@gmail.com'})
    @IsNotEmpty() @IsString()
    email: string;
}
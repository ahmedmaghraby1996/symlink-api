import { IsNotEmpty, IsString } from "class-validator";

export class CreateMessageDTO {
    @IsNotEmpty()
    @IsString()
    message_content: string;
}
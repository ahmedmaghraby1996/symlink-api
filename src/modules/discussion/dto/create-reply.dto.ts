import { IsNotEmpty, IsString } from "class-validator";

export class CreateReplyDTO {
    @IsNotEmpty()
    @IsString()
    reply_content: string;
}
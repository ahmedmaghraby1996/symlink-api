import { IsNotEmpty, IsString } from "class-validator";

export class CreateDiscussionObjectDTO {
    @IsNotEmpty()
    @IsString()
    body_text: string;
}
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateDiscussionObjectDTO {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    body_text: string;

    @ApiProperty({ type: 'file', required: false })
    file?: Express.Multer.File;
}
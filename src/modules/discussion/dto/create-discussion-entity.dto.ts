import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateDiscussionObjectDTO {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    body_text: string;

    @ApiProperty({ nullable: true, required: false, })
    @Transform(({ value }) => {
        return value === true || value === 'true';
    })
    @IsOptional()
    @IsBoolean()
    is_anynmous?: boolean;

    @ApiProperty({ type: 'file', required: false })
    file?: Express.Multer.File;
}
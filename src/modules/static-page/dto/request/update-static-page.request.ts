import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { StaticPagesEnum } from "src/infrastructure/data/enums/static-pages.enum";

export class UpdateStaticPageRequest {
    @ApiProperty({ description: 'Static page type', enum: StaticPagesEnum, required: true })
    @IsEnum([
        StaticPagesEnum.ABOUT_SYMLINK,
        StaticPagesEnum.TERMS_AND_CONDITIONS,
        StaticPagesEnum.WHO_ARE_WE
    ])
    @IsString()
    static_page_type: StaticPagesEnum;

    @ApiProperty({ description: 'Static page arabic content', required: false })
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    content_ar: string;

    @ApiProperty({ description: 'Static page english content', required: false })
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    content_en: string;
}
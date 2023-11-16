import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsNotEmpty, IsString } from "class-validator";

export class ProviderInfoRequest {
    
    @Expose()
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    educational_info:string


}
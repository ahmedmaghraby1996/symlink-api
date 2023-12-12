import { ApiProperty } from "@nestjs/swagger"
import { Expose } from "class-transformer"
import { IsDate, IsNotEmpty, IsString } from "class-validator"

export class ProviderProjectRequest {
    
    @Expose()
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name:string
    
    @Expose()
    @ApiProperty()
    start_date:Date

    @Expose()
    @ApiProperty()
    end_date:Date
    
    @Expose()
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    description:string

}
import { ApiProperty } from "@nestjs/swagger"
import { Expose } from "class-transformer"
import { IsOptional, IsString } from "class-validator"

export class UpdateProvProjectRequest {
    
    @Expose()
    @ApiProperty()
    @IsString()
    @IsOptional()
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
    @IsOptional()
    description:string

}
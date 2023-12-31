import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from "class-validator";

export class AttachRequestForProposalRequest {
    @ApiProperty({ type: 'file', required: true })
    @IsOptional()
    file: Express.Multer.File;
}
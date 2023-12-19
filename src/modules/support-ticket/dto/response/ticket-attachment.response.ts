import { Expose } from "class-transformer";

export class TicketAttachmentResponse {
    @Expose() id: string;
    @Expose() file_url: string;
    @Expose() file_name: string;
    @Expose() file_type: string;
    @Expose() created_at: Date;
    @Expose() updated_at: Date;
}
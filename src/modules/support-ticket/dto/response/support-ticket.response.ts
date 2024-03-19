import { Expose, Type } from "class-transformer";
import { SupportTicketStatus } from "src/infrastructure/data/enums/support-ticket-status.enum";
import { TicketAttachmentResponse } from "./ticket-attachment.response";
import { RegisterResponse } from "src/modules/authentication/dto/responses/register.response";

export class SupportTicketResponse {
    @Expose() id: string;
    @Expose() subject: string;
    @Expose() description: string;
    @Expose() status: SupportTicketStatus;
    @Expose() ticket_num: string;
    @Expose() @Type(() => TicketAttachmentResponse) attachment: TicketAttachmentResponse;
    @Expose() created_at: Date;
    @Expose() updated_at: Date;
    @Expose() user_id: string;
    @Expose() @Type(() => RegisterResponse) user: RegisterResponse;
    @Expose() new_messages_count: number;
    @Expose() is_counter_active: boolean;
}
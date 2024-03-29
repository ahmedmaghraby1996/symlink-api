import { Expose, Type } from "class-transformer";
import { TicketAttachmentResponse } from "./ticket-attachment.response";
import { SupportTicketResponse } from "./support-ticket.response";
import { UserInfoExpose } from "src/modules/user/dto/response/profile.response";

export class TicketCommentResponse {
    @Expose() id: string;
    @Expose() comment_text: string;
    @Expose() @Type(() => TicketAttachmentResponse) attachment: TicketAttachmentResponse;
    @Expose() created_at: Date;
    @Expose() updated_at: Date;
    @Expose() user_id: string;
    @Expose() @Type(() => SupportTicketResponse) ticket: SupportTicketResponse;
    @Expose() ticket_id: string;
    @Expose() @Type(() => UserInfoExpose) user: UserInfoExpose;
}
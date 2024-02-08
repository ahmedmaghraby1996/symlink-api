import { Expose, Type } from "class-transformer";
import { TicketAttachmentResponse } from "src/modules/support-ticket/dto/response/ticket-attachment.response";
import { UserInfoExpose } from "src/modules/user/dto/response/profile.response";

export class MessageResponse {
    @Expose() id: string;
    @Expose() body_text: string;
    @Expose() replies_count: number;
    @Expose() attachment_id: string;
    @Expose() parent_reply_id: string;
    @Expose() @Type(() => TicketAttachmentResponse) attachment: TicketAttachmentResponse;
    @Expose() @Type(() => UserInfoExpose) user: UserInfoExpose;
    @Expose() @Type(() => MessageResponse) message: MessageResponse;
    @Expose() multi_rfp_id: string;
    @Expose() deleted_at: string;
    @Expose() created_at: Date;
    @Expose() updated_at: Date;
    @Expose() user_id: string;
    @Expose() message_id: string;
}
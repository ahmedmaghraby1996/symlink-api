import { Expose, Type } from "class-transformer";
import { MessageResponse } from "./message.response";

export class MessagesListResponse {
    @Expose() @Type(() => MessageResponse) messages: MessageResponse[];
    @Expose() @Type(() => MessageResponse) replies: MessageResponse[];
    @Expose() totalPages: number;
    @Expose() currentPage: number;
    
}
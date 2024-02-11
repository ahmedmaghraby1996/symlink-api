import { MultiRFP } from "src/infrastructure/entities/multi-rfp/multi-rfp.entity";
import { MessageResponse } from "src/modules/discussion/dto/response/message.response";

export interface DiscussionPayload {
    multi_RFP: MultiRFP,
    action: string,
    entity_type: string,
    entity: MessageResponse
}
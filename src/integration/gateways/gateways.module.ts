import { Module } from '@nestjs/common';
import { OfferGateway } from './offer.gateway';
import { DiscussionGateway } from './discussion.gateway';
import { SupportTicketGateway } from './support-ticket.gateway';

@Module({
    imports: [],
    providers: [
        OfferGateway,
        DiscussionGateway
    ],
    exports: [
        OfferGateway,
        DiscussionGateway,
        SupportTicketGateway
    ],
})
export class GatewaysModule { }

import { Module } from '@nestjs/common';
import { OfferGateway } from './offer.gateway';
import { DiscussionGateway } from './discussion.gateway';

@Module({
    imports: [],
    providers: [
        OfferGateway,
        DiscussionGateway
    ],
    exports: [
        OfferGateway,
        DiscussionGateway
    ],
})
export class GatewaysModule { }

import { Module } from '@nestjs/common';
import { OfferGateway } from './offer.gateway';

@Module({
    imports: [],
    providers: [
        OfferGateway
    ],
    exports: [
        OfferGateway
    ],
})
export class GatewaysModule { }

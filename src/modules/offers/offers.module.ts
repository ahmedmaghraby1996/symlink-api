import { Module } from '@nestjs/common';
import { OffersController } from './offers.controller';
import { OffersService } from './offers.service';
import { GatewaysModule } from 'src/integration/gateways/gateways.module';
import { AcceptOfferTransaction } from './utils/accept-offer.transation';

@Module({
  imports: [GatewaysModule],
  controllers: [OffersController],
  providers: [OffersService, AcceptOfferTransaction],
})
export class OffersModule {}

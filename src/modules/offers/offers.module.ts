import { Module } from '@nestjs/common';
import { OffersController } from './offers.controller';
import { OffersService } from './offers.service';
import { GatewaysModule } from 'src/integration/gateways/gateways.module';
import { AcceptOfferTransaction } from './utils/accept-offer.transation';
import { AcceptedProviderGuard } from './guards/accepted-provider.guard';

@Module({
  imports: [GatewaysModule],
  controllers: [OffersController],
  providers: [OffersService, AcceptOfferTransaction,AcceptedProviderGuard],
  exports:[AcceptedProviderGuard]
})
export class OffersModule {}

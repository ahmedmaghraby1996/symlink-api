import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { OffersService } from '../offers.service';

@Injectable()
export class AcceptedProviderGuard implements CanActivate {
    constructor(private offerService: OffersService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const { multi_RFP_id } = request.params;

        const acceptedOffer = await this.offerService.getAcceptedOffer(multi_RFP_id)

        return acceptedOffer.user_id === request.user.id;
    }
}
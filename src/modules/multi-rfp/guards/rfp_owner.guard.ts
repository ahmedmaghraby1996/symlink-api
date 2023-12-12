import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { MultiRfpService } from '../multi-rfp.service';

@Injectable()
export class RfpOwnerGuard implements CanActivate {
    constructor(private multiRfpService:MultiRfpService ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const { multi_RFP_id } = request.params;

        const rfp = await this.multiRfpService.getSingleMultiRFP(multi_RFP_id)

        return rfp.user.id === request.user.id;
    }
}
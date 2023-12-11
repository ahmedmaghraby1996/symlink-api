import { CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { AcceptedProviderGuard } from 'src/modules/offers/guards/accepted-provider.guard';
import { RfpOwnerGuard } from 'src/modules/multi-rfp/guards/rfp_owner.guard';
import { DiscussionService } from '../discussion.service';

@Injectable()
export class LockDiscussionGuard implements CanActivate {
    constructor(
        private acceptedProviderGuard: AcceptedProviderGuard,
        private rfpOwnerGuard: RfpOwnerGuard,
        private discussionService: DiscussionService,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const { multi_RFP_id } = request.params;

        const rfp = await this.discussionService.findMultiRFPOrFail(multi_RFP_id)
        if (rfp.isPrivateDiscussion) {
            const [acceptedProvider, rfpOwnerResult] = await Promise.all([
                this.acceptedProviderGuard.canActivate(context),
                this.rfpOwnerGuard.canActivate(context),
            ]);

            return acceptedProvider || rfpOwnerResult;
        } else {
            return true;
        }
    }
}
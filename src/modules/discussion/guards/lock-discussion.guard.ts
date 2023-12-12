import { CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { AcceptedProviderGuard } from 'src/modules/offers/guards/accepted-provider.guard';
import { RfpOwnerGuard } from 'src/modules/multi-rfp/guards/rfp_owner.guard';
import { DiscussionService } from '../discussion.service';
import { RequestForProposalStatus } from 'src/infrastructure/data/enums/request-for-proposal.enum';

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

        const multipRFP = await this.discussionService.findMultiRFPOrFail(multi_RFP_id)
        if (multipRFP.request_for_proposal_status == RequestForProposalStatus.APPROVED) {
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
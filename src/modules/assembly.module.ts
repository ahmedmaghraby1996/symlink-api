import { AddressModule } from './address/address.module';

import { Module } from '@nestjs/common';
import { CategoryModule } from './category/category.module';
import { RequestForProposalModule } from './request-for-proposal/request-for-proposal.module';
import { MultiRfpModule } from './multi-rfp/multi-rfp.module';
import { ProviderModule } from './provider/provider.module';
import { AttachedFilesModule } from './attached-files/attached-files.module';
import { OffersModule } from './offers/offers.module';
import { DiscussionModule } from './discussion/discussion.module';
import { SendEmailModule } from './send-email/send-email.module';
import { SupportTicketModule } from './support-ticket/support-ticket.module';

@Module({
    imports: [
        AddressModule,
        CategoryModule,
        RequestForProposalModule,
        MultiRfpModule,
        ProviderModule,
        AttachedFilesModule,
        OffersModule,
        DiscussionModule,
        SendEmailModule,
        SupportTicketModule,
    ],
    exports: [
        AddressModule,
    ],
})
export class AssemblyModule { }

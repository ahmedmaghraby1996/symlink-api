import { AddressModule } from './address/address.module';

import { Module } from '@nestjs/common';
import { CategoryModule } from './category/category.module';
import { MetaDataModule } from './meta-data/meta-data.module';
import { RequestForProposalModule } from './request-for-proposal/request-for-proposal.module';
import { MultiRfpModule } from './multi-rfp/multi-rfp.module';
import { ProviderModule } from './provider/provider.module';
import { AttachedFilesModule } from './attached-files/attached-files.module';
import { OffersModule } from './offers/offers.module';
import { DiscussionModule } from './discussion/discussion.module';
import { SendEmailModule } from './send-email/send-email.module';

@Module({
    imports: [
        AddressModule,
        CategoryModule,
        MetaDataModule,
        RequestForProposalModule,
        MultiRfpModule,
        ProviderModule,
        AttachedFilesModule,
        OffersModule,
        DiscussionModule,
        SendEmailModule,
    ],
    exports: [
        AddressModule,
    ],
})
export class AssemblyModule { }

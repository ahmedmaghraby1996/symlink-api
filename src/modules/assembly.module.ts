import { AddressModule } from './address/address.module';

import { Module } from '@nestjs/common';
import { CategoryModule } from './category/category.module';
import { MetaDataModule } from './meta-data/meta-data.module';
import { RequestForProposalModule } from './request-for-proposal/request-for-proposal.module';
import { MultiRfpModule } from './multi-rfp/multi-rfp.module';

@Module({
    imports: [
        AddressModule,
        CategoryModule,
        MetaDataModule,
        RequestForProposalModule,
        MultiRfpModule,
    ],
    exports: [
        AddressModule,
    ],
})
export class AssemblyModule { }

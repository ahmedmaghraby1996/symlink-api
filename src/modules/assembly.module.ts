import { AddressModule } from './address/address.module';

import { Module } from '@nestjs/common';
import { CategoryModule } from './category/category.module';
import { MetaDataModule } from './meta-data/meta-data.module';
import { RequestForProposalModule } from './request-for-proposal/request-for-proposal.module';

@Module({
    imports: [
        AddressModule,
        CategoryModule,
        MetaDataModule,
        RequestForProposalModule,
    ],
    exports: [
        AddressModule,
    ],
})
export class AssemblyModule { }

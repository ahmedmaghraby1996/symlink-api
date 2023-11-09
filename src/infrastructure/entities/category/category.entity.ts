import { BaseEntity } from 'src/infrastructure/base/base.entity';
import {
    Entity,
    Column,
    CreateDateColumn,
    OneToMany,
} from 'typeorm';
import { MetaData } from '../meta-data/meta-data.entity';
import { RequestForProposal } from '../request-for-proposal/request-for-proposal.entity';

@Entity()
export class Category extends BaseEntity {

    @Column({unique: true})
    name_ar: string;

    @Column({unique: true})
    name_en: string;

    @OneToMany(() => RequestForProposal, (requestForProposal) => requestForProposal.category)
    request_for_proposal: RequestForProposal[]
}
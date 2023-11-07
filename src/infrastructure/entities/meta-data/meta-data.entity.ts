import { BaseEntity } from 'src/infrastructure/base/base.entity';
import { Entity, Column, CreateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { Category } from '../category/category.entity';
import { MetaDataType } from 'src/infrastructure/data/enums/meta-data-type.enum';
import { RequestForProposal } from '../request-for-proposal/request-for-proposal.entity';

@Entity()
export class MetaData extends BaseEntity {
  @ManyToOne(() => Category, (category) => category.meta_data)
  category: Category;

  @OneToMany(() => RequestForProposal, (requestForProposal) => requestForProposal.assessments_type)
  request_for_proposal: RequestForProposal[]

  @Column()
  type: MetaDataType;

  @Column()
  name_ar: string;

  @Column()
  name_en: string;
}

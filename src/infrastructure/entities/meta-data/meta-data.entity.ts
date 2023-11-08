import { BaseEntity } from 'src/infrastructure/base/base.entity';
import {
  Entity,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Category } from '../category/category.entity';
import { MetaDataType } from 'src/infrastructure/data/enums/meta-data-type.enum';
import { RequestForProposal } from '../request-for-proposal/request-for-proposal.entity';

@Entity()
export class MetaData extends BaseEntity {
  @OneToMany(
    () => RequestForProposal,
    (requestForProposal) => requestForProposal.assessments_type_meta_data,
  )
  assessments_type_request: RequestForProposal[];

  @OneToMany(
    () => RequestForProposal,
    (requestForProposal) => requestForProposal.apis_size_meta_data,
  )
  apis_size_request: RequestForProposal[];

  @OneToMany(
    () => RequestForProposal,
    (requestForProposal) => requestForProposal.average_applications_meta_data,
  )
  average_applications_request: RequestForProposal[];

  @OneToMany(
    () => RequestForProposal,
    (requestForProposal) => requestForProposal.color_mobile_meta_data,
  )
  color_mobile_request: RequestForProposal[];

  @OneToMany(
    () => RequestForProposal,
    (requestForProposal) => requestForProposal.evaluation_is_internal_or_external_meta_data,
  )
  evaluation_is_internal_or_external_request: RequestForProposal[];
  
  @Column()
  type: MetaDataType;

  @Column()
  name_ar: string;

  @Column()
  name_en: string;
}

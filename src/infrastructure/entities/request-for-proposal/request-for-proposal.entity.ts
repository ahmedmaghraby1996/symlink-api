import { BaseEntity } from 'src/infrastructure/base/base.entity';
import {
  Entity,
  Column,
  CreateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { MetaData } from '../meta-data/meta-data.entity';
import { MetaDataType } from 'src/infrastructure/data/enums/meta-data-type.enum';
import { Category } from '../category/category.entity';

@Entity()
export class RequestForProposal extends BaseEntity {
  @Column()
  internal_applications_num: number;

  @Column()
  external_applications_num: number;

  @ManyToOne(() => MetaData, (metaData) => metaData.request_for_proposal)
  @JoinColumn({ name: 'assessments_type_id' })
  assessments_type: MetaData;

  @Column()
  assessments_type_id: string;

  @ManyToOne(() => Category, (category) => category.meta_data)
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @Column()
  category_id: string;
}

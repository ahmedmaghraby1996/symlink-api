import { BaseEntity } from 'src/infrastructure/base/base.entity';
import {
    Entity,
    Column,
    CreateDateColumn,
    OneToMany,
} from 'typeorm';
import { MetaData } from '../meta-data/meta-data.entity';

@Entity()
export class Category extends BaseEntity {

    @Column()
    name_ar: string;

    @Column()
    name_en: string;

    @OneToMany(() => MetaData, (metaData) => metaData.category)
    meta_data: MetaData[]
}
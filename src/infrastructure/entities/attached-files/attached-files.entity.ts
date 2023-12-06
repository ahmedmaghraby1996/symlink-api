import { AuditableEntity } from 'src/infrastructure/base/auditable.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { MultiRFP } from '../multi-rfp/multi-rfp.entity';
import { AttachedFilesType } from 'src/infrastructure/data/enums/attached-files-type';

@Entity()
export class AttachedFiles extends AuditableEntity {
  @Column()
  type:string

  @Column()
  name: string;

  @Column()
  url: string;

  @ManyToOne(() => MultiRFP, (multiRfp) => multiRfp.attachedFiles,{onDelete: 'CASCADE'})
  @JoinColumn()
  multi_RFP: MultiRFP;

  @Column()
  multi_RFP_id: string;
}

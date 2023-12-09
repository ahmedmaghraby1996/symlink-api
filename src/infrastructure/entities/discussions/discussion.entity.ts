import { AuditableEntity } from 'src/infrastructure/base/auditable.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne } from 'typeorm';
import { MultiRFP } from '../multi-rfp/multi-rfp.entity';
import { Message } from './message.entity';

@Entity()
export class Discussion extends AuditableEntity {
    @Column({ nullable: false, default: false })
    is_private: boolean;

    @OneToOne(() => MultiRFP, (rfp) => rfp.discussions)
    multi_RFP: MultiRFP;

    @OneToMany(() => Message, (message) => message.discussion)
    messages: Message[];
}

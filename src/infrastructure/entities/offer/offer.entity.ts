import { AuditableEntity } from 'src/infrastructure/base/auditable.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { User } from '../user/user.entity';
import { MultiRFP } from '../multi-rfp/multi-rfp.entity';
import { Duration } from 'src/infrastructure/data/enums/duration.enum';

@Entity()
export class Offer extends AuditableEntity {
  @ManyToOne(() => User, (user) => user.offers, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  user_id: string;

  @ManyToOne(() => MultiRFP, (MultiRFP) => MultiRFP.offers, {
    onDelete: 'CASCADE',
  })
  multi_RFP: MultiRFP;

  @Column()
  multi_RFP_id: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  price: number;

  @Column({
    type: 'enum',
    enum: Duration,
  })
  duration: Duration;

  @Column()
  duration_num: number;


  @Column({default : false})
  is_accepted: boolean;

  @Column({nullable: true})
  acceptedAt: Date;

  @Column({default : false})
  is_anonymous: boolean;
}

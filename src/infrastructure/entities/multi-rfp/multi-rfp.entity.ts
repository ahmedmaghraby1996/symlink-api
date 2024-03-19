import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { RequestForProposal } from '../request-for-proposal/request-for-proposal.entity';
import { AuditableEntity } from 'src/infrastructure/base/auditable.entity';
import { User } from '../user/user.entity';
import { RequestForProposalStatus } from 'src/infrastructure/data/enums/request-for-proposal.enum';
import { AttachedFiles } from '../attached-files/attached-files.entity';
import { Offer } from '../offer/offer.entity';
import { Message } from '../discussions/message.entity';
import { PreferredTestingTime } from 'src/infrastructure/data/enums/prefered-testing-times.types';

@Entity()
export class MultiRFP extends AuditableEntity {
  @OneToMany(
    () => RequestForProposal,
    (requestForProposal) => requestForProposal.multi_RFP,
    { cascade: true }
  )
  request_for_proposal: RequestForProposal[];

  @OneToMany(
    () => AttachedFiles,
    (attachedFiles) => attachedFiles.multi_RFP,
    { cascade: true }
  )
  attachedFiles: AttachedFiles[];

  @OneToMany(
    () => Offer,
    (offer) => offer.multi_RFP,
    { cascade: true }
  )
  offers: Offer[];

  @Column({ nullable: true , default: 0 })
  number_of_offers: number;

  @Column({
    type: 'enum',
    enum: RequestForProposalStatus,
    default: RequestForProposalStatus.PENDING,
  })
  request_for_proposal_status: RequestForProposalStatus;

  @Column()
  project_name: string;

  @ManyToOne(() => User, (user) => user.multi_RFP, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  user_id: string;

  @Column({ nullable: true })
  provider_id: string;

  // What is the preferred testing time
  @Column({ type: 'set', enum: PreferredTestingTime, default: [PreferredTestingTime.NOT_PREFFERED] })
  preferred_testing_time: PreferredTestingTime[];

  @Column()
  expiration_date: Date;

  @Column({ nullable: true})
  firstFullName: string;

  @Column({ nullable: true})
  firstEmail: string;

  @Column({ nullable: true})
  firstMobile: string;

  @Column({ nullable: true})
  secondFullName: string;

  @Column({ nullable: true})
  secondEmail: string;

  @Column({ nullable: true})
  secondMobile: string;

  @OneToMany(() => Message, (message) => message.multi_RFP, { cascade: true })
  messages: Message[];
}

import { Entity, Column, ManyToOne, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { AuditableEntity } from 'src/infrastructure/base/auditable.entity';
import { User } from '../user/user.entity';
import { Reply } from './reply.entity';
import { DiscussionAttachment } from './discussion-attachment.entity';
import { MultiRFP } from '../multi-rfp/multi-rfp.entity';

@Entity()
export class Message extends AuditableEntity {
  @Column('text')
  body_text: string;

  @ManyToOne(() => MultiRFP, (rfp) => rfp.messages, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'multi_rfp_id' })
  multi_RFP: MultiRFP;

  @Column({ nullable: false })
  multi_rfp_id: string;

  @ManyToOne(() => User, (user) => user.messages, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ nullable: false })
  user_id: string;

  @OneToMany(() => Reply, (reply) => reply.message, { cascade: true })
  replies: Reply[];

  @OneToOne(() => DiscussionAttachment, (attachment) => attachment.message, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'attachment_id' })
  attachment: DiscussionAttachment;

  @Column({ nullable: true })
  attachment_id: string;

  @Column({ default: 0 })
  replies_count: number;
}
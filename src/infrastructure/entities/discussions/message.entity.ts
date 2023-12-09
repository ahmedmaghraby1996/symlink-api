import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Discussion } from './discussion.entity';
import { AuditableEntity } from 'src/infrastructure/base/auditable.entity';
import { User } from '../user/user.entity';
import { Reply } from './reply.entity';
import { DiscussionAttachment } from './discussion-attachment.entity';
import { Reaction } from './reaction.entity';

@Entity()
export class Message extends AuditableEntity {
  @Column('text')
  message_content: string;

  @ManyToOne(() => Discussion, (discussion) => discussion.messages)
  discussion: Discussion;

  @ManyToOne(() => User, (user) => user.messages, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => Reply, (reply) => reply.message)
  replies: Reply[];

  @OneToMany(() => DiscussionAttachment, (attachment) => attachment.message)
  attachments: DiscussionAttachment[];

  @OneToMany(() => Reaction, (reaction) => reaction.message)
  reactions: Reaction[];
}
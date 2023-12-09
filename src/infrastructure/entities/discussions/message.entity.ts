import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Discussion } from './discussion.entity';
import { AuditableEntity } from 'src/infrastructure/base/auditable.entity';
import { User } from '../user/user.entity';

@Entity()
export class Message extends AuditableEntity {
  @Column('text')
  message_content: string;

  @ManyToOne(() => Discussion, (discussion) => discussion.messages)
  discussion: Discussion;

  @ManyToOne(() => User, (user) => user.messages, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
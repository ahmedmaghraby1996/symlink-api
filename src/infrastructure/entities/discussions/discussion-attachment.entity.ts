import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Message } from './message.entity';
import { Reply } from './reply.entity';
import { AuditableEntity } from 'src/infrastructure/base/auditable.entity';

@Entity()
export class DiscussionAttachment extends AuditableEntity {
  @Column()
  attachment_type: string;

  @Column()
  file_name: string;

  @Column()
  file_path: string;

  @ManyToOne(() => Message, (message) => message.attachments)
  @JoinColumn({ name: 'message_id' })
  message: Message;

  @Column()
  message_id: string;

  @ManyToOne(() => Reply, (reply) => reply.attachments)
  @JoinColumn({ name: 'reply_id' })
  reply: Reply;

  @Column()
  reply_id: string;
}
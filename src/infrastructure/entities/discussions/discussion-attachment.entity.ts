import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Message } from './message.entity';
import { Reply } from './reply.entity';
import { AuditableEntity } from 'src/infrastructure/base/auditable.entity';

@Entity()
export class DiscussionAttachment extends AuditableEntity{
  @Column()
  attachment_type: string;

  @Column()
  file_name: string;

  @Column()
  file_path: string;

  @ManyToOne(() => Message, (message) => message.attachments)
  message: Message;

  @ManyToOne(() => Reply, (reply) => reply.attachments)
  reply: Reply;
}
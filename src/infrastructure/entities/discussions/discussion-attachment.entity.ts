import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToOne } from 'typeorm';
import { Message } from './message.entity';
import { Reply } from './reply.entity';
import { AuditableEntity } from 'src/infrastructure/base/auditable.entity';

@Entity()
export class DiscussionAttachment extends AuditableEntity {
  @Column()
  file_type: string;

  @Column()
  file_name: string;

  @Column()
  file_url: string;

  @OneToOne(() => Message, (message) => message.attachment)
  message: Message;

  @OneToOne(() => Reply, (reply) => reply.attachment)
  reply: Reply;

}
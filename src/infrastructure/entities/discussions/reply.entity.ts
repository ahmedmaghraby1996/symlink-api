import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { Message } from "./message.entity";
import { AuditableEntity } from "src/infrastructure/base/auditable.entity";
import { User } from "../user/user.entity";
import { DiscussionAttachment } from "./discussion-attachment.entity";

@Entity()
export class Reply extends AuditableEntity {
    @Column('text')
    reply_content: string;

    @ManyToOne(() => Message, (message) => message.replies, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'message_id' })
    message: Message;

    @Column()
    message_id: string;

    @ManyToOne(() => User, (user) => user.replies, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ nullable: false })
    user_id: string;

    @ManyToOne(() => Reply, (reply) => reply.replies, { nullable: true })
    @JoinColumn({ name: 'parent_reply_id' })
    parent_reply: Reply;

    @Column()
    parent_reply_id: string;

    @OneToMany(() => Reply, (reply) => reply.parent_reply)
    replies: Reply[];

    @OneToMany(() => DiscussionAttachment, (attachment) => attachment.reply)
    attachments: DiscussionAttachment[];

}
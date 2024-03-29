import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from "typeorm";
import { Message } from "./message.entity";
import { AuditableEntity } from "src/infrastructure/base/auditable.entity";
import { User } from "../user/user.entity";
import { DiscussionAttachment } from "./discussion-attachment.entity";

@Entity()
export class Reply extends AuditableEntity {
    @Column('text')
    body_text: string;

    @ManyToOne(() => Message, (message) => message.replies, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'message_id' })
    message: Message;

    @Column({ nullable: true })
    message_id: string;

    @ManyToOne(() => User, (user) => user.replies, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ nullable: false })
    user_id: string;

    @ManyToOne(() => Reply, (reply) => reply.replies, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'parent_reply_id' })
    parent_reply: Reply;

    @Column({ nullable: true })
    parent_reply_id: string;

    @OneToMany(() => Reply, (reply) => reply.parent_reply)
    replies: Reply[];

    @OneToOne(() => DiscussionAttachment, (attachment) => attachment.reply, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'attachment_id' })
    attachment: DiscussionAttachment;

    @Column({ nullable: true })
    attachment_id: string;

    @Column({ default: 0 })
    replies_count: number;

    @Column({ default: true })
    is_anynmous: boolean;
}
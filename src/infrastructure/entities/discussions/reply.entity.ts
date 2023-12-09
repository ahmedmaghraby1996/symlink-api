import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { Message } from "./message.entity";
import { AuditableEntity } from "src/infrastructure/base/auditable.entity";
import { User } from "../user/user.entity";
import { DiscussionAttachment } from "./discussion-attachment.entity";
import { Reaction } from "./reaction.entity";

@Entity()
export class Reply extends AuditableEntity {
    @Column('text')
    reply_content: string;

    @ManyToOne(() => Message, (message) => message.replies, { onDelete: 'CASCADE' })
    message: Message;

    @ManyToOne(() => User, (user) => user.replies, { onDelete: 'CASCADE' })
    user: User;

    @OneToMany(() => DiscussionAttachment, (attachment) => attachment.reply)
    attachments: DiscussionAttachment[];

    @OneToMany(() => Reaction, (reaction) => reaction.reply)
    reactions: Reaction[];
}
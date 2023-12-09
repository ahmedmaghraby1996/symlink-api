import { Entity, Column, ManyToOne } from 'typeorm';
import { Message } from './message.entity';
import { Reply } from './reply.entity';
import { User } from '../user/user.entity';
import { AuditableEntity } from 'src/infrastructure/base/auditable.entity';
import EmojiReactions from 'src/infrastructure/data/enums/emoji-reactions.enum';

@Entity()
export class Reaction extends AuditableEntity {
    @Column({
        type: 'enum',
        enum: EmojiReactions
    })
    reaction_type: EmojiReactions;

    @ManyToOne(() => Message, (message) => message.reactions, { onDelete: 'CASCADE' })
    message: Message;

    @ManyToOne(() => Reply, (reply) => reply.reactions, { onDelete: 'CASCADE' })
    reply: Reply;

    @ManyToOne(() => User, (user) => user.reactions, { onDelete: 'CASCADE' })
    user: User;
}
import { AuditableEntity } from 'src/infrastructure/base/auditable.entity';
import { Entity, Column, ManyToOne, JoinColumn, BeforeInsert, OneToMany } from 'typeorm';
import { User } from '../user/user.entity';
import { SupportTicketStatus } from 'src/infrastructure/data/enums/support-ticket-status.enum';
import { v4 as uuidv4 } from 'uuid';
import { TicketComment } from './ticket-comment.entity';

@Entity()
export class SupportTicket extends AuditableEntity {
    @ManyToOne(() => User, (user) => user.support_tickets, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ nullable: false })
    user_id: string;

    @OneToMany(() => TicketComment, (comment) => comment.ticket, { cascade: true })
    ticket_comments: TicketComment[];

    @Column({ nullable: false })
    subject: string;

    @Column({ nullable: false })
    description: string;

    @Column({
        type: 'enum',
        nullable: false,
        default: SupportTicketStatus.OPEN,
        enum: SupportTicketStatus
    })
    status: SupportTicketStatus;

    @Column({ nullable: false, unique: true })
    ticket_num: string;

    @BeforeInsert()
    async generateTicketNum() {
        const uuid = uuidv4();
        this.ticket_num = uuid.substr(0, 4) + '-' + uuid.substr(4, 4);
    }
}

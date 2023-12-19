import { AuditableEntity } from 'src/infrastructure/base/auditable.entity';
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../user/user.entity';
import { SupportTicket } from './support-ticket.entity';

@Entity()
export class TicketComment extends AuditableEntity {
    @ManyToOne(() => User, (user) => user.ticket_comments, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ nullable: false })
    user_id: string;

    @ManyToOne(()=> SupportTicket, (ticket) => ticket.ticket_comments, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'ticket_id' })
    ticket: SupportTicket;

    @Column({ nullable: false })
    ticket_id: string;

    @Column({ nullable: false })
    comment_text: string;
}

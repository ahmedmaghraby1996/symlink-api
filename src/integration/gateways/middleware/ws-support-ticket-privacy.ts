import { Socket } from 'socket.io';
import { Repository } from 'typeorm';
import { SupportTicket } from 'src/infrastructure/entities/support-ticket/support-ticket.entity';

type SocketIOMiddleWare = {
    (client: Socket, next: (err?: Error) => void);
};


export const SupportTicketPrivacyMiddleware = (
    suuportTicketRepository: Repository<SupportTicket>,
): SocketIOMiddleWare => {
    return async (client, next) => {
        try {
            const ticket_id: string = Array.isArray(client.handshake.query.ticket_id)
                ? client.handshake.query.ticket_id.join(',')
                : client.handshake.query.ticket_id;

            const supportTicket = await suuportTicketRepository.findOne({ where: { id: ticket_id } });
            if (!supportTicket) {
                throw new Error('RFP not found');
            }

            const user = client.user;
            if (!user) {
                throw new Error('User not found');
            }

            if (supportTicket.user_id != user.id) {
                throw new Error('You are not allowed to access this ticket');
            }

            next();
        } catch (error) {
            next(error);
        }
    };
};
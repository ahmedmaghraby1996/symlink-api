import { Inject, UseGuards } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Gateways } from 'src/core/base/gateways';
import { User } from 'src/infrastructure/entities/user/user.entity';
import { WsJwtAuthGuard } from 'src/modules/authentication/guards/ws-auth.guard';
import { SocketAuthMiddleware } from './middleware/ws-auth.mw';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SupportTicketPrivacyMiddleware } from './middleware/ws-support-ticket-privacy';
import { SupportTicket } from 'src/infrastructure/entities/support-ticket/support-ticket.entity';
import { TicketComment } from 'src/infrastructure/entities/support-ticket/ticket-comment.entity';
import { TicketCommentResponse } from 'src/modules/support-ticket/dto/response/ticket-comment.response';
import { Role } from 'src/infrastructure/data/enums/role.enum';

@WebSocketGateway({ namespace: Gateways.SupportTicket.Namespace, cors: { origin: '*' } })
@UseGuards(WsJwtAuthGuard)
export class SupportTicketGateway {
    constructor(
        private configService: ConfigService,
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(SupportTicket) private supportTicketRepository: Repository<SupportTicket>
    ) { }

    @WebSocketServer()
    server: Server;

    afterInit(client: Socket) {
        client.use(SocketAuthMiddleware(this.configService, this.userRepository) as any);
        client.use(SupportTicketPrivacyMiddleware(this.supportTicketRepository) as any);
    }

    handleSendMessage(payload: { supportTicket: SupportTicket, ticketComment: TicketCommentResponse, action: string }) {
        const ticketOwnerId = payload.supportTicket.user_id;
        const connectedSockets: any = this.server.sockets
       
        connectedSockets.forEach(socket => {
            if (socket.user && (socket.user.id === ticketOwnerId || socket.user.roles.includes(Role.ADMIN))) {
                socket.emit(`support_ticket_${payload.supportTicket.id}`, payload);
            }
        });
    }
}
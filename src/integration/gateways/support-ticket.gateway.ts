import { UseGuards } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Gateways } from 'src/core/base/gateways';
import { User } from 'src/infrastructure/entities/user/user.entity';
import { WsJwtAuthGuard } from 'src/modules/authentication/guards/ws-auth.guard';
import { SocketAuthMiddleware } from './middleware/ws-auth.mw';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@WebSocketGateway({ namespace: Gateways.Discussion.Namespace, cors: { origin: '*' } })
@UseGuards(WsJwtAuthGuard)
export class SupportTicketGateway {
    constructor(
        private configService: ConfigService,
        @InjectRepository(User) private userRepository: Repository<User>,
    ) { }

    @WebSocketServer()
    server: Server;

    afterInit(client: Socket) {
        client.use(SocketAuthMiddleware(this.configService, this.userRepository) as any);
    }

    handleSendMessage() {
    }
}
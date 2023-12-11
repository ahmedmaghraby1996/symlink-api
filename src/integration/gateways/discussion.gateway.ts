import { UseGuards } from '@nestjs/common';
import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Gateways } from 'src/core/base/gateways';
import { Message } from 'src/infrastructure/entities/discussions/message.entity';
import { Reply } from 'src/infrastructure/entities/discussions/reply.entity';
import { User } from 'src/infrastructure/entities/user/user.entity';
import { WsJwtAuthGuard } from 'src/modules/authentication/guards/ws-auth.guard';
import { SocketAuthMiddleware } from './middleware/ws-auth.mw';
import { ConfigService } from '@nestjs/config';

@WebSocketGateway({ namespace: Gateways.Discussion.Namespace, cors: { origin: '*' } })
@UseGuards(WsJwtAuthGuard)
export class DiscussionGateway {
    constructor(private configService: ConfigService) { }

    @WebSocketServer()
    server: Server;

    afterInit(client: Socket) {
        client.use(SocketAuthMiddleware(this.configService) as any);
    }

    handleSendMessage(payload: { rfp_id: string, action: string, entity_type: string, entity: Message | Reply }) {
        this.server.emit(`discussion_${payload.rfp_id}`, payload);
    }
}
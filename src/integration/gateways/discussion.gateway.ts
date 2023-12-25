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
import { RfpDiscussionPrivacyMiddleware } from './middleware/ws-rfp-discussion-privacy.mw';
import { InjectRepository } from '@nestjs/typeorm';
import { MultiRFP } from 'src/infrastructure/entities/multi-rfp/multi-rfp.entity';
import { Repository } from 'typeorm';
import { Offer } from 'src/infrastructure/entities/offer/offer.entity';
import { MessageResponse } from 'src/modules/discussion/dto/response/message.response';

@WebSocketGateway({ namespace: Gateways.Discussion.Namespace, cors: { origin: '*' } })
@UseGuards(WsJwtAuthGuard)
export class DiscussionGateway {
    constructor(
        private configService: ConfigService,
        @InjectRepository(MultiRFP) private multiRFPRepository: Repository<MultiRFP>,
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(Offer) private offersRepository: Repository<Offer>
    ) { }

    @WebSocketServer()
    server: Server;

    afterInit(client: Socket) {
        client.use(SocketAuthMiddleware(this.configService, this.userRepository) as any);
        client.use(RfpDiscussionPrivacyMiddleware(this.multiRFPRepository, this.offersRepository) as any);
    }

    handleSendMessage(payload: { multi_RFP: MultiRFP, action: string, entity_type: string, entity: MessageResponse}) {
        this.server.emit(`discussion_${payload.multi_RFP.id}`, payload);
    }
}
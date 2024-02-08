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
import { RequestForProposalStatus } from 'src/infrastructure/data/enums/request-for-proposal.enum';

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

    private async emitToAuthorizedSockets(room: string, payload: any) {
        const connectedSockets: any = this.server.sockets;
        connectedSockets.forEach(socket => {
            if (
                socket.user &&
                (
                    socket.user.id === payload.multi_RFP.user_id ||
                    socket.user.id === payload.multi_RFP.provider_id ||
                    socket.user.roles.includes('ADMIN')
                )
            ) {
                socket.emit(room, payload);
            }
        });
    }

    private async sendEventToRoom(room: string, payload: any) {
        this.server.emit(room, payload);
    }

    async handleSendMessage(payload: { multi_RFP: MultiRFP, action: string, entity_type: string, entity: MessageResponse }) {
        const { multi_RFP, ...payloadWithoutMultiRFP } = payload;

        if (payload.multi_RFP.request_for_proposal_status === RequestForProposalStatus.APPROVED) {
            await this.emitToAuthorizedSockets(`discussion_${payload.multi_RFP.id}`, payloadWithoutMultiRFP);
        } else {
            await this.sendEventToRoom(`discussion_${payload.multi_RFP.id}`, payloadWithoutMultiRFP);
        }
    }

    async handleSendReply(payload: { multi_RFP: MultiRFP, action: string, entity_type: string, entity: MessageResponse }) {
        const message_id = payload.entity.message_id || payload.entity.parent_reply_id;
        const { multi_RFP, ...payloadWithoutMultiRFP } = payload;
        
        if (payload.multi_RFP.request_for_proposal_status === RequestForProposalStatus.APPROVED) {
            await this.emitToAuthorizedSockets(`message_${message_id}`, payloadWithoutMultiRFP);
        } else {
            await this.sendEventToRoom(`message_${message_id}`, payloadWithoutMultiRFP);
        }
    }
}
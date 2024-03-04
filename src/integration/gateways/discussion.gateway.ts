import { BadGatewayException, BadRequestException, UseGuards } from '@nestjs/common';
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
import { DiscussionPayload } from './interface/discussion-payload.interface';

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

    private async emitToAuthorizedSockets(room: string, payload: DiscussionPayload) {
        const connectedSockets: any = this.server.sockets;

        connectedSockets.forEach(socket => {
            if (payload.entity.is_anynmous === true && socket.user.id !== payload.entity.user_id) {
                if (socket.user.id !== payload.entity.user_id) {
                    delete payload.entity.user_id;
                    delete payload.entity.user;
                }
            }

            if (
                payload.multi_RFP?.request_for_proposal_status === RequestForProposalStatus.APPROVED &&
                socket.user &&
                (
                    socket.user.id === payload.multi_RFP.user_id ||
                    socket.user.id === payload.multi_RFP.provider_id ||
                    socket.user.roles.includes('ADMIN')
                )
            ) {
                delete payload.multi_RFP;
                socket.emit(room, payload);
            } else if (
                payload.multi_RFP?.request_for_proposal_status !== RequestForProposalStatus.APPROVED
            ) {
                delete payload.multi_RFP;
                socket.emit(room, payload);
            } 
        });
    }

    async handleSendMessage(payload: DiscussionPayload) {
        const { entity, multi_RFP, entity_type } = payload;
        let room: string;

        if (entity_type === 'Reply') {
            const message_id = entity.message_id || entity.parent_reply_id;
            room = `message_${message_id}`;
        } else if (entity_type === 'Message') {
            room = `discussion_${multi_RFP.id}`;
        }

        await this.emitToAuthorizedSockets(room, payload);
    }
}
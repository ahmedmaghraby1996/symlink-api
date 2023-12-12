import { Socket } from 'socket.io';
import { Repository } from 'typeorm';
import { MultiRFP } from 'src/infrastructure/entities/multi-rfp/multi-rfp.entity';
import { Offer } from 'src/infrastructure/entities/offer/offer.entity';
import { RequestForProposalStatus } from 'src/infrastructure/data/enums/request-for-proposal.enum';

type SocketIOMiddleWare = {
    (client: Socket, next: (err?: Error) => void);
};


export const RfpDiscussionPrivacyMiddleware = (
    multiRFPRepository: Repository<MultiRFP>,
    offersRepository: Repository<Offer>
): SocketIOMiddleWare => {
    return async (client, next) => {
        try {
            const multi_RFP_id: string = Array.isArray(client.handshake.query.multi_rfp_id)
                ? client.handshake.query.multi_rfp_id.join(',')
                : client.handshake.query.multi_rfp_id;

            const multipRFP = await multiRFPRepository.findOne({ where: { id: multi_RFP_id } });
            if (!multipRFP) {
                throw new Error('RFP not found');
            }

            const user = client.user;
            if (!user) {
                throw new Error('User not found');
            }

            if (multipRFP.request_for_proposal_status == RequestForProposalStatus.APPROVED) {
                if (user.id !== multipRFP.user_id) {
                    const offer = await offersRepository.findOne({
                        where: {
                            multi_RFP_id: multi_RFP_id,
                            is_accepted: true
                        },
                    });

                    if (!offer || offer.user_id !== user.id) {
                        throw new Error('You are not allowed to access this discussion');
                    }
                }
            }

            next();
        } catch (error) {
            next(error);
        }
    };
};
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Gateways } from 'src/core/base/gateways';
import { SocketAuthMiddleware } from './middleware/ws-auth.mw';
import { ConfigService } from '@nestjs/config';
import { Offer } from 'src/infrastructure/entities/offer/offer.entity';
@WebSocketGateway({ namespace: Gateways.Offer.Namespace, cors: { origin: '*' } })
export class OfferGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
  constructor(private configService: ConfigService) { }

  @WebSocketServer()
  server: Server;

  handleConnection(client: any) {
    console.log('Order connected', client.id);
    // set the driver as online
  }

  handleNewOffer(payload: { multip_RFP_id: string, offer: Offer }) {
    this.server.emit(
      `${Gateways.Offer.offerCreated}${payload.multip_RFP_id}`,
      {
        action: 'ADD_NEW_OFFER',
        data: {
          offer: payload.offer,
        },
      },
    );
  }
  handleDisconnect(client: any) {
    console.log(`Order disconnected ${client.id}`);
    // set the driver as offline
  }

  afterInit(client: Socket) {
    client.use(SocketAuthMiddleware(this.configService) as any);
  }
}

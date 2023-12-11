import { ConfigService } from '@nestjs/config';
import { Socket } from 'socket.io';
import * as jwt from 'jsonwebtoken';

type SocketIOMiddleWare = {
    (client: Socket, next: (err?: Error) => void);
};

export const SocketAuthMiddleware = (
    configService: ConfigService,
): SocketIOMiddleWare => {
    return (client, next) => {
        try {
            const authToken = client.handshake.headers.authorization?.split(' ')[1];
            jwt.verify(authToken, configService.get('app.key'))
            next();
        } catch (error) {
            next(error);
        }
    };
};
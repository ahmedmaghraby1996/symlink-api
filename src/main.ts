import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import SwaggerSetup from './core/setups/swagger.setup';
import * as compression from 'compression';
import helmet from 'helmet';
import { Logger, RequestMethod, ValidationPipe } from '@nestjs/common';
import { useContainer } from 'class-validator';

async function bootstrap() {
  
  const app = await NestFactory.create(AppModule);
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  const config = app.get<ConfigService>(ConfigService);
  const app_env = config.get('APP_ENV');
  app.enableCors();
 if(app_env == 'production') app.use(helmet()); // helmet
  app.use(compression());
  app.setGlobalPrefix('v1', {
    exclude: [{ path: 'swagger', method: RequestMethod.GET }],
  });

 

  if (app_env !== 'production') {
 console.log(app_env)
    Logger.log(`App running on ${app_env} environment`);
    SwaggerSetup(app, config);
  }

  
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: false,
      forbidUnknownValues: false,
      errorHttpStatusCode: 422,
    }),
  );

  await app.listen(config.get('APP_PORT'));
}
bootstrap();

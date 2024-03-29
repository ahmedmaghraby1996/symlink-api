import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AddressModule } from 'src/modules/address/address.module';
import { AttachedFilesModule } from 'src/modules/attached-files/attached-files.module';
import { AuthenticationModule } from 'src/modules/authentication/authentication.module';
import { CategoryModule } from 'src/modules/category/category.module';
import { DiscussionModule } from 'src/modules/discussion/discussion.module';
import { FileModule } from 'src/modules/file/file.module';
import { MultiRfpModule } from 'src/modules/multi-rfp/multi-rfp.module';
import { OffersModule } from 'src/modules/offers/offers.module';
import { ProviderModule } from 'src/modules/provider/provider.module';
import { RequestForProposalModule } from 'src/modules/request-for-proposal/request-for-proposal.module';
import { StaticPageModule } from 'src/modules/static-page/static-page.module';
import { SupportTicketModule } from 'src/modules/support-ticket/support-ticket.module';
import { UserModule } from 'src/modules/user/user.module';

export default (app: INestApplication, config: ConfigService) => {
  const operationIdFactory = (controllerKey: string, methodKey: string) =>
    methodKey;
   console.log( config.get('APP_HOST'))
  const publicConfig = new DocumentBuilder()
    .addBearerAuth()
    .setTitle(`${config.get('APP_NAME')} API`)
    .setDescription(`${config.get('APP_NAME')} API description`)
    .setVersion('v1')
    .setContact('Contact', 'https://github.com/mahkassem', 'mahmoud.ali.kassem@gmail.com')
    .setLicense('Developed by Mahmoud Kassem', 'https://github.com/mahkassem')
    .addServer(config.get('APP_HOST'))
    .build();

  const publicDocument = SwaggerModule.createDocument(app, publicConfig, {
    include: [
      AuthenticationModule,
      UserModule,
      AddressModule,
      FileModule,
      CategoryModule,
      ProviderModule,
      MultiRfpModule,
      AttachedFilesModule,
      OffersModule,
      DiscussionModule,
      SupportTicketModule,
      StaticPageModule
     // RequestForProposalModule,
     
    ],
    operationIdFactory,
  });

  SwaggerModule.setup('swagger', app, publicDocument);
};

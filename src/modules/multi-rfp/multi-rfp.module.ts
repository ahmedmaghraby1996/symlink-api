import { Module } from '@nestjs/common';
import { MultiRfpController } from './multi-rfp.controller';
import { MultiRfpService } from './multi-rfp.service';

@Module({
  controllers: [MultiRfpController],
  providers: [MultiRfpService]
})
export class MultiRfpModule {}

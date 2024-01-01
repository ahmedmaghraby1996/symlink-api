import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { MultiRfpService } from '../multi-rfp.service';
import { InjectRepository } from '@nestjs/typeorm';
import { MultiRFP } from 'src/infrastructure/entities/multi-rfp/multi-rfp.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RfpOwnerGuard implements CanActivate {
    constructor(
        @InjectRepository(MultiRFP) private multiRFPRepository: Repository<MultiRFP>
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const { multi_RFP_id } = request.params;
        const rfp = await this.multiRFPRepository.findOne({ where: { id: multi_RFP_id } , relations: ['user'] })
        return rfp.user.id === request.user.id;
    }
}
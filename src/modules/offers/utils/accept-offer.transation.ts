import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BaseTransaction } from 'src/core/base/database/base.transaction';
import { DataSource, EntityManager } from 'typeorm';
import { Request } from 'express';
import { REQUEST } from '@nestjs/core';

import { plainToInstance } from 'class-transformer';
import { Offer } from 'src/infrastructure/entities/offer/offer.entity';
import { MultiRFP } from 'src/infrastructure/entities/multi-rfp/multi-rfp.entity';
import { RequestForProposalStatus } from 'src/infrastructure/data/enums/request-for-proposal.enum';

@Injectable()
export class AcceptOfferTransaction extends BaseTransaction<
  { offer_id: string; multi_RFP_id: string },
  Offer
> {
  constructor(
    dataSource: DataSource,
    @Inject(REQUEST) readonly request: Request,
  ) {
    super(dataSource);
  }

  // the important thing here is to use the manager that we've created in the base class
  protected async execute(
    query: { offer_id: string; multi_RFP_id: string },
    context: EntityManager,
  ): Promise<Offer> {
    try {
      const { offer_id, multi_RFP_id } = query;
      const multiRFP = await context.findOne(MultiRFP, {
        where: { id: multi_RFP_id },
      });
      
      if (!multiRFP) {
        throw new NotFoundException('This Project not found');
      }

      if (
        multiRFP.request_for_proposal_status !==
        RequestForProposalStatus.PENDING
      ) {
        throw new BadRequestException('You cannot accept this offer');
      }

      const offer = await context.findOne(Offer, {
        where: {
          id: offer_id,
          multi_RFP_id: multi_RFP_id,
        },
      });
      if (!offer) {
        throw new NotFoundException('Offer not found');
      }

      offer.is_accepted = true;
      offer.acceptedAt = new Date();
      multiRFP.request_for_proposal_status = RequestForProposalStatus.APPROVED;
      multiRFP.provider_id =offer.user_id;
      await context.save(multiRFP);
      const offer_accepted = await context.save(offer);

      return offer_accepted;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}

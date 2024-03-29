import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Request } from 'express';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/core/base/service/service.base';
import { MultiRFP } from 'src/infrastructure/entities/multi-rfp/multi-rfp.entity';
import { Repository } from 'typeorm';
import { Offer } from 'src/infrastructure/entities/offer/offer.entity';
import { CreateOfferRequest } from './dto/create-offer.request';
import { Gateways } from 'src/core/base/gateways';
import { OfferGateway } from 'src/integration/gateways/offer.gateway';
import { RequestForProposalStatus } from 'src/infrastructure/data/enums/request-for-proposal.enum';
import { OfferFilterRequest } from './dto/offer-filter.request';
import { AcceptOfferTransaction } from './utils/accept-offer.transation';
import { OfferSortyBy } from 'src/infrastructure/data/enums/offer-sortby.enum';
import { Role } from 'src/infrastructure/data/enums/role.enum';

@Injectable()
export class OffersService extends BaseService<Offer> {
  constructor(
    @Inject(OfferGateway) private offerGateway: OfferGateway,
    @Inject(AcceptOfferTransaction)
    private acceptOfferTransaction: AcceptOfferTransaction,

    @InjectRepository(Offer)
    private offersRepository: Repository<Offer>,
    @InjectRepository(MultiRFP)
    private multiRFPRepository: Repository<MultiRFP>,
    @Inject(REQUEST) private readonly request: Request,
  ) {
    super(offersRepository);
  }

  async getAllOffersForProject(
    multi_RFP_id: string,
    offerFilterRequest: OfferFilterRequest,
  ) {
    const { page, limit, search_by_name, sort_by, order } = offerFilterRequest;

    const skip = (page - 1) * limit;
    const queryBuilder = this.offersRepository.createQueryBuilder("offers")
      .where("offers.multi_RFP_id = :multi_RFP_id", { multi_RFP_id })
      .leftJoinAndSelect('offers.multi_RFP', 'multi_RFP')
      .leftJoinAndSelect('offers.user', 'user')

    if (sort_by) {
      if (sort_by == OfferSortyBy.BIDER_NAME) {
        queryBuilder.orderBy(`user.name`, order as 'ASC' | 'DESC')
      } else {
        queryBuilder.orderBy(`offers.${sort_by}`, order as 'ASC' | 'DESC')
      }
    }

    if (search_by_name) {
      queryBuilder.andWhere('multi_RFP.project_name Like :projectName', {
        projectName: `%${search_by_name}%`,
      });
    }

    const [offers, count] = await queryBuilder
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    if (
      offers[0].multi_RFP.user_id !== this.request.user.id &&
      !this.request.user.roles.includes(Role.ADMIN)
    ) {
      throw new NotFoundException('You are not allowed to see this bids');
    }

    return { offers, count };
  }

  async addOfferToProject(createOfferRequest: CreateOfferRequest) {
    const { multi_RFP_id } = createOfferRequest;
    const new_Offer = this.offersRepository.create(createOfferRequest);
    new_Offer.user_id = this.request.user.id;

    const multiRFP = await this.multiRFPRepository.findOne({
      where: { id: multi_RFP_id },
    });
    if (!multiRFP) {
      throw new NotFoundException('This Project not found');
    }

    if (multiRFP.user_id === this.request.user.id) {
      throw new NotFoundException('You will not be able to submit an offer');
    }

    const current_offer = await this.offersRepository.findOne({
      where: {
        user_id: this.request.user.id,
        multi_RFP_id: multi_RFP_id,
      },
    });
    if (current_offer) {
      throw new BadRequestException('You have already made an offer');
    }
    const offer = await this.offersRepository.save(new_Offer);

    // increase number of offers
    multiRFP.number_of_offers += 1;
    await this.multiRFPRepository.save(multiRFP);

    this.offerGateway.handleNewOffer({
      multip_RFP_id: multi_RFP_id,
      offer: offer,
    });

    return offer;
  }

  async acceptOffer(offer_id: string, multi_RFP_id: string) {
    return this.acceptOfferTransaction.run({ offer_id, multi_RFP_id });
  }

  async getAcceptedOffer(multi_RFP_id: string) {
    const offer = await this.offersRepository.findOne({
      where: {
        multi_RFP_id: multi_RFP_id,
        is_accepted: true
      },
    });

    if (!offer) {
      throw new NotFoundException('No offer founds or not accepted yet');
    }

    return offer;
  }
}

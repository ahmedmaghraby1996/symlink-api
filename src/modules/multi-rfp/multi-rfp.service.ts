import { BadRequestException, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { RequestForProposal } from 'src/infrastructure/entities/request-for-proposal/request-for-proposal.entity';
import { Repository } from 'typeorm';
import { Request } from 'express';
import { MultiRFP } from 'src/infrastructure/entities/multi-rfp/multi-rfp.entity';
import { CreateMultiRFPRequest } from './dto/create-multi-RFP.request';
import { plainToInstance } from 'class-transformer';
import { RequestForProposalService } from '../request-for-proposal/request-for-proposal.service';
import { MultiRFPResponse } from './dto/multi-rfp.response';
import { BaseService } from 'src/core/base/service/service.base';
import { PaginatedRequest } from 'src/core/base/requests/paginated.request';
import { applyQueryFilters } from 'src/core/helpers/service-related.helper';
import { MultiRFPFilterRequest } from './dto/multiRFP-filter.request';
import { RequestForProposalStatus } from 'src/infrastructure/data/enums/request-for-proposal.enum';
import { UpdateMultiRFPRequest } from './dto/update-multi-RFP.request';
@Injectable()
export class MultiRfpService extends BaseService<MultiRFP> {
  constructor(
    @InjectRepository(RequestForProposal)
    private requestForProposalRepository: Repository<RequestForProposal>,
    @InjectRepository(MultiRFP)
    private multiRFPRepository: Repository<MultiRFP>,
    @Inject(REQUEST) private readonly request: Request,
    @Inject(RequestForProposalService) private readonly requestforPrposal: RequestForProposalService,
  ) {
    super(multiRFPRepository);
  }
  async createMultiRFP(createMultiRFPRequest: CreateMultiRFPRequest) {
    const {
      projects,
      project_name,
      time_type_id,
      expiration_date,
      firstFullName,
      firstEmail,
      firstMobile,
      secondEmail,
      secondFullName,
      secondMobile,
    } = createMultiRFPRequest;

    const multiRFP = this.multiRFPRepository.create({
      user_id: this.request.user.id,
      project_name,
      time_type_id,
      expiration_date,
      firstFullName,
      firstEmail,
      firstMobile,
      secondEmail,
      secondFullName,
      secondMobile,
    });
    await this.multiRFPRepository.save(multiRFP);
    console.log('multiRFP', multiRFP);

    for (let index = 0; index < projects.length; index++) {
      const requestForProposalCreate = this.requestForProposalRepository.create(
        { ...projects[index], multi_RFP: multiRFP },
      );
      await this.requestForProposalRepository.save(requestForProposalCreate);
    }
    return await this.multiRFPRepository.save(multiRFP);
  }
  async clientGetMyAllMultiRFP(multiRFPFilterRequest: MultiRFPFilterRequest) {
    const { page, limit } = multiRFPFilterRequest;

    const skip = (page - 1) * limit;
    const [allMultiRFPForUser, count] = await this.multiRFPRepository.findAndCount({
      skip,
      take: limit,
      where: { user_id: this.request.user.id },
    });
    const allMultiRFPForUserDto = allMultiRFPForUser.map((item) => new MultiRFPResponse(item));
    return { allMultiRFPForUserDto, count };
  }
  async provideGetMyAllMultiRFP(multiRFPFilterRequest: MultiRFPFilterRequest) {
    const { page, limit } = multiRFPFilterRequest;

    const skip = (page - 1) * limit;
    const [allMultiRFPForUser, count] = await this.multiRFPRepository.findAndCount({
      skip,
      take: limit,
      where: {
        offers: {
          user_id: this.request.user.id,
          is_accepted: true,
        },
      },
      relations: { offers: true },
    });
    const allMultiRFPForUserDto = allMultiRFPForUser.map((item) => new MultiRFPResponse(item));

    return { allMultiRFPForUserDto, count };
  }
  async providerGetOffers(multiRFPFilterRequest: MultiRFPFilterRequest) {
    const { page, limit } = multiRFPFilterRequest;

    const skip = (page - 1) * limit;
    const [projects, count] = await this.multiRFPRepository.findAndCount({
      skip,
      take: limit,
      where: {
        request_for_proposal_status: RequestForProposalStatus.PENDING,
      },
      relations: { offers: true },
    });
    for (let index = 0; index < projects.length; index++) {

      projects[index].offers = projects[index].offers.filter((offer) => offer.is_accepted === false);
    }


    return { projects, count };
  }
  async getSingleMultiRFP(id: string) {
    const multiRFP = await this.multiRFPRepository.findOne({
      where: { id },
      relations: {
        user: true,
        time_type_meta_data: true,
        request_for_proposal: {
          category: true,
          assessments_type_meta_data: true,
          apis_size_meta_data: true,
          color_mobile_meta_data: true,
          average_applications_meta_data: true,
          evaluation_is_internal_or_external_meta_data: true,
        },
      },
    });
    if (!multiRFP) {
      throw new NotFoundException('This Project not found');
    }
    return new MultiRFPResponse(multiRFP);
  }

  async updateMultiRFP(id: string, updateMultiRFPRequest: UpdateMultiRFPRequest) {
    const multiRFP = await this.multiRFPRepository.findOne({ where: { id } });
    if (!multiRFP) {
      throw new NotFoundException('MultiRFP not found');
    }

    // Check if the user is the owner of the MultiRFP
    if (multiRFP.user_id !== this.request.user.id) {
      throw new UnauthorizedException('Only the owner of the MultiRFP can update it');
    }

    // Check if there is an accepted offer
    if (multiRFP.request_for_proposal_status === RequestForProposalStatus.APPROVED) {
      throw new UnauthorizedException('Cannot update MultiRFP with accepted offer');
    }

    // Update individual RFPs within the MultiRFP based on the provided request data.
    if (updateMultiRFPRequest.projects) {
      updateMultiRFPRequest.projects.forEach(async (request_for_proposal) => {
        await this.requestforPrposal.updateRequestForProposal(request_for_proposal);
      });
    }

    const updatedMultiRFP = plainToInstance(MultiRFP, updateMultiRFPRequest);
    updatedMultiRFP.id = multiRFP.id; // Ensure the ID remains the same

    const savedMultiRFP = await this.multiRFPRepository.save(updatedMultiRFP);

    return savedMultiRFP;
  }
}

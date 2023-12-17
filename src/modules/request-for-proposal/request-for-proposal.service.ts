import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RequestForProposal } from 'src/infrastructure/entities/request-for-proposal/request-for-proposal.entity';
import { Repository } from 'typeorm';
import { CreateRequestForProposalRequest } from './dto/create-request-for-proposal.request';
import { Request } from 'express';
import { REQUEST } from '@nestjs/core';
import { UserInfoResponse } from '../user/dto/response/profile.response';
import { RequestForProposalResponse } from './dto/request-for-proposal.response';
import { MetaData } from 'src/infrastructure/entities/meta-data/meta-data.entity';
import { plainToClass, plainToInstance } from 'class-transformer';
import { UpdateRequestForProposalRequest } from './dto/update-request-for-propsal.request';
@Injectable()
export class RequestForProposalService {
  constructor(
    @InjectRepository(RequestForProposal)
    private requestForProposalRepository: Repository<RequestForProposal>,
    @Inject(REQUEST) private readonly request: Request,
    @InjectRepository(MetaData)
    private metaDataRepository: Repository<MetaData>,
  ) { }

  async createRequestForProposal(
    createRequestForProposalRequest: CreateRequestForProposalRequest,
  ) {
    const requestForProposal = this.requestForProposalRepository.create(
      createRequestForProposalRequest,
    );
    return await this.requestForProposalRepository.save(requestForProposal);
  }

  async getAllRequestForProposal() {
    const requestForProposal = await this.requestForProposalRepository.find({
      where: {},
      relations: {
        category: true,
        assessments_type_meta_data: true,
        apis_size_meta_data: true,
        color_mobile_meta_data: true,
        average_applications_meta_data: true,
        evaluation_is_internal_or_external_meta_data: true,
      },
    });

    const listRequestForProposalDto = requestForProposal.map(item => new RequestForProposalResponse(item))
    return listRequestForProposalDto;
  }

  async updateRequestForProposal(requestForProposal: UpdateRequestForProposalRequest) {
    const requestForProposalUpdate = await this.requestForProposalRepository.findOne(
      { where: { id: requestForProposal.id } }
    );

    if (!requestForProposalUpdate) {
      throw new NotFoundException('Not found');
    }

    Object.assign(requestForProposalUpdate, requestForProposal);

    return await this.requestForProposalRepository.save(requestForProposalUpdate);
  }
}

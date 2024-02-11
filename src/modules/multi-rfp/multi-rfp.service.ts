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
import { MultiRFPFilterRequest } from './dto/multiRFP-filter.request';
import { RequestForProposalStatus } from 'src/infrastructure/data/enums/request-for-proposal.enum';
import { UpdateMultiRFPRequest } from './dto/update-multi-RFP.request';
import { AttachRequestForProposalRequest } from './dto/attach-request-for-propsal.request';
import { UploadFileRequest } from '../file/dto/requests/upload-file.request';
import { FileService } from '../file/file.service';
import { AttachmentRequestForProposal } from 'src/infrastructure/entities/request-for-proposal/attachment-request-for-propsal.entity';
@Injectable()
export class MultiRfpService extends BaseService<MultiRFP> {
  constructor(
    @InjectRepository(RequestForProposal)
    private requestForProposalRepository: Repository<RequestForProposal>,
    @InjectRepository(MultiRFP)
    private multiRFPRepository: Repository<MultiRFP>,
    @InjectRepository(AttachmentRequestForProposal)
    private readonly attachmentRequestForProposal: Repository<AttachmentRequestForProposal>,
    @Inject(REQUEST) private readonly request: Request,
    @Inject(RequestForProposalService) private readonly requestforPrposalService: RequestForProposalService,
    @Inject(FileService) private _fileService: FileService
  ) {
    super(multiRFPRepository);
  }
  async createMultiRFP(createMultiRFPRequest: CreateMultiRFPRequest) {
    const {
      projects,
      project_name,
      expiration_date,
      firstFullName,
      firstEmail,
      firstMobile,
      secondEmail,
      secondFullName,
      secondMobile,
      preferred_testing_time,
    } = createMultiRFPRequest;

    const newMultiRFP = this.multiRFPRepository.create({
      user_id: this.request.user.id,
      project_name,
      expiration_date,
      firstFullName,
      firstEmail,
      firstMobile,
      secondEmail,
      secondFullName,
      secondMobile,
      preferred_testing_time,
      request_for_proposal: [],
    });

    const savedMultiRFP = await this.multiRFPRepository.save(newMultiRFP);
    for (const project of projects) {
      const {
        category_id,
        target_ip_address,
        approach_of_assessment,
        notes,
        is_active_directory,
        target_mobile_application_url,
        how_many_custom_lines_of_code,
        what_is_programming_language,
        how_many_server_to_review,
        how_many_network_devices_to_review,
        how_many_workstation_to_review,
        is_hld_lld_available,
        apk_attachment_id,
      } = project;

      const requestForProposal = this.requestForProposalRepository.create({
        multi_RFP: savedMultiRFP,
        category_id,
        target_ip_address,
        approach_of_assessment,
        notes,
        is_active_directory,
        target_mobile_application_url,
        how_many_custom_lines_of_code,
        what_is_programming_language,
        how_many_server_to_review,
        how_many_network_devices_to_review,
        how_many_workstation_to_review,
        is_hld_lld_available,
        apk_attachment_id,
      });

      const savedRequestForPropsal = await this.requestForProposalRepository.save(requestForProposal);
      await this.attachmentRequestForProposal.update({ id: apk_attachment_id }, { request_for_proposal_id: savedRequestForPropsal.id });
      savedMultiRFP.request_for_proposal.push(requestForProposal); // Push the created request_for_proposal

    }
    return await this.multiRFPRepository.save(savedMultiRFP);
  }

  async attachRequestForProposal({ file }: AttachRequestForProposalRequest) {
    let attachedFile = null;
    const uploadFileRequest = new UploadFileRequest();
    uploadFileRequest.file = file;
    const tempImage = await this._fileService.upload(
      uploadFileRequest,
      `request_for_propsal/`,
    );

    const createAttachedFile = this.attachmentRequestForProposal.create({
      file_url: tempImage,
      file_name: file.originalname,
      file_type: file.mimetype,
    })

    return await this.attachmentRequestForProposal.save(createAttachedFile);
  }

  async clientGetMyAllMultiRFP(multiRFPFilterRequest: MultiRFPFilterRequest) {
    const { page, limit, search_by_name, sort_by, order } = multiRFPFilterRequest;

    const skip = (page - 1) * limit;

    const queryBuilder = this.multiRFPRepository
      .createQueryBuilder('multiRFP')
      .leftJoinAndSelect('multiRFP.user', 'user')
      .orderBy(`multiRFP.${sort_by}`, order as 'ASC' | 'DESC')
      .where('user.id = :userId', { userId: this.request.user.id })
      .skip(skip)
      .take(limit);

    if (search_by_name) {
      queryBuilder.andWhere('multiRFP.project_name LIKE :projectName', {
        projectName: `%${search_by_name}%`,
      });
    }

    const [allMultiRFPForUser, count] = await queryBuilder.getManyAndCount();

    const allMultiRFPForUserDto = allMultiRFPForUser.map(
      (item) => new MultiRFPResponse(item),
    );

    return { allMultiRFPForUserDto, count };
  }

  async provideGetMyAllMultiRFP(multiRFPFilterRequest: MultiRFPFilterRequest) {
    const { page, limit, search_by_name, sort_by, order } = multiRFPFilterRequest;

    const skip = (page - 1) * limit;

    const queryBuilder = this.multiRFPRepository
      .createQueryBuilder('multiRFP')
      .leftJoinAndSelect('multiRFP.offers', 'offers')
      .where('offers.user_id = :userId', { userId: this.request.user.id })
      .andWhere('offers.is_accepted = :isAccepted', { isAccepted: true })
      .orderBy(`multiRFP.${sort_by}`, order as 'ASC' | 'DESC')
      .skip(skip)
      .take(limit);

    if (search_by_name) {
      queryBuilder.andWhere('multiRFP.project_name Like :projectName', {
        projectName: `%${search_by_name}%`,
      });
    }

    const [allMultiRFPForUser, count] = await queryBuilder.getManyAndCount();
    const allMultiRFPForUserDto = allMultiRFPForUser.map(
      (item) => new MultiRFPResponse(item),
    );

    return { allMultiRFPForUserDto, count };
  }

  async providerGetOffers(multiRFPFilterRequest: MultiRFPFilterRequest) {
    const { page, limit, search_by_name, sort_by, order } = multiRFPFilterRequest;

    const skip = (page - 1) * limit;

    const queryBuilder = this.multiRFPRepository
      .createQueryBuilder('multiRFP')
      .leftJoinAndSelect('multiRFP.offers', 'offers')
      .where('multiRFP.request_for_proposal_status = :status', {
        status: RequestForProposalStatus.PENDING,
      })
      .orderBy(`multiRFP.${sort_by}`, order as 'ASC' | 'DESC')
      .skip(skip)
      .take(limit);

    if (search_by_name) {
      queryBuilder.andWhere('multiRFP.project_name Like :projectName', {
        projectName: `%${search_by_name}%`,
      });
    }

    const [projects, count] = await queryBuilder.getManyAndCount();

    for (let index = 0; index < projects.length; index++) {
      projects[index].offers = projects[index].offers.filter(
        (offer) => offer.is_accepted === false,
      );
    }

    return { projects, count };
  }
  
  async getSingleMultiRFP(id: string) {
    const multiRFP = await this.multiRFPRepository.findOne({
      where: { id },
      relations: {
        user: true,
        request_for_proposal: {
          category: true,
          apk_attachment: true
        },
      },
    });

    if (!multiRFP) {
      throw new NotFoundException('This Project not found');
    }

    if (multiRFP.request_for_proposal_status === RequestForProposalStatus.APPROVED &&
      multiRFP.provider_id != this.request.user.id &&
      multiRFP.user_id != this.request.user.id
    ) {
      throw new UnauthorizedException('You are not allowed to see this project');
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
      for (const request_for_proposal of updateMultiRFPRequest.projects) {
        if (request_for_proposal.id !== undefined) {
          await this.requestforPrposalService.updateRequestForProposal(request_for_proposal);
        } else {
          const requestForProposalCreate = this.requestForProposalRepository.create(
            { ...request_for_proposal, multi_RFP: multiRFP },
          );
          await this.requestForProposalRepository.save(requestForProposalCreate);
        }
      }
    }

    const updatedMultiRFP = plainToInstance(MultiRFP, updateMultiRFPRequest);
    updatedMultiRFP.id = multiRFP.id; // Ensure the ID remains the same

    const savedMultiRFP = await this.multiRFPRepository.save(updatedMultiRFP);

    return savedMultiRFP;
  }

  async deleteMultiRFP(id: string) {
    const multiRFP = await this.multiRFPRepository.findOne(
      {
        where: { id },
        relations: ['request_for_proposal', 'attachedFiles', 'offers', 'messages']
      });

    if (!multiRFP) {
      throw new NotFoundException('MultiRFP not found');
    }
    // Check if the user is the owner of the MultiRFP
    if (multiRFP.user_id !== this.request.user.id) {
      throw new UnauthorizedException('Only the owner of the MultiRFP can delete it');
    }

    await this.multiRFPRepository.softRemove(multiRFP);
  }
}
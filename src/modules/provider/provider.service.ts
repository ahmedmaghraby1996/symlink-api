import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseUserService } from 'src/core/base/service/user-service.base';
import { ProviderInfo } from 'src/infrastructure/entities/provider-info/provider-info.entity';
import { Repository } from 'typeorm';
import { Request } from 'express';
import { REQUEST } from '@nestjs/core';
import { ProviderCertificate } from 'src/infrastructure/entities/provider-info/provider-certificate.entity';
import { ProviderProject } from 'src/infrastructure/entities/provider-info/provider-project.entity';
import { ProviderProjectRequest } from './dto/requests/provider-project-request';
import { plainToInstance } from 'class-transformer';
import { ProviderInfoRequest } from './dto/requests/provider-info-reqest';
import { FileService } from '../file/file.service';
import { UploadFileRequest } from '../file/dto/requests/upload-file.request';
import { toUrl } from 'src/core/helpers/file.helper';
import { UpdateProvProjectRequest } from './dto/requests/update-provier-project-request';
import { ActionResponse } from 'src/core/base/responses/action.response';
import { User } from 'src/infrastructure/entities/user/user.entity';

@Injectable()
export class ProviderService extends BaseUserService<ProviderInfo> {
  constructor(
    @Inject(REQUEST) request: Request,
    @Inject(FileService) private _fileService: FileService,
    @InjectRepository(ProviderInfo)
    private readonly providerInfoRepository: Repository<ProviderInfo>,

    @InjectRepository(ProviderCertificate)
    private readonly providerCetificateRepository: Repository<ProviderCertificate>,

    @InjectRepository(ProviderProject)
    private readonly providerProjectRepository: Repository<ProviderProject>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {
    super(providerInfoRepository, request);
  }

  async updateEductionalInfo(req: ProviderInfoRequest) {
    const Proivder = await this.getProvider();

    Proivder.educational_info = req.educational_info;
    return await this.providerInfoRepository.save(Proivder);
  }

  async addProivderProject(req: ProviderProjectRequest) {
    const proivder = await this.getProvider();

    const providerProject = plainToInstance(ProviderProject, req);
    providerProject.provider_info = proivder;
    return await this.providerProjectRepository.save(providerProject);
  }

  async addProivderCertifcate(req: UploadFileRequest) {
    const tempImage = await this._fileService.upload(
      req,
      'provider-certifcate',
    );
    const proivder = await this.getProvider();

    const providerCertifacte = new ProviderCertificate({
      file: tempImage,
      provider_info: proivder,
      type: req.file.mimetype,
      name: req.file.originalname,
    });

    return await this.providerCetificateRepository.save(providerCertifacte);
  }

  async getCertificates(userId?: string) {
    const provider = await this.getProvider(userId);
    return (
      await this.providerCetificateRepository.find({
        where: { provider_info_id: provider.id },
        select: ['id', 'file', 'type', 'name'],
      })
    ).map((e) => {
      e.file = toUrl(e.file);
      return e;
    });
  }
  async getProjects(userId?: string) {
    const provider = await this.getProvider(userId);
    return await this.providerProjectRepository.find({
      where: { provider_info_id: provider.id },
      select: ['id', 'name', 'description', 'start_date', 'end_date'],
    });
  }
  async getEductional(userId?: string) {
    const provider = await this.getProvider(userId);
    const proivderInfo = await this.providerInfoRepository.findOne({
      where: { id: provider.id },
      select: ['educational_info'],
    });

    return proivderInfo == null ? '' : proivderInfo.educational_info;
  }

  async getProvider(userId?: string) {
    userId = userId || super.currentUser.id;
    return await this.providerInfoRepository.findOne({
      where: { user_id: userId },
    });
  }

  async updateProject(project_id: string, req: UpdateProvProjectRequest) {
    const provider = await this.getProvider();
    const project = await this.providerProjectRepository.findOne({
      where: { id: project_id, provider_info_id: provider.id },
    });
    if (project == null) {
      throw new NotFoundException('project not found');
    }

    Object.assign(project, req);
    return await this.providerProjectRepository.save(project);
  }

  async deleteCertifcate(id: string) {
    const provider = await this.getProvider();
    const certifcate = await this.providerCetificateRepository.findOne({
      where: { id, provider_info_id: provider.id },
    });
    if (certifcate == null) {
      throw new NotFoundException('certifcate not found');
    }

    return await this.providerCetificateRepository.delete({ id });
  }
  async deleteProject(id: string) {
    const provider = await this.getProvider();
    const project = await this.providerProjectRepository.findOne({
      where: { id, provider_info_id: provider.id },
    });

    if (project == null) {
      throw new NotFoundException('project not found');
    }

    return await this.providerProjectRepository.delete({ id });
  }

  async getUserInfo(userId?: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['city','city.country'],
      select: ['id', 'name', 'phone', 'avatar', 'city', 'linkedin','email']
    });
    if (user == null) {
      throw new NotFoundException('user not found');
    }
    return user;
  }
}

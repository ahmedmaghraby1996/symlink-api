import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Request } from 'express';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { AttachedFiles } from 'src/infrastructure/entities/attached-files/attached-files.entity';
import { Repository } from 'typeorm';
import { CreateAttachedFilesRequest } from './dto/Create-attached-files.request';
import { ImageManager } from 'src/integration/sharp/image.manager';
import { StorageManager } from 'src/integration/storage/storage.manager';
import * as sharp from 'sharp';
import { AttachedFilesResponse } from './dto/attached-files.response';
import { MultiRFP } from 'src/infrastructure/entities/multi-rfp/multi-rfp.entity';
import { AttachedFilesFilterRequest } from './dto/attached-files-filter.request';

@Injectable()
export class AttachedFilesService {
  constructor(
    @InjectRepository(AttachedFiles)
    private attachedFilesRepository: Repository<AttachedFiles>,
    @InjectRepository(MultiRFP)
    private multiRFPRepository: Repository<MultiRFP>,
    @Inject(StorageManager) private readonly storageManager: StorageManager,
    @Inject(ImageManager) private readonly imageManager: ImageManager,
    @Inject(REQUEST) private readonly request: Request,

  ) {}

  async getAllAttachedFilesForProject(id: string,attachedFilesFilterRequest:AttachedFilesFilterRequest) {
    const { page, limit } = attachedFilesFilterRequest;

    const skip = (page - 1) * limit;
    const multiRFP = await this.multiRFPRepository.findOne({
      where: { id },

    });
    if (!multiRFP) {
      throw new NotFoundException('This Project not found');
    }
    const [attachedFiles, count] = await this.attachedFilesRepository.findAndCount({
      skip,
      take: limit,
      where: { multi_RFP_id: id },
    });
    const attachedFilesDto = attachedFiles.map(
      (x) => new AttachedFilesResponse(x),
    );
    return {attachedFilesDto,count};
  }
  async addAttachedFileToProject(
    createAttachedFilesRequest: CreateAttachedFilesRequest,
  ) {

    const { file, multi_RFP_id, name } = createAttachedFilesRequest;

    const multiRFP = await this.multiRFPRepository.findOne({
      where: { id :multi_RFP_id},

    });
    if (!multiRFP) {
      throw new NotFoundException('This Project not found');
    }

    const resizedImage = await this.imageManager.resize(file, {
      size: {},
      options: {
        fit: sharp.fit.cover,
        position: sharp.strategy.entropy,
      },
    });

    // save image
    const path = await this.storageManager.store(
      { buffer: resizedImage, originalname: file.originalname },
      { path: 'banners' },
    );
    const createAttachedFile = this.attachedFilesRepository.create(
      createAttachedFilesRequest,
    );
    createAttachedFile.url = path;
    createAttachedFile.type=file.mimetype;
    const attachedFile = await this.attachedFilesRepository.save(
      createAttachedFile,
    );
    const attachedFileDto = new AttachedFilesResponse(attachedFile);
    return attachedFileDto;
  }
}

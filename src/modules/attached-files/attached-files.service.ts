import { Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
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
import { FileService } from '../file/file.service';
import { UploadFileRequest } from '../file/dto/requests/upload-file.request';

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
    @Inject(FileService) private _fileService: FileService,
  ) { }

  async getAllAttachedFilesForProject(
    id: string,
    attachedFilesFilterRequest: AttachedFilesFilterRequest,
  ) {
    const { page, limit } = attachedFilesFilterRequest;

    const skip = (page - 1) * limit;
    const multiRFP = await this.multiRFPRepository.findOne({
      where: { id },
    });
    if (!multiRFP) {
      throw new NotFoundException('This Project not found');
    }
    const [attachedFiles, count] =
      await this.attachedFilesRepository.findAndCount({
        skip,
        take: limit,
        where: { multi_RFP_id: id },
      });
    const attachedFilesDto = attachedFiles.map(
      (x) => new AttachedFilesResponse(x),
    );
    return { attachedFilesDto, count };
  }
  async addAttachedFileToProject(
    createAttachedFilesRequest: CreateAttachedFilesRequest,
  ) {
    const { file, multi_RFP_id, name } = createAttachedFilesRequest;

    const multiRFP = await this.multiRFPRepository.findOne({
      where: { id: multi_RFP_id },
    });
    if (!multiRFP) {
      throw new NotFoundException('This Project not found');
    }

    if(multiRFP.user_id != this.request.user.id) {
      throw new UnauthorizedException('You are not allowed to add attached file to this project');
    }

    const uploadFileRequest = new UploadFileRequest();
    uploadFileRequest.file = file;
    const tempImage = await this._fileService.upload(
      uploadFileRequest,
      'attached-files',
    );

    const createAttachedFile = this.attachedFilesRepository.create(
      createAttachedFilesRequest,
    );
    createAttachedFile.url = tempImage;
    createAttachedFile.type = file.mimetype;
    const attachedFile = await this.attachedFilesRepository.save(
      createAttachedFile,
    );
    const attachedFileDto = new AttachedFilesResponse(attachedFile);
    return attachedFileDto;
  }

  async deleteAttachedFile(id: string) {
    const attachedFile = await this.attachedFilesRepository.findOne({
      where: { id },
    });
    
    if (!attachedFile) {
      throw new NotFoundException('This AttachedFile not found');
    }

    
    const multiRFP = await this.multiRFPRepository.findOne({ where: { id: attachedFile.multi_RFP_id } })
    if (multiRFP.user_id != this.request.user.id) {
      throw new UnauthorizedException('You are not allowed to delete this AttachedFile');
    }
    
    await this.attachedFilesRepository.delete({ id });
    await this.storageManager.delete(attachedFile.url);
    return true;
  }
}

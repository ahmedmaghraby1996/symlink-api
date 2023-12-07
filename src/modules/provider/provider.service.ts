import { Inject, Injectable } from '@nestjs/common';
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
providerProject.provider_info=proivder;
  return  await this.providerProjectRepository.save(providerProject)

  }



async addProivderCertifcate(req: UploadFileRequest) {
     
 
  
    const tempImage = await this._fileService.upload(req, 'provider-certifcate');
    const proivder = await this.getProvider();

    const providerCertifacte = new ProviderCertificate({file:tempImage,provider_info:proivder,type:req.file.mimetype})

  return  await this.providerCetificateRepository.save(providerCertifacte)
    
  }


  async getCertificates(){
    const provider=await this.getProvider();
   return  (await this.providerCetificateRepository.find({where:{provider_info_id:provider.id,},select:["id","file",'type']})).map((e)=>{e.file=toUrl(e.file); return e})
  }
  async getProjects(){
    const provider=await this.getProvider();
   return  await this.providerProjectRepository.find({where:{provider_info_id:provider.id},select:['id','name','description','date']})

  }
  async getEductional(){

    const provider=await this.getProvider();
    const proivderInfo = await this.providerInfoRepository.findOne({where:{id:provider.id},select:["educational_info"]})
   
    return proivderInfo == null? "":proivderInfo.educational_info ;
    

  }
  
  


  async getProvider() {
    return await this.providerInfoRepository.findOne({
      where: { user_id: super.currentUser.id},
   
    });
  }
}

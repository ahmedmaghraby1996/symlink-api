import { BaseEntity } from "src/infrastructure/base/base.entity";
import { Column, Entity, OneToMany, OneToOne } from "typeorm";
import { ProviderCertificate } from "./provider-certificate.entity";
import { ProviderProject } from "./provider-project.entity";
import { User } from "../user/user.entity";
import { OwnedEntity } from "src/infrastructure/base/owned.entity";

@Entity()

export class ProviderInfo extends OwnedEntity{


@Column({nullable:true,type: 'text'})
educational_info:string

@OneToMany(()=>ProviderCertificate, (providerCertificate)=>providerCertificate.provider_info)
provider_certificates:ProviderCertificate[]

@OneToMany(()=>ProviderProject, (providerProject)=>providerProject.provider_info)
provider_projects:ProviderProject[]

@OneToOne(()=>User)
user:User

constructor(data:Partial<ProviderInfo>){
    super();
    Object.assign(this,data)
}
}
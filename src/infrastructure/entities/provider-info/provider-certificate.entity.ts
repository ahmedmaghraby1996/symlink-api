import { AuditableEntity } from "src/infrastructure/base/auditable.entity";
import { BaseEntity } from "src/infrastructure/base/base.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { ProviderInfo } from "./provider-info.entity";

@Entity()

export class ProviderCertificate extends AuditableEntity{


@Column()
file:string

@Column()
type:string


@Column({nullable:true})
name:string


@ManyToOne(()=>ProviderInfo,(providerInfo)=>providerInfo.provider_certificates)
@JoinColumn({name:'provider_info_id'})
provider_info:ProviderInfo

@Column()
provider_info_id:string 

constructor(data:Partial<ProviderCertificate>){
   
    super()
    Object.assign(this,data)}

}
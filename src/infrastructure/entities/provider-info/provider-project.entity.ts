import { AuditableEntity } from "src/infrastructure/base/auditable.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { ProviderInfo } from "./provider-info.entity";

@Entity()

export class ProviderProject extends AuditableEntity{


@Column()
name:string

@Column()
date:Date

@Column()
description:string

@ManyToOne(()=>ProviderInfo,(providerInfo)=>providerInfo.provider_projects)
@JoinColumn({name:'provider_info_id'})
provider_info:ProviderInfo

@Column()
provider_info_id:string


}
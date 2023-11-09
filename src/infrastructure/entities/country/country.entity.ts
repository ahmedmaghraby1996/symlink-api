import { string } from "joi";
import {  Column, Entity, OneToMany } from "typeorm";
import { City } from "./city.entity";
import { BaseEntity } from "src/infrastructure/base/base.entity";

@Entity()
export class Country extends BaseEntity{
@Column()
name_ar:string

@Column()
name_en:string

@OneToMany(()=>City,city=>city.country)
cities:City[]

constructor(data:Partial<Country>)
{
    super();
    Object.assign(this,data)
}
}
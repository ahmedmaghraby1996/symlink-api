import { string } from "joi";
import {  Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { Country } from "./country.entity";
import { BaseEntity } from "src/infrastructure/base/base.entity";
import { User } from "../user/user.entity";

@Entity()
export class City extends BaseEntity{

@OneToMany(()=>User,user=>user.city)
users:User[]    
@Column()
name_ar:string

@Column()
name_en:string

@ManyToOne(()=>Country,country=>country.cities)
country:Country

@Column()
country_id:string

constructor(data:Partial<City>)
{
    super();
    Object.assign(this,data)
}
}
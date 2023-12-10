import { AuditableEntity } from 'src/infrastructure/base/auditable.entity';
import {
  Entity,
  Column,
  BeforeInsert,
  OneToMany,
  ManyToMany,
  ManyToOne,
} from 'typeorm';
import { Factory } from 'nestjs-seeder';
import { randNum } from 'src/core/helpers/cast.helper';
import { Gender } from 'src/infrastructure/data/enums/gender.enum';
import { Role } from 'src/infrastructure/data/enums/role.enum';
import { Language } from 'src/infrastructure/data/enums/language.enum';
import { Address } from './address.entity';
import { RequestForProposal } from '../request-for-proposal/request-for-proposal.entity';
import { City } from '../country/city.entity';
import { MultiRFP } from '../multi-rfp/multi-rfp.entity';
import { Offer } from '../offer/offer.entity';
import { Message } from '../discussions/message.entity';
import { Reply } from '../discussions/reply.entity';

@Entity()
export class User extends AuditableEntity {
  // account > unique id generator 10 numbers)
  @Factory((faker) => faker.phone.number('########'))
  @Column({ length: 8, unique: true })
  account: string;

  @Factory((faker) => faker.helpers.unique(faker.internet.domainName))
  @Column({ length: 100, unique: true })
  username: string;

  @Column({ unique: true, nullable: true })
  linkedin: string;

  @Factory((faker, ctx) => faker.name.fullName(ctx.gender))
  @Column({ length: 100, nullable: true })
  name: string;

  // @Factory((faker, ctx) => faker.internet.password())
  @Column({ nullable: true, length: 60 })
  password: string;

  @Factory((faker, ctx) => faker.internet.email(ctx.name))
  @Column({ nullable: true, length: 100 })
  email: string;

  @Factory((faker) => faker.date.future())
  @Column({ nullable: true })
  email_verified_at: Date;

  @Factory((faker) => faker.phone.number('+965#########'))
  @Column({ nullable: true, length: 20 })
  phone: string;

  @Factory((faker) => faker.date.future())
  @Column({ nullable: true })
  phone_verified_at: Date;

  @Factory((faker) => faker.internet.avatar())
  @Column({ nullable: true, length: 500 })
  avatar: string;

  @Factory((faker) => faker.helpers.arrayElement(Object.values(Gender)))
  @Column({ nullable: true, type: 'enum', enum: Gender })
  gender: Gender;

  @Column({ nullable: true, length: 500 })
  fcm_token: string;

  @Column({ type: 'enum', enum: Language, default: Language.EN })
  language: Language;

  @Column({ default: true })
  is_active: boolean;

  @ManyToOne(() => City, city => city.users)
  city: City
  @Column({ nullable: true })
  city_id: string

  @Factory((faker) => faker.helpers.arrayElement([Role.CLIENT, Role.PROVIDER]))
  @Column({ type: 'set', enum: Role, default: [Role.CLIENT] })
  roles: Role[];

  @OneToMany(() => Address, (address) => address.user, {
    cascade: true,
  })
  addresses: Promise<Address[]>;


  @OneToMany(() => MultiRFP, (multiRFP) => multiRFP.user)
  multi_RFP: MultiRFP[]

  @OneToMany(() => Offer, (offer) => offer.user)
  offers: Offer[]

  @OneToMany(() => Message, message => message.user)
  messages: Message[]

  @OneToMany(() => Reply, reply => reply.user)
  replies: Reply[]

  constructor(partial: Partial<User>) {
    super();
    Object.assign(this, partial);
  }

  // generate unique id in this pattern: ######
  private uniqueIdGenerator(): string {
    return randNum(8);
  }

  @BeforeInsert()
  generateAccount() {
    // ensure the account is unique
    if (!this.account) this.account = this.uniqueIdGenerator();
  }
}

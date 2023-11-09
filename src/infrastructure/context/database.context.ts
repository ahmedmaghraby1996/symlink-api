import { Otp } from "../entities/auth/otp.entity";
import { User } from "../entities/user/user.entity";
import { Address } from "../entities/user/address.entity";
import { Category } from "../entities/category/category.entity";
import { MetaData } from "../entities/meta-data/meta-data.entity";
import { RequestForProposal } from "../entities/request-for-proposal/request-for-proposal.entity";
import { City } from "../entities/country/city.entity";
import { Country } from "../entities/country/country.entity";

export const DB_ENTITIES = [
  User,
  Address,
  Otp,
  Category,
  MetaData,
  RequestForProposal,
  City,
  Country
];

export const DB_VIEWS = [];

import { Inject, Injectable, NotFoundException, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { DeleteResult, EntityManager, Repository } from 'typeorm';
import { AddressByAccountRequest } from './dto/requests/address-by-account.request';
import { Address } from 'src/infrastructure/entities/user/address.entity';
import { BaseUserService } from 'src/core/base/service/user-service.base';
import { EntityRelatedValidator } from 'src/core/validators/entity-related.validator';
import { PaginatedRequest } from 'src/core/base/requests/paginated.request';
import { applyQueryFilters, applyQuerySort } from 'src/core/helpers/service-related.helper';
import { SetFavoriteAddressTransaction } from './utils/transactions/set-favorite-address.transaction';
import { City } from 'src/infrastructure/entities/country/city.entity';
import { Country } from 'src/infrastructure/entities/country/country.entity';
import { BaseService } from 'src/core/base/service/service.base';

@Injectable({ scope: Scope.REQUEST })
export class AddressService extends BaseService<Country> {
  constructor(
    @InjectRepository(Country)
    public country_repo: Repository<Country>,
    @InjectRepository(City)
    public city_repo: Repository<City>,
    @Inject(REQUEST) request: Request,
   
  ) {
    super(country_repo);
  }

  async getCities(id:string)
  {
return await  this.city_repo.find({where:{country_id:id}})
  }



}

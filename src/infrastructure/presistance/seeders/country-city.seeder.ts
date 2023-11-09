import { Injectable } from '@nestjs/common';
import { Seeder, DataFactory } from 'nestjs-seeder';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/infrastructure/entities/user/user.entity';
import { Address } from 'src/infrastructure/entities/user/address.entity';
import { City } from 'src/infrastructure/entities/country/city.entity';
import { Country } from 'src/infrastructure/entities/country/country.entity';
import * as fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CountryCitySeeder implements Seeder {
  constructor(
    @InjectRepository(City) private readonly city_repo: Repository<City>,
    @InjectRepository(Country)
    private readonly country_repo: Repository<Country>,
  ) {}

  async seed(): Promise<any> {
    // Get users.
    const data = fs.readFileSync('./json/countries.json', 'utf8');
    const brandsData = JSON.parse(data);

    const countries = brandsData.countries.map((country: any, i: number) => {
      // create id slug from brand name_en
      return new Country({cities:country.cities,name_ar:country.name.ar,name_en:country.name.en});
    });

    const saved_countries = await this.country_repo.save(countries);

    await Promise.all(
      saved_countries.map(async (country: Country) => {
        const cities = country.cities.map(
          (e) =>
            new City({
              country_id: country.id,
              name_ar: e["name"].ar,
              name_en: e["name"].en,
            }),
        );

        await this.city_repo.save(cities);
      }),
    );
  }

  async drop(): Promise<any> {
    this.city_repo.delete({});
    return this.country_repo.delete({});
  }
}

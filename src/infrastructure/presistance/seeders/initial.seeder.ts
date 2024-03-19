import { AddressSeeder } from './address.seeder';
import { CountryCitySeeder } from './country-city.seeder';
import { MetaDataSeeder } from './meta-data';
import { ProjectsCategorySeeder } from './projects-category';
import { StaticPageSeeder } from './static-pages.seeder';
import { UsersSeeder } from './users.seeder';

export const DB_SEEDERS = [
  UsersSeeder,
  AddressSeeder,
  CountryCitySeeder,
  ProjectsCategorySeeder,
  MetaDataSeeder,
  StaticPageSeeder
];

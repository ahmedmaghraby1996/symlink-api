import { th } from '@faker-js/faker';
import { Exclude, Expose, Type } from 'class-transformer';
import { Category } from 'src/infrastructure/entities/category/category.entity';
import { MetaData } from 'src/infrastructure/entities/meta-data/meta-data.entity';
import { User } from 'src/infrastructure/entities/user/user.entity';
import { UserInfoResponse } from 'src/modules/user/dto/response/profile.response';

@Exclude()
export class RequestForProposalResponse {
  @Expose() category: Category;

  @Expose()
  user: UserInfoResponse;

  @Expose() assessments_type_meta_data: MetaData;

  @Expose() apis_size_meta_data: MetaData;

  @Expose() average_applications_meta_data: MetaData;

  @Expose() color_mobile_meta_data: MetaData;

  @Expose() evaluation_is_internal_or_external_meta_data: MetaData;

  @Expose() internal_applications_num: number;

  @Expose() external_applications_num: number;

  @Expose() list_applications_with_scope: string;

  @Expose() Verify_that_vulnerabilities_are_fixed: boolean;

  @Expose() necessary_resident_be_on_site: boolean;

  @Expose() how_many_times_on_site: number;

  @Expose() How_many_user_roles: number;

  @Expose() how_to_access_the_application: string;

  @Expose() how_many_IPS_should_be_tested_in_servers: number;

  @Expose() how_many_IPS_should_be_tested_in_workstations: number;

  @Expose() how_many_IPS_should_be_tested_in_network_devices: number;

  @Expose() vpn_access_to_the_resident: boolean;

  @Expose() evaluation_approach: string;

  @Expose() details_evaluation_approach: string;

  @Expose() active_directory: boolean;

  @Expose() details_ips_scoped: string;
  constructor(data: Partial<RequestForProposalResponse>) {
    Object.assign(this, data);
    this.user = new UserInfoResponse(data.user);
  }
}

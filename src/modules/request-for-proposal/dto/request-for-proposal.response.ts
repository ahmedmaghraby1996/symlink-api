import { th } from '@faker-js/faker';
import { Exclude, Expose, Type } from 'class-transformer';
import { RequestForProposalStatus } from 'src/infrastructure/data/enums/request-for-proposal.enum';
import { Category } from 'src/infrastructure/entities/category/category.entity';
import { User } from 'src/infrastructure/entities/user/user.entity';
import { TicketAttachmentResponse } from 'src/modules/support-ticket/dto/response/ticket-attachment.response';
import { UserInfoResponse } from 'src/modules/user/dto/response/profile.response';

@Exclude()
export class RequestForProposalResponse {
  @Expose() category: Category;

  @Expose() multi_RFP_id: string;

  @Expose() target_ip_address: string;

  @Expose() approach_of_assessment: string | null;

  @Expose() notes: string | null;

  @Expose() is_active_directory: boolean | null;

  @Expose() target_mobile_application_url: string | null;

  @Expose() how_many_custom_lines_of_code: string | null;

  @Expose() what_is_programming_language: string | null;

  @Expose() how_many_server_to_review: string | null;

  @Expose() how_many_network_devices_to_review: string | null;

  @Expose() how_many_workstation_to_review: string | null;

  @Expose() is_hld_lld_available: boolean | null;

  @Expose() apk_attachment_id: string | null;

  @Expose() @Type(() => TicketAttachmentResponse) apk_attachment: TicketAttachmentResponse;

  @Expose() created_at: Date;

  @Expose() updated_at: Date;

  constructor(data: Partial<RequestForProposalResponse>) {
    Object.assign(this, data);

  }
}

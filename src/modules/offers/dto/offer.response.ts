import { MultiRFP } from "src/infrastructure/entities/multi-rfp/multi-rfp.entity";
import { UserInfoResponse } from "src/modules/user/dto/response/profile.response";

export class OfferResponse {
  user: UserInfoResponse;
  is_anonymous: boolean;
  multi_RFP: MultiRFP;
  user_id: string;

  constructor(partial: Partial<OfferResponse>) {
    Object.assign(this, partial);
    
    if (this.user != null) {
      this.user = new UserInfoResponse(partial.user);
    }

    if (this.is_anonymous === true) {
      delete this.user;
      delete this.user_id;
    }

    delete this.multi_RFP;
  }
}
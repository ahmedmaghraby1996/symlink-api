import { UserInfoResponse } from "src/modules/user/dto/response/profile.response";

export class OfferResponse {
  user: UserInfoResponse;
  constructor(partial: Partial<OfferResponse>) {
    Object.assign(this, partial);
    if (this.user != null) {
      this.user = new UserInfoResponse(partial.user);
    }
  }
}
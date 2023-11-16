import { RequestForProposalStatus } from "src/infrastructure/data/enums/request-for-proposal.enum";
import { RequestForProposalResponse } from "src/modules/request-for-proposal/dto/request-for-proposal.response";
import { UserInfoResponse } from "src/modules/user/dto/response/profile.response";

export class MultiRFPResponse{
    user: UserInfoResponse;
    request_for_proposal_status: RequestForProposalStatus;
    project_name: string;

    requestForProposalResponse:RequestForProposalResponse;

    constructor(data: Partial<MultiRFPResponse>) {
        Object.assign(this, data);
        if(data.user!=null){
            this.user = new UserInfoResponse(data.user);
        }
        if(data.requestForProposalResponse!=null){
            this.requestForProposalResponse = new RequestForProposalResponse(data.requestForProposalResponse)
        }
      }
}
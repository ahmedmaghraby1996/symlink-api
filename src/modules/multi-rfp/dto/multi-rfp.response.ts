import { toUrl } from "src/core/helpers/file.helper";
import { RequestForProposalStatus } from "src/infrastructure/data/enums/request-for-proposal.enum";
import { RequestForProposalResponse } from "src/modules/request-for-proposal/dto/request-for-proposal.response";
import { UserInfoResponse } from "src/modules/user/dto/response/profile.response";

export class MultiRFPResponse {
    user: UserInfoResponse;
    request_for_proposal_status: RequestForProposalStatus;
    project_name: string;

    request_for_proposal: RequestForProposalResponse[];


    constructor(data: Partial<MultiRFPResponse>) {
        Object.assign(this, data);
        if (data.user != null) {
            this.user = new UserInfoResponse(data.user);
        }
        if (data.request_for_proposal != null) {
            for (let index = 0; index < data.request_for_proposal.length; index++) {
                if (data.request_for_proposal[index].apk_attachment != null) {
                    this.request_for_proposal[index].apk_attachment.file_url = toUrl(data.request_for_proposal[index].apk_attachment.file_url);
                }
                this.request_for_proposal[index] = new RequestForProposalResponse(data.request_for_proposal[index])

            }
        }
    }
}
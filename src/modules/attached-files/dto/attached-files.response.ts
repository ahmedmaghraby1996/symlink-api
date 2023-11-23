import { toUrl } from "src/core/helpers/file.helper";
import { AttachedFilesType } from "src/infrastructure/data/enums/attached-files-type";

export class AttachedFilesResponse{
    multi_RFP_id: string;
    type: AttachedFilesType;
  
    name: string;
  
    url: string;
    constructor(data: Partial<AttachedFilesResponse>) {
        Object.assign(this, data);
         //* convert path to url
    if (this.url) {
        if (this.url.includes('assets')) {
          this.url = toUrl(this.url, true);
        } else {
          this.url = toUrl(this.url);
        }
      }
      }
}
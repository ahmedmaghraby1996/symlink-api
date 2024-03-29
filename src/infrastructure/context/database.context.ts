import { Otp } from "../entities/auth/otp.entity";
import { User } from "../entities/user/user.entity";
import { Address } from "../entities/user/address.entity";
import { Category } from "../entities/category/category.entity";
import { RequestForProposal } from "../entities/request-for-proposal/request-for-proposal.entity";
import { City } from "../entities/country/city.entity";
import { Country } from "../entities/country/country.entity";
import { MultiRFP } from "../entities/multi-rfp/multi-rfp.entity";
import { ProviderInfo } from "../entities/provider-info/provider-info.entity";
import { ProviderProject } from "../entities/provider-info/provider-project.entity";
import { ProviderCertificate } from "../entities/provider-info/provider-certificate.entity";
import { AttachedFiles } from "../entities/attached-files/attached-files.entity";
import { Offer } from "../entities/offer/offer.entity";
import { Message } from "../entities/discussions/message.entity";
import { DiscussionAttachment } from "../entities/discussions/discussion-attachment.entity";
import { Reply } from "../entities/discussions/reply.entity";
import { SupportTicket } from "../entities/support-ticket/support-ticket.entity";
import { TicketComment } from "../entities/support-ticket/ticket-comment.entity";
import { TicketAttachment } from "../entities/support-ticket/ticket-attachment.entity";
import { AttachmentRequestForProposal } from "../entities/request-for-proposal/attachment-request-for-propsal.entity";
import { StaticPage } from "../entities/static-pages/statis-page.entity";

export const DB_ENTITIES = [
  User,
  Address,
  Otp,
  Category,
  RequestForProposal,
  City,
  Country,
  MultiRFP,
  ProviderInfo,
  ProviderProject,
  ProviderCertificate,
  AttachedFiles,
  Offer,
  Message,
  Reply,
  DiscussionAttachment,
  SupportTicket,
  TicketComment,
  TicketAttachment,
  AttachmentRequestForProposal,
  StaticPage
];

export const DB_VIEWS = [];

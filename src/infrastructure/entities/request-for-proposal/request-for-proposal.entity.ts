import { BaseEntity } from 'src/infrastructure/base/base.entity';
import {
  Entity,
  Column,
  CreateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { MetaData } from '../meta-data/meta-data.entity';
import { MetaDataType } from 'src/infrastructure/data/enums/meta-data-type.enum';
import { Category } from '../category/category.entity';
import { User } from '../user/user.entity';
import { RequestForProposalStatus } from 'src/infrastructure/data/enums/request-for-proposal.enum';
import { AuditableEntity } from 'src/infrastructure/base/auditable.entity';
import { MultiRFP } from '../multi-rfp/multi-rfp.entity';
@Entity()
export class RequestForProposal extends  AuditableEntity {

  @ManyToOne(() => MultiRFP, (multiRfp) => multiRfp.request_for_proposal)
  @JoinColumn({ name: 'multi_RFP_id' })
  multi_RFP: MultiRFP;





  @ManyToOne(() => Category, (category) => category.request_for_proposal)
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @Column()
  category_id: string;


  //Type of evaluation?
  @ManyToOne(() => MetaData, (metaData) => metaData.assessments_type_request)
  @JoinColumn({ name: 'assessments_type_id' })
  assessments_type_meta_data: MetaData;

  @Column({ nullable: true })
  assessments_type_id: string;
  //How many API functions do you have in the application? (Example: register, log in, create ticket, close ticket, etc.)
  @ManyToOne(() => MetaData, (metaData) => metaData.apis_size_request)
  @JoinColumn({ name: 'apis_size_id' })
  apis_size_meta_data: MetaData;

  @Column({ nullable: true })
  apis_size_id: string;
  //What is the average size of these applications?
  @ManyToOne(
    () => MetaData,
    (metaData) => metaData.average_applications_request,
  )
  @JoinColumn({ name: 'average_applications_id' })
  average_applications_meta_data: MetaData;

  @Column({ nullable: true })
  average_applications_id: string;
  //What is the color in the mobile project?
  @ManyToOne(() => MetaData, (metaData) => metaData.color_mobile_request)
  @JoinColumn({ name: 'color_mobile_id' })
  color_mobile_meta_data: MetaData;

  @Column({ nullable: true })
  color_mobile_id: string;
  //Is the evaluation internal/external?
  @ManyToOne(
    () => MetaData,
    (metaData) => metaData.evaluation_is_internal_or_external_request,
  )
  @JoinColumn({ name: 'evaluation_is_internal_or_external_id' })
  evaluation_is_internal_or_external_meta_data: MetaData;

  @Column({ nullable: true })
  evaluation_is_internal_or_external_id: string;

  //Internal applications
  @Column({ nullable: true })
  internal_applications_num: number;
  //External applications

  @Column({ nullable: true })
  external_applications_num: number;

  //List applications with domain:(i.e.domain.com)
  @Column({ type: 'longtext', nullable: true })
  list_applications_with_scope: string;

  //Is verification required to evaluate whether reported vulnerabilities have been fixed?
  @Column({ nullable: true })
  Verify_that_vulnerabilities_are_fixed: boolean;

  //Is it necessary for the resident to be on site?
  @Column({ nullable: true })
  necessary_resident_be_on_site: boolean;

  //How many times on site
  @Column({ nullable: true })
  how_many_times_on_site: number;

  //How many user roles do you have in this application? i.e. normal user, admin, admin etc
  @Column({ nullable: true })
  How_many_user_roles: number;

  //How to access the app: (i.e. Apple/Google stores link)
  @Column({ type: 'longtext', nullable: true })
  how_to_access_the_application: string;

  //How many IPS should be servers?
  @Column({ nullable: true })
  how_many_IPS_should_be_tested_in_servers: number;

  //How many IPS should be workstations?
  @Column({ nullable: true })
  how_many_IPS_should_be_tested_in_workstations: number;

  //How many IPS should be network devices?
  @Column({ nullable: true })
  how_many_IPS_should_be_tested_in_network_devices: number;

  //For internal testing, will you provide VPN access to the resident?
  @Column({ nullable: true })
  vpn_access_to_the_resident: boolean;

  //Evaluation approach (white/gray/black)
  @Column({ nullable: true })
  evaluation_approach: string;

  //If you want to be more specific, please comment in the text box below
  @Column({ type: 'longtext', nullable: true })
  details_evaluation_approach: string;

  //Is Active Directory part of the assessment?
  @Column({ nullable: true })
  active_directory: boolean;

  //IPS Scoped List: (i.e. 1.1.1.1)
  @Column({ type: 'longtext', nullable: true })
  details_ips_scoped: string;

  @Column({
    type: 'enum',
    enum: RequestForProposalStatus,
    default: RequestForProposalStatus.PENDING,
  })
  request_for_proposal_status: RequestForProposalStatus;
}

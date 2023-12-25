import { BaseEntity } from 'src/infrastructure/base/base.entity';
import {
  Entity,
  Column,
  CreateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Category } from '../category/category.entity';
import { User } from '../user/user.entity';
import { RequestForProposalStatus } from 'src/infrastructure/data/enums/request-for-proposal.enum';
import { AuditableEntity } from 'src/infrastructure/base/auditable.entity';
import { MultiRFP } from '../multi-rfp/multi-rfp.entity';
@Entity()
export class RequestForProposal extends AuditableEntity {

  @ManyToOne(() => MultiRFP, (multiRfp) => multiRfp.request_for_proposal, { onDelete: 'CASCADE' })
  @JoinColumn()
  multi_RFP: MultiRFP;

  @Column()
  multi_RFP_id: string;


  @ManyToOne(() => Category, (category) => category.request_for_proposal, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @Column()
  category_id: string;

  // Target URL/IP address
  @Column({ nullable: true })
  target_ip_address: string;

  // The approach of the assessment:
  @Column({
    type: 'enum',
    default: null,
    enum: ['WHITE', 'BLACK'],
    nullable: true,
  })
  approach_of_assessment: string;

  // Notes
  @Column({ type: 'longtext', nullable: true })
  notes: string;

  // Is Active Directory part of the assessment
  @Column({ nullable: true })
  is_active_directory: boolean;

  // Target mobile application URL
  @Column({ nullable: true })
  target_mobile_application_url: string;

  // How many custom lines of code want to assess
  @Column({ nullable: true })
  how_many_custom_lines_of_code: string;

  // What is the programming language of the code or frameworks
  @Column({ nullable: true })
  what_is_programming_language: string;

  // How many servers, network devices, and workstations do you want to review - Servers
  @Column({ nullable: true })
  how_many_server_to_review: string;

  // How many servers, network devices, and workstations do you want to review - Network
  @Column({ nullable: true })
  how_many_network_devices_to_review: string;

  // How many servers, network devices, and workstations do you want to review - Workstations
  @Column({ nullable: true })
  how_many_workstation_to_review: string;

  // Is the High-Level Diagram (HLD)/Low-Level Diagram (LLD) available and updated?
  @Column({ nullable: true })
  is_hld_lld_available: boolean;
}

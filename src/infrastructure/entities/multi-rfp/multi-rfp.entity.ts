import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { RequestForProposal } from "../request-for-proposal/request-for-proposal.entity";
import { AuditableEntity } from "src/infrastructure/base/auditable.entity";
import { User } from "../user/user.entity";
import { RequestForProposalStatus } from "src/infrastructure/data/enums/request-for-proposal.enum";
import { MetaData } from "../meta-data/meta-data.entity";

@Entity()
export class MultiRFP extends  AuditableEntity{
    @OneToMany(
        () => RequestForProposal,
        (requestForProposal) => requestForProposal.multi_RFP,
      )
      request_for_proposal: RequestForProposal[];

      @Column({
        type: 'enum',
        enum: RequestForProposalStatus,
        default: RequestForProposalStatus.PENDING,
      })
      request_for_proposal_status: RequestForProposalStatus;

      @Column()
      project_name: string;

      @ManyToOne(() => User, (user) => user.multi_RFP,{onDelete: 'CASCADE'})
      @JoinColumn({ name: 'user_id' })
      user: User;
    
      @Column()
      user_id: string;

        //Type of evaluation?
  @ManyToOne(() => MetaData, (metaData) => metaData.time_type_request,{onDelete: 'CASCADE'})
  @JoinColumn({ name: 'time_type_id' })
  time_type_meta_data: MetaData;

  @Column({ nullable: true })
  time_type_id: string;
}
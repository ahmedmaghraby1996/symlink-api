import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { RequestForProposal } from "../request-for-proposal/request-for-proposal.entity";
import { AuditableEntity } from "src/infrastructure/base/auditable.entity";
import { User } from "../user/user.entity";

@Entity()
export class MultiRFP extends  AuditableEntity{
    @OneToMany(
        () => RequestForProposal,
        (requestForProposal) => requestForProposal.multi_RFP,
      )
      request_for_proposal: RequestForProposal[];


      @ManyToOne(() => User, (user) => user.multi_RFP)
      @JoinColumn({ name: 'user_id' })
      user: User;
    
      @Column()
      user_id: string;
}
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne, JoinColumn } from 'typeorm';
import { RequestForProposal } from './request-for-proposal.entity';
import { AuditableEntity } from 'src/infrastructure/base/auditable.entity';

@Entity()
export class AttachmentRequestForProposal extends AuditableEntity {
    @Column()
    file_type: string;

    @Column()
    file_name: string;

    @Column()
    file_url: string;

    @OneToOne(() => RequestForProposal, (rfp) => rfp.apk_attachment, { nullable: true })
    @JoinColumn({ name: 'request_for_proposal_id' })
    request_for_proposal: RequestForProposal;

    @Column({ nullable: true })
    request_for_proposal_id: string;
}

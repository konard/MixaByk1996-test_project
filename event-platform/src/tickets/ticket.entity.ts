import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Event } from '../events/event.entity';
import { Payment } from '../payments/payment.entity';

export enum TicketStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  USED = 'used',
}

@Entity('tickets')
@Index(['userId', 'eventId'])
@Index(['status'])
@Index(['qrCode'], { unique: true })
export class Ticket {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @ManyToOne(() => User, (user) => user.tickets, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  eventId: string;

  @ManyToOne(() => Event, (event) => event.tickets, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'eventId' })
  event: Event;

  @Column({ nullable: true })
  paymentId: string;

  @ManyToOne(() => Payment, (payment) => payment.tickets, { nullable: true })
  @JoinColumn({ name: 'paymentId' })
  payment: Payment;

  @Column({ nullable: true })
  qrCode: string;

  @Column({ type: 'enum', enum: TicketStatus, default: TicketStatus.PENDING })
  status: TicketStatus;

  @CreateDateColumn()
  createdAt: Date;
}

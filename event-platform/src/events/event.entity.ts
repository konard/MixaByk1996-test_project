import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  ManyToMany,
  JoinTable,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Ticket } from '../tickets/ticket.entity';
import { Payment } from '../payments/payment.entity';
import { Review } from '../reviews/review.entity';
import { Category } from '../categories/category.entity';
import { Venue } from '../venues/venue.entity';

@Entity('events')
@Index(['date'])
@Index(['organizerId', 'date'])
@Index(['title', 'date'])
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'timestamp' })
  date: Date;

  @Column()
  location: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'int' })
  capacity: number;

  @Column()
  organizerId: string;

  @ManyToOne(() => User, (user) => user.organizedEvents, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'organizerId' })
  organizer: User;

  @Column({ nullable: true })
  venueId: string;

  @ManyToOne(() => Venue, (venue) => venue.events, { nullable: true })
  @JoinColumn({ name: 'venueId' })
  venue: Venue;

  @OneToMany(() => Ticket, (ticket) => ticket.event)
  tickets: Ticket[];

  @OneToMany(() => Payment, (payment) => payment.event)
  payments: Payment[];

  @OneToMany(() => Review, (review) => review.event)
  reviews: Review[];

  @ManyToMany(() => Category, (category) => category.events)
  @JoinTable({
    name: 'event_categories',
    joinColumn: { name: 'eventId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'categoryId', referencedColumnName: 'id' },
  })
  categories: Category[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

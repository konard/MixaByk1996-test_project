import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  Index,
} from 'typeorm';
import { Event } from '../events/event.entity';

@Entity('venues')
@Index(['city', 'country'])
export class Venue {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  address: string;

  @Column()
  city: string;

  @Column()
  country: string;

  @Column({ type: 'int' })
  capacity: number;

  @OneToMany(() => Event, (event) => event.venue)
  events: Event[];
}

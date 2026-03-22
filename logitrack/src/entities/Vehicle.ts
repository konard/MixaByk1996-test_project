import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Driver } from "./Driver";

@Entity("vehicles")
export class Vehicle {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  type: string;

  @Column()
  plate: string;

  @Column()
  model: string;

  @Column()
  year: number;

  @Column({ default: "active" })
  status: string;

  @Column({ nullable: true })
  driverId: string;

  @ManyToOne(() => Driver, (driver) => driver.vehicles)
  @JoinColumn({ name: "driverId" })
  driver: Driver;
}

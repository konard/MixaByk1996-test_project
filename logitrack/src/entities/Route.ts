import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from "typeorm";
import { Driver } from "./Driver";
import { Order } from "./Order";

@Entity("routes")
export class Route {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column()
  startAddress: string;

  @Column()
  endAddress: string;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  distance: number;

  @Column()
  estimatedDuration: number;

  @Column({ default: "planned" })
  status: string;

  @Column({ nullable: true })
  driverId: string;

  @ManyToOne(() => Driver, (driver) => driver.routes)
  @JoinColumn({ name: "driverId" })
  driver: Driver;

  @OneToMany(() => Order, (order) => order.route)
  orders: Order[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

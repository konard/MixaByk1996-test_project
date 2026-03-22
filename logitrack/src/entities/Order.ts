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
import { User } from "./User";
import { Driver } from "./Driver";
import { Route } from "./Route";
import { DeliveryLog } from "./DeliveryLog";

@Entity("orders")
export class Order {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true })
  trackingNumber: string;

  @Column({ default: "pending" })
  status: string;

  @Column()
  senderName: string;

  @Column()
  senderAddress: string;

  @Column()
  receiverName: string;

  @Column()
  receiverAddress: string;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  weight: number;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  userId: string;

  @Column({ nullable: true })
  driverId: string;

  @Column({ nullable: true })
  routeId: string;

  @ManyToOne(() => User, (user) => user.orders)
  @JoinColumn({ name: "userId" })
  user: User;

  @ManyToOne(() => Driver, (driver) => driver.orders)
  @JoinColumn({ name: "driverId" })
  driver: Driver;

  @ManyToOne(() => Route, (route) => route.orders)
  @JoinColumn({ name: "routeId" })
  route: Route;

  @OneToMany(() => DeliveryLog, (log) => log.order)
  deliveryLogs: DeliveryLog[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

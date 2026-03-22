import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Order } from "./Order";

@Entity("delivery_logs")
export class DeliveryLog {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  orderId: string;

  @Column()
  status: string;

  @Column()
  location: string;

  @Column({ nullable: true })
  notes: string;

  @ManyToOne(() => Order, (order) => order.deliveryLogs)
  @JoinColumn({ name: "orderId" })
  order: Order;

  @CreateDateColumn()
  timestamp: Date;
}

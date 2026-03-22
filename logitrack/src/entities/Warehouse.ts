import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { User } from "./User";

@Entity("warehouses")
export class Warehouse {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column()
  address: string;

  @Column()
  city: string;

  @Column()
  country: string;

  @Column()
  capacity: number;

  @Column({ nullable: true })
  managerId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: "managerId" })
  manager: User;

  @CreateDateColumn()
  createdAt: Date;
}

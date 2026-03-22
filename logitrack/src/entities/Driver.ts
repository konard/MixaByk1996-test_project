import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  OneToOne,
  OneToMany,
  JoinColumn,
} from "typeorm";
import { User } from "./User";
import { Order } from "./Order";
import { Route } from "./Route";
import { Vehicle } from "./Vehicle";

@Entity("drivers")
export class Driver {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  userId: string;

  @Column({ unique: true })
  licenseNumber: string;

  @Column()
  vehicleType: string;

  @Column()
  vehiclePlate: string;

  @Column({ default: "available" })
  status: string;

  @Column({ type: "decimal", precision: 10, scale: 7, nullable: true })
  currentLatitude: number;

  @Column({ type: "decimal", precision: 10, scale: 7, nullable: true })
  currentLongitude: number;

  @OneToOne(() => User)
  @JoinColumn({ name: "userId" })
  user: User;

  @OneToMany(() => Order, (order) => order.driver)
  orders: Order[];

  @OneToMany(() => Route, (route) => route.driver)
  routes: Route[];

  @OneToMany(() => Vehicle, (vehicle) => vehicle.driver)
  vehicles: Vehicle[];

  @UpdateDateColumn()
  updatedAt: Date;
}

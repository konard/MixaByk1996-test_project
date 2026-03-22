import { DataSource } from "typeorm";
import { User } from "../entities/User";
import { Order } from "../entities/Order";
import { Route } from "../entities/Route";
import { Driver } from "../entities/Driver";
import { Warehouse } from "../entities/Warehouse";
import { DeliveryLog } from "../entities/DeliveryLog";
import { Vehicle } from "../entities/Vehicle";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432"),
  username: process.env.DB_USERNAME || "logitrack",
  password: process.env.DB_PASSWORD || "logitrack_secret",
  database: process.env.DB_NAME || "logitrack",
  synchronize: true,
  logging: process.env.NODE_ENV === "development",
  entities: [User, Order, Route, Driver, Warehouse, DeliveryLog, Vehicle],
  subscribers: [],
  migrations: [],
});

import { AppDataSource } from "../config/database";
import { Order } from "../entities/Order";
import { DeliveryLog } from "../entities/DeliveryLog";
import { CacheService } from "./cache.service";
import { v4 as uuidv4 } from "uuid";

const orderRepository = () => AppDataSource.getRepository(Order);
const deliveryLogRepository = () => AppDataSource.getRepository(DeliveryLog);

export class OrderService {
  static async findAll(): Promise<Order[]> {
    const cached = await CacheService.get<Order[]>("orders:all");
    if (cached) return cached;

    const orders = await orderRepository()
      .createQueryBuilder("order")
      .leftJoinAndSelect("order.user", "user")
      .leftJoinAndSelect("order.driver", "driver")
      .leftJoinAndSelect("driver.user", "driverUser")
      .leftJoinAndSelect("order.route", "route")
      .leftJoinAndSelect("order.deliveryLogs", "deliveryLogs")
      .orderBy("order.createdAt", "DESC")
      .getMany();

    await CacheService.set("orders:all", orders, 300);
    return orders;
  }

  static async findById(id: string): Promise<Order | null> {
    const cached = await CacheService.get<Order>(`order:${id}`);
    if (cached) return cached;

    const order = await orderRepository()
      .createQueryBuilder("order")
      .leftJoinAndSelect("order.user", "user")
      .leftJoinAndSelect("order.driver", "driver")
      .leftJoinAndSelect("driver.user", "driverUser")
      .leftJoinAndSelect("order.route", "route")
      .leftJoinAndSelect("route.driver", "routeDriver")
      .leftJoinAndSelect("order.deliveryLogs", "deliveryLogs")
      .where("order.id = :id", { id })
      .getOne();

    if (order) {
      await CacheService.set(`order:${id}`, order, 300);
    }
    return order;
  }

  static async findByStatus(status: string): Promise<Order[]> {
    return orderRepository()
      .createQueryBuilder("order")
      .leftJoinAndSelect("order.user", "user")
      .leftJoinAndSelect("order.driver", "driver")
      .leftJoinAndSelect("driver.user", "driverUser")
      .leftJoinAndSelect("order.route", "route")
      .leftJoinAndSelect("order.deliveryLogs", "deliveryLogs")
      .where("order.status = :status", { status })
      .orderBy("order.createdAt", "DESC")
      .getMany();
  }

  static async findByUser(userId: string): Promise<Order[]> {
    return orderRepository()
      .createQueryBuilder("order")
      .leftJoinAndSelect("order.user", "user")
      .leftJoinAndSelect("order.driver", "driver")
      .leftJoinAndSelect("driver.user", "driverUser")
      .leftJoinAndSelect("order.route", "route")
      .leftJoinAndSelect("order.deliveryLogs", "deliveryLogs")
      .where("order.userId = :userId", { userId })
      .orderBy("order.createdAt", "DESC")
      .getMany();
  }

  static async create(input: Partial<Order>): Promise<Order> {
    const trackingNumber = `LT-${uuidv4().substring(0, 8).toUpperCase()}`;
    const order = orderRepository().create({
      ...input,
      trackingNumber,
      status: "pending",
    });
    const saved = await orderRepository().save(order);
    await CacheService.invalidatePattern("orders:*");
    return saved;
  }

  static async updateStatus(id: string, status: string, location?: string, notes?: string): Promise<Order | null> {
    await orderRepository().update(id, { status });

    if (location) {
      const log = deliveryLogRepository().create({
        orderId: id,
        status,
        location,
        notes: notes || null,
      });
      await deliveryLogRepository().save(log);
    }

    await CacheService.del(`order:${id}`);
    await CacheService.invalidatePattern("orders:*");
    return this.findById(id);
  }

  static async assignDriver(orderId: string, driverId: string): Promise<Order | null> {
    await orderRepository().update(orderId, { driverId, status: "assigned" });
    await CacheService.del(`order:${orderId}`);
    await CacheService.invalidatePattern("orders:*");
    return this.findById(orderId);
  }
}

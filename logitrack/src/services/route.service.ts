import { AppDataSource } from "../config/database";
import { Route } from "../entities/Route";
import { CacheService } from "./cache.service";

const routeRepository = () => AppDataSource.getRepository(Route);

export class RouteService {
  static async findAll(): Promise<Route[]> {
    const cached = await CacheService.get<Route[]>("routes:all");
    if (cached) return cached;

    const routes = await routeRepository()
      .createQueryBuilder("route")
      .leftJoinAndSelect("route.driver", "driver")
      .leftJoinAndSelect("driver.user", "user")
      .leftJoinAndSelect("route.orders", "orders")
      .leftJoinAndSelect("orders.user", "orderUser")
      .leftJoinAndSelect("orders.deliveryLogs", "deliveryLogs")
      .orderBy("route.createdAt", "DESC")
      .getMany();

    await CacheService.set("routes:all", routes, 300);
    return routes;
  }

  static async findById(id: string): Promise<Route | null> {
    const cached = await CacheService.get<Route>(`route:${id}`);
    if (cached) return cached;

    const route = await routeRepository()
      .createQueryBuilder("route")
      .leftJoinAndSelect("route.driver", "driver")
      .leftJoinAndSelect("driver.user", "user")
      .leftJoinAndSelect("driver.vehicles", "vehicles")
      .leftJoinAndSelect("route.orders", "orders")
      .leftJoinAndSelect("orders.user", "orderUser")
      .leftJoinAndSelect("orders.deliveryLogs", "deliveryLogs")
      .where("route.id = :id", { id })
      .getOne();

    if (route) {
      await CacheService.set(`route:${id}`, route, 300);
    }
    return route;
  }

  static async findActive(): Promise<Route[]> {
    return routeRepository()
      .createQueryBuilder("route")
      .leftJoinAndSelect("route.driver", "driver")
      .leftJoinAndSelect("driver.user", "user")
      .leftJoinAndSelect("route.orders", "orders")
      .leftJoinAndSelect("orders.deliveryLogs", "deliveryLogs")
      .where("route.status = :status", { status: "active" })
      .orderBy("route.createdAt", "DESC")
      .getMany();
  }

  static async create(input: Partial<Route>): Promise<Route> {
    const route = routeRepository().create({
      ...input,
      status: "planned",
    });
    const saved = await routeRepository().save(route);
    await CacheService.invalidatePattern("routes:*");
    return saved;
  }

  static async updateStatus(id: string, status: string): Promise<Route | null> {
    await routeRepository().update(id, { status });

    if (status === "active") {
      const route = await this.findById(id);
      if (route) {
        await CacheService.setActiveRoute(id, route);
      }
    }

    await CacheService.del(`route:${id}`);
    await CacheService.invalidatePattern("routes:*");
    return this.findById(id);
  }
}

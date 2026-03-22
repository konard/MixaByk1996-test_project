import { AppDataSource } from "../config/database";
import { Driver } from "../entities/Driver";
import { CacheService } from "./cache.service";

const driverRepository = () => AppDataSource.getRepository(Driver);

export class TrackingService {
  static async updateDriverLocation(
    driverId: string,
    latitude: number,
    longitude: number
  ): Promise<Driver | null> {
    await driverRepository().update(driverId, {
      currentLatitude: latitude,
      currentLongitude: longitude,
    });

    await CacheService.setDriverLocation(driverId, latitude, longitude);
    await CacheService.del(`driver:${driverId}`);

    return driverRepository()
      .createQueryBuilder("driver")
      .leftJoinAndSelect("driver.user", "user")
      .leftJoinAndSelect("driver.routes", "routes")
      .leftJoinAndSelect("driver.orders", "orders")
      .leftJoinAndSelect("driver.vehicles", "vehicles")
      .where("driver.id = :id", { id: driverId })
      .getOne();
  }

  static async getDriverLocation(
    driverId: string
  ): Promise<{ latitude: number; longitude: number; updatedAt: string } | null> {
    const cached = await CacheService.getDriverLocation(driverId);
    if (cached) return cached;

    const driver = await driverRepository().findOne({ where: { id: driverId } });
    if (!driver || !driver.currentLatitude || !driver.currentLongitude) return null;

    const location = {
      latitude: driver.currentLatitude,
      longitude: driver.currentLongitude,
      updatedAt: driver.updatedAt.toISOString(),
    };

    await CacheService.setDriverLocation(driverId, location.latitude, location.longitude);
    return location;
  }

  static async findAllDrivers(): Promise<Driver[]> {
    const cached = await CacheService.get<Driver[]>("drivers:all");
    if (cached) return cached;

    const drivers = await driverRepository()
      .createQueryBuilder("driver")
      .leftJoinAndSelect("driver.user", "user")
      .leftJoinAndSelect("driver.routes", "routes")
      .leftJoinAndSelect("driver.orders", "orders")
      .leftJoinAndSelect("orders.deliveryLogs", "deliveryLogs")
      .leftJoinAndSelect("driver.vehicles", "vehicles")
      .getMany();

    await CacheService.set("drivers:all", drivers, 300);
    return drivers;
  }

  static async findDriverById(id: string): Promise<Driver | null> {
    const cached = await CacheService.get<Driver>(`driver:${id}`);
    if (cached) return cached;

    const driver = await driverRepository()
      .createQueryBuilder("driver")
      .leftJoinAndSelect("driver.user", "user")
      .leftJoinAndSelect("driver.routes", "routes")
      .leftJoinAndSelect("routes.orders", "routeOrders")
      .leftJoinAndSelect("driver.orders", "orders")
      .leftJoinAndSelect("orders.deliveryLogs", "deliveryLogs")
      .leftJoinAndSelect("driver.vehicles", "vehicles")
      .where("driver.id = :id", { id })
      .getOne();

    if (driver) {
      await CacheService.set(`driver:${id}`, driver, 300);
    }
    return driver;
  }

  static async findAvailableDrivers(): Promise<Driver[]> {
    return driverRepository()
      .createQueryBuilder("driver")
      .leftJoinAndSelect("driver.user", "user")
      .leftJoinAndSelect("driver.vehicles", "vehicles")
      .where("driver.status = :status", { status: "available" })
      .getMany();
  }
}

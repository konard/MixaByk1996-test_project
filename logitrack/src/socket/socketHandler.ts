import { Server, Socket } from "socket.io";
import { TrackingService } from "../services/tracking.service";
import { CacheService } from "../services/cache.service";

interface LocationUpdate {
  driverId: string;
  latitude: number;
  longitude: number;
}

interface RouteSubscription {
  routeId: string;
}

interface AuthData {
  userId: string;
  role: string;
}

export const setupSocketHandlers = (io: Server): void => {
  io.on("connection", (socket: Socket) => {
    const authData = socket.handshake.auth as AuthData;

    if (authData?.userId) {
      CacheService.addSocketSession(socket.id, authData.userId);
      socket.join(`user:${authData.userId}`);
    }

    socket.on("driver:location:update", async (data: LocationUpdate) => {
      try {
        const driver = await TrackingService.updateDriverLocation(
          data.driverId,
          data.latitude,
          data.longitude
        );

        if (driver) {
          io.to(`route:${data.driverId}`).emit("driver:location:changed", {
            driverId: data.driverId,
            latitude: data.latitude,
            longitude: data.longitude,
            updatedAt: new Date().toISOString(),
          });

          io.emit("drivers:location:broadcast", {
            driverId: data.driverId,
            latitude: data.latitude,
            longitude: data.longitude,
          });
        }
      } catch (error) {
        socket.emit("error", { message: "Failed to update location" });
      }
    });

    socket.on("route:subscribe", (data: RouteSubscription) => {
      socket.join(`route:${data.routeId}`);
      socket.emit("route:subscribed", { routeId: data.routeId });
    });

    socket.on("route:unsubscribe", (data: RouteSubscription) => {
      socket.leave(`route:${data.routeId}`);
      socket.emit("route:unsubscribed", { routeId: data.routeId });
    });

    socket.on("order:track", (data: { orderId: string }) => {
      socket.join(`order:${data.orderId}`);
      socket.emit("order:tracking:started", { orderId: data.orderId });
    });

    socket.on("order:untrack", (data: { orderId: string }) => {
      socket.leave(`order:${data.orderId}`);
    });

    socket.on("driver:location:get", async (data: { driverId: string }) => {
      try {
        const location = await TrackingService.getDriverLocation(data.driverId);
        socket.emit("driver:location:current", {
          driverId: data.driverId,
          ...location,
        });
      } catch (error) {
        socket.emit("error", { message: "Failed to get driver location" });
      }
    });

    socket.on("disconnect", () => {
      CacheService.removeSocketSession(socket.id);
    });
  });
};

export const emitOrderStatusUpdate = (
  io: Server,
  orderId: string,
  status: string,
  location?: string
): void => {
  io.to(`order:${orderId}`).emit("order:status:updated", {
    orderId,
    status,
    location,
    updatedAt: new Date().toISOString(),
  });
};

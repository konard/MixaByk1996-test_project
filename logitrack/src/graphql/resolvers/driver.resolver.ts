import { TrackingService } from "../../services/tracking.service";

export const driverResolver = {
  Query: {
    drivers: () => TrackingService.findAllDrivers(),
    driver: (_: unknown, { id }: { id: string }) => TrackingService.findDriverById(id),
    availableDrivers: () => TrackingService.findAvailableDrivers(),
  },
  Mutation: {
    updateDriverLocation: (
      _: unknown,
      { input }: { input: { driverId: string; latitude: number; longitude: number } }
    ) => TrackingService.updateDriverLocation(input.driverId, input.latitude, input.longitude),
  },
};

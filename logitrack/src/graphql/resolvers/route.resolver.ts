import { RouteService } from "../../services/route.service";

export const routeResolver = {
  Query: {
    routes: () => RouteService.findAll(),
    route: (_: unknown, { id }: { id: string }) => RouteService.findById(id),
    activeRoutes: () => RouteService.findActive(),
  },
  Mutation: {
    createRoute: (
      _: unknown,
      { input }: { input: { name: string; startAddress: string; endAddress: string; distance: number; estimatedDuration: number; driverId?: string } }
    ) => RouteService.create(input),
  },
};

import { OrderService } from "../../services/order.service";

export const orderResolver = {
  Query: {
    orders: () => OrderService.findAll(),
    order: (_: unknown, { id }: { id: string }) => OrderService.findById(id),
    ordersByStatus: (_: unknown, { status }: { status: string }) =>
      OrderService.findByStatus(status),
    ordersByUser: (_: unknown, { userId }: { userId: string }) =>
      OrderService.findByUser(userId),
  },
  Mutation: {
    createOrder: (
      _: unknown,
      { input }: { input: { senderName: string; senderAddress: string; receiverName: string; receiverAddress: string; weight: number; description?: string; userId?: string } }
    ) => OrderService.create(input),
    updateOrderStatus: (
      _: unknown,
      { id, status, location, notes }: { id: string; status: string; location?: string; notes?: string }
    ) => OrderService.updateStatus(id, status, location, notes),
    assignDriver: (
      _: unknown,
      { orderId, driverId }: { orderId: string; driverId: string }
    ) => OrderService.assignDriver(orderId, driverId),
  },
};

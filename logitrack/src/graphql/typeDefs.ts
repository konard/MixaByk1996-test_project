import { gql } from "apollo-server-express";

export const typeDefs = gql`
  type User {
    id: ID!
    email: String!
    firstName: String!
    lastName: String!
    role: String!
    orders: [Order!]
    createdAt: String!
    updatedAt: String!
  }

  type Order {
    id: ID!
    trackingNumber: String!
    status: String!
    senderName: String!
    senderAddress: String!
    receiverName: String!
    receiverAddress: String!
    weight: Float!
    description: String
    user: User
    driver: Driver
    route: Route
    deliveryLogs: [DeliveryLog!]
    createdAt: String!
    updatedAt: String!
  }

  type Route {
    id: ID!
    name: String!
    startAddress: String!
    endAddress: String!
    distance: Float!
    estimatedDuration: Int!
    status: String!
    driver: Driver
    orders: [Order!]
    createdAt: String!
    updatedAt: String!
  }

  type Driver {
    id: ID!
    user: User
    licenseNumber: String!
    vehicleType: String!
    vehiclePlate: String!
    status: String!
    currentLatitude: Float
    currentLongitude: Float
    orders: [Order!]
    routes: [Route!]
    vehicles: [Vehicle!]
    updatedAt: String!
  }

  type Vehicle {
    id: ID!
    type: String!
    plate: String!
    model: String!
    year: Int!
    status: String!
    driver: Driver
  }

  type Warehouse {
    id: ID!
    name: String!
    address: String!
    city: String!
    country: String!
    capacity: Int!
    manager: User
    createdAt: String!
  }

  type DeliveryLog {
    id: ID!
    order: Order
    status: String!
    location: String!
    notes: String
    timestamp: String!
  }

  type DriverLocation {
    latitude: Float!
    longitude: Float!
    updatedAt: String!
  }

  input CreateOrderInput {
    senderName: String!
    senderAddress: String!
    receiverName: String!
    receiverAddress: String!
    weight: Float!
    description: String
    userId: String
  }

  input CreateRouteInput {
    name: String!
    startAddress: String!
    endAddress: String!
    distance: Float!
    estimatedDuration: Int!
    driverId: String
  }

  input UpdateDriverLocationInput {
    driverId: String!
    latitude: Float!
    longitude: Float!
  }

  type Query {
    orders: [Order!]!
    order(id: ID!): Order
    ordersByStatus(status: String!): [Order!]!
    ordersByUser(userId: ID!): [Order!]!
    routes: [Route!]!
    route(id: ID!): Route
    activeRoutes: [Route!]!
    drivers: [Driver!]!
    driver(id: ID!): Driver
    availableDrivers: [Driver!]!
    users: [User!]!
    user(id: ID!): User
  }

  type Mutation {
    createOrder(input: CreateOrderInput!): Order!
    updateOrderStatus(id: ID!, status: String!, location: String, notes: String): Order
    assignDriver(orderId: ID!, driverId: ID!): Order
    updateDriverLocation(input: UpdateDriverLocationInput!): Driver
    createRoute(input: CreateRouteInput!): Route!
  }
`;

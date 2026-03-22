import "reflect-metadata";
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import http from "http";
import { ApolloServer } from "apollo-server-express";
import { Server as SocketIOServer } from "socket.io";
import { AppDataSource } from "./config/database";
import { typeDefs } from "./graphql/typeDefs";
import { orderResolver } from "./graphql/resolvers/order.resolver";
import { routeResolver } from "./graphql/resolvers/route.resolver";
import { driverResolver } from "./graphql/resolvers/driver.resolver";
import { userResolver } from "./graphql/resolvers/user.resolver";
import { setupSocketHandlers } from "./socket/socketHandler";
import { authenticate, AuthenticatedRequest } from "./middleware/auth";
import redisClient from "./config/redis";

const PORT = parseInt(process.env.PORT || "4000");

const resolvers = {
  Query: {
    ...orderResolver.Query,
    ...routeResolver.Query,
    ...driverResolver.Query,
    ...userResolver.Query,
  },
  Mutation: {
    ...orderResolver.Mutation,
    ...routeResolver.Mutation,
    ...driverResolver.Mutation,
  },
};

async function bootstrap() {
  const app = express();
  const httpServer = http.createServer(app);

  app.use(cors());
  app.use(express.json());
  app.use(authenticate as express.RequestHandler);

  await AppDataSource.initialize();

  await redisClient.ping();

  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }: { req: AuthenticatedRequest }) => ({
      user: req.user || null,
    }),
  });

  await apolloServer.start();
  apolloServer.applyMiddleware({ app: app as any });

  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
    pingTimeout: 60000,
    pingInterval: 25000,
    maxHttpBufferSize: 1e6,
    transports: ["websocket", "polling"],
  });

  setupSocketHandlers(io);

  app.get("/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  httpServer.listen(PORT, () => {
    process.stdout.write(
      `Server running on port ${PORT}\n` +
      `GraphQL endpoint: http://localhost:${PORT}${apolloServer.graphqlPath}\n` +
      `WebSocket server ready\n`
    );
  });
}

bootstrap().catch((error) => {
  process.stderr.write(`Failed to start server: ${error}\n`);
  process.exit(1);
});

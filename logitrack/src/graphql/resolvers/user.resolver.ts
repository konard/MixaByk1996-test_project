import { AppDataSource } from "../../config/database";
import { User } from "../../entities/User";

const userRepository = () => AppDataSource.getRepository(User);

export const userResolver = {
  Query: {
    users: () =>
      userRepository()
        .createQueryBuilder("user")
        .leftJoinAndSelect("user.orders", "orders")
        .getMany(),
    user: (_: unknown, { id }: { id: string }) =>
      userRepository()
        .createQueryBuilder("user")
        .leftJoinAndSelect("user.orders", "orders")
        .where("user.id = :id", { id })
        .getOne(),
  },
};

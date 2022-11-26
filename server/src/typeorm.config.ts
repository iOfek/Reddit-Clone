import { DataSource } from "typeorm";
import { Post } from "./entities/Post";
import { User } from "./entities/User";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "Admataiyan15",
  database: "lireddit",
  entities: [Post, User],
  synchronize: true,
  logging: true,
});

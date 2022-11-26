import { ApolloServer } from "apollo-server-express";
import connectRedis from "connect-redis";
import cors from "cors";
import express from "express";
import session from "express-session";
import ioredis from "ioredis";
import "reflect-metadata";
import { buildSchema } from "type-graphql";
import { COOKIE_NAME, __prod__ } from "./constants";
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";
import { AppDataSource } from "./typeorm.config";
import { MyContext } from "./types";
const PORT = 4000;

declare module "express-session" {
  interface SessionData {
    userId: number;
  }
}
const main = async () => {
  // sendEmail("bob@bob.com", "hello bob");
  const conn = await AppDataSource.initialize();

  const app = express();

  const RedisStore = connectRedis(session);
  const redis = new ioredis();
  // const redisClient = new redis({ legacyMode: true });
  redis.connect().catch((err) => `RedisClient Connect error: ${err}`);

  !__prod__ && app.set("trust proxy", 1);

  app.use(
    cors({
      origin: [
        "http://localhost:3000",
        "http://localhost:4000/graphql",
        "https://studio.apollographql.com",
      ],
      credentials: true,
    })
  );

  app.use(
    session({
      name: COOKIE_NAME,
      store: new RedisStore({ client: redis, disableTouch: true }),
      saveUninitialized: false,
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 12, //2 weeks
        httpOnly: true,
        sameSite: "lax", // sets cookie from frontend localhost:3000
        secure: false, // sets cookie from frontend localhost:3000
      },
      secret: "shhhhdonttell",
      resave: false,
    })
  );

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false,
    }),
    context: ({ req, res }): MyContext => ({
      req,
      res,
      redis,
    }),
  });

  await apolloServer.start();
  apolloServer.applyMiddleware({
    app,
    cors: false,
  });

  app.listen(PORT, () => {
    console.log(`server started on localhost:${PORT}`);
  });
};

main().catch((err) => {
  console.error(err);
});

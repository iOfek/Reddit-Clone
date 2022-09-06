import "reflect-metadata";
import { __prod__ } from "./constants";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";
import ioredis from "ioredis";
import session from "express-session";
import connectRedis from "connect-redis";
import { MyContext } from "./types";
import cors from "cors";
import { MikroORM } from "@mikro-orm/core";
import config from "./mikro-orm.config";
const PORT = 4000;
declare module "express-session" {
  interface SessionData {
    userId: number;
  }
}
const main = async () => {
  // await Post.delete({})

  const orm = await MikroORM.init(config);
  orm.getMigrator().up();

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
      name: "COOKIE_NAME",
      store: new RedisStore({ client: redis, disableTouch: true }),
      saveUninitialized: false,
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10, //10 years
        httpOnly: true,
        sameSite: "none",
        secure: true,
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
      em: orm.em.fork(),
      req,
      res,
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

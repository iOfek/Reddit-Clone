import { dedupExchange, fetchExchange } from "urql";
import { cacheExchange } from "@urql/exchange-graphcache";

import Index from "../pages";
import {
  LoginMutation,
  MeDocument,
  LogoutMutation,
} from "../generated/graphql";

export const createUrqlClient = (ssrExchange: any) => ({
  url: "http://localhost:4000/graphql",
  fetchOptions: {
    credentials: "include" as const,
  },
  exchanges: [
    dedupExchange,
    cacheExchange({
      updates: {
        Mutation: {
          login: (result: LoginMutation, args, cache, info) => {
            return cache.updateQuery({ query: MeDocument }, () => {
              if (result.login.errors) return null;
              else {
                return { me: result.login.user };
              }
            });
          },
          logout: (result: LogoutMutation, args, cache, info) => {
            return cache.updateQuery({ query: MeDocument }, () => {
              return { me: null };
            });
          },
        },
      },
    }),
    ssrExchange,

    fetchExchange,
  ],
});

import { Resolver, Query, FieldResolver } from "type-graphql";
@Resolver()
export class HelloResolver {
  @Query(() => String)
  hello() {
    return "hello world";
  }
}

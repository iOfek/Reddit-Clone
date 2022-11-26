import { Post } from "../entities/Post";
import { MyContext } from "../types";
import {
  Resolver,
  Query,
  Ctx,
  Arg,
  Int,
  Mutation,
  InputType,
  Field,
} from "type-graphql";

@InputType()
class PostInput {
  @Field()
  title!: string;
  @Field()
  text!: string;
}

@Resolver()
export class PostResolver {
  @Query(() => [Post])
  posts(@Ctx() {}: MyContext): Promise<Post[]> {
    return Post.find({});
  }

  @Query(() => Post, { nullable: true })
  post(
    @Arg("id", () => Int) id: number,
    @Ctx() {}: MyContext
  ): Promise<Post | null> {
    return Post.findOne({ where: { id: id } });
  }

  @Mutation(() => Post)
  async createPost(
    @Arg("title", () => String) title: string,
    @Ctx() {}: MyContext
  ): Promise<Post> {
    const post = Post.create({ title });
    await post.save();
    return post;
  }

  @Mutation(() => Post)
  async updatePost(
    @Arg("id") id: number,
    @Arg("title", () => String) title: string,
    @Ctx() {}: MyContext
  ): Promise<Post | null> {
    const post = await Post.findOne({ where: { id: id } });
    if (!post) {
      return null;
    }
    if (typeof title !== "undefined") {
      post.title = title;
      await post.save();
    }
    return post;
  }

  @Mutation(() => Boolean)
  async deletePost(
    @Arg("id") id: number,
    @Ctx() {}: MyContext
  ): Promise<boolean> {
    try {
      const postToDelete = await Post.findOne({ where: { id: id } });
      await Post.remove(postToDelete!);
    } catch (error) {
      return false;
    }
    return true;
  }
}

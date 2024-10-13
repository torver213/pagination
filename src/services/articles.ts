import prisma from "@/db";
import { AppArticle } from "@/interfaces";
import { Post, Prisma } from "@prisma/client";

export const createManyArticles = async (args: {
    data: Prisma.PostCreateManyInput | Prisma.PostCreateManyInput[];
    skipDuplicates?: boolean | undefined;
}): Promise<Post[]> => {
    try {
        const result = await prisma.post.createManyAndReturn(args)
        return result;
    } catch (error: any) {
      throw error;
    }
};

export const getArticle = async (
    postWhereInput: Prisma.PostWhereInput,
  ) => {
    try {
      const post = await prisma.post.findFirst({ where: postWhereInput,});
      if (!post) {
        throw new Error("Post not found");
      }
      return post
    } catch (error: any) {
      throw error;
    }
  };

export const getArticles = async (
    params: {
      skip?: number;
      take?: number;
      cursor?: Prisma.PostWhereUniqueInput;
      where?: Prisma.PostWhereInput;
      distinct?:
        | Prisma.PostScalarFieldEnum
        | Prisma.PostScalarFieldEnum[]
        | undefined;
      orderBy?: Prisma.PostOrderByWithAggregationInput[];
    },
    stats?: boolean
  ) => {
    try {
      const { skip, take, cursor, where, orderBy, distinct } = params;
      const result = await prisma.post.findMany({
        skip,
        take,
        cursor,
        where,
        orderBy,
        distinct,
      });

      if(stats){
        const totalArticles = await prisma.post.count()
        return { totalArticles, articles: result}
      }
      return { articles: result };
    } catch (error: any) {
      throw error;
    }
  };

const articleService = { createManyArticles, getArticles, getArticle }

export default articleService
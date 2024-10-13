import { SearchQueryParams } from "@/interfaces";
import articleService, { createManyArticles } from "@/services/articles";
import { generateDummnyArticles } from "@/utils";
import { getCursorParams, getOrderByParams, getQueryParams } from "@/utils/dbHelpers";
import { Prisma } from "@prisma/client";
import { revalidateTag } from "next/cache";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest){
    try {
        const body = await request.json()
        if(!body || !body.limit) return Response.json("Invalid request payload", { status: 400})
        const limit = body.limit as number
        const dummyArticles = generateDummnyArticles(limit)
        const result = await createManyArticles({data: dummyArticles})
        revalidateTag("recent-articles")
        revalidateTag("offset-articles")
        revalidateTag("cursor-articles")
        revalidateTag("infinite-articles")
        return Response.json(result, { status: 200 })
    } catch (error: any) {
        return Response.json(error?.message, { status: 500})
    }
}

export async function GET(request: NextRequest) {
    const nextUrl = request.nextUrl;
  
    const searchParams = nextUrl.searchParams;
  
    const entries = searchParams.entries();
  
    const params = Object.fromEntries(entries) as SearchQueryParams;
    
    try {
      const skip: number = +params?.skip || 0;
      const take: number = +params?.limit || 50;
      const orderBy = getOrderByParams<Prisma.PostOrderByWithAggregationInput>(
        params.sort
      );
      const where = getQueryParams<Prisma.PostWhereInput>(params.filter);
      // check cursor is provided
      if (params.cursor) {
        const skip: number = +params?.skip || 1;
        const cursor = getCursorParams<Prisma.PostWhereUniqueInput>(
          params.cursor
        );
        console.log(`skip`, skip, `cursor:`, cursor)
        const result = await articleService.getArticles(
          {
            skip,
            take,
            cursor,
            where,
            orderBy,
          },
        );
        // console.log(result);
        return Response.json(result.articles);
      }
    //  check if stats is requested
      const queryParams = { skip, take, where, orderBy }
      if(params.stats){
        const result = await articleService.getArticles(queryParams, true)
        return Response.json(result);
      }
      const result = await articleService.getArticles(queryParams)
      return Response.json(result.articles);
    } catch (error: any) {
      return Response.json(error?.message, { status: 500 });
    }
  }
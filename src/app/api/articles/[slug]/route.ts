import articleService from "@/services/articles";
import { NextRequest } from "next/server";

export async function GET(
    request: NextRequest,
    { params: { slug } }: { params: { slug: string } }
  ) {
    if (!slug) return Response.json("No valid ID or slug provided", { status: 422 });

    try {
  
      const result = await articleService.getArticle( { OR: [{ id: slug }, { slug }] } );
  
      return Response.json(result);
    } catch (error: any) {
      return Response.json(error?.message, { status: 500 });
    }
  }
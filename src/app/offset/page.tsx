import { AppArticle } from "@/interfaces";
import { Box } from "@mui/material";
import ArticleClient from "./ArticleClient";

const url = `${process.env.NEXT_PUBLIC_BASE_URL}/articles?limit=24&sort=id:desc,createdAt:desc&stats=true`;

type IArticles = {
  totalArticles: number;
  articles: AppArticle[]
}

export default async function Page() {

  const result = await fetch(url, { 
    method: "GET", next: { tags: ["offset-articles"], revalidate: 3600 },
  });

  if (!result.ok) return <Box>No articles yet!</Box>

  const resp: IArticles = await result.json();

  return (
    <main>
      <ArticleClient {...resp} />
    </main>
  );
}

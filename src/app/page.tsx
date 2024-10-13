import { AppArticle } from "@/interfaces";
import { Box, Container, Typography } from "@mui/material";
import DisplayArticles from "@/components/DisplayArticles";

const url = `${process.env.NEXT_PUBLIC_BASE_URL}/articles?limit=24&sort=id:desc,createdAt:desc`;

export default async function Home() {
  const result = await fetch(url, {
    method: "GET",
    next: { tags: ["recent-articles"], revalidate: 3600 },
  });

  if (!result.ok) return <Box>No articles yet!</Box>;

  const articles: AppArticle[] = await result.json();

  return (
    <main>
      <Container maxWidth="xl" sx={{ my: 2 }}>
      <Typography sx={{ my: 3 }} variant="h4" textAlign={"center"}>
        Recent Articles
      </Typography>
        <DisplayArticles articles={articles} />
      </Container>
    </main>
  );
}

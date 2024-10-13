import { AppArticle } from "@/interfaces";
import { Box, CardMedia, Container, Typography } from "@mui/material";
import { notFound } from "next/navigation";
import React from "react";

type Props = {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

const url = `${process.env.NEXT_PUBLIC_BASE_URL}/articles`;

const Page = async ({ params }: Props) => {
  const result = await fetch(`${url}/${params.slug}`, {
    method: "GET",
    next: { tags: [params.slug], revalidate: 0 },
  });
  if (!result.ok) {
    return notFound();
  }
  const article: AppArticle = await result.json();
  return(
    <Container maxWidth="md">
        <CardMedia
        sx={{ height: 400 }}
        image={article.thumbnail}
        title={article.title}
      />
      <Box>
        <Typography gutterBottom variant="h4" component="div">
          {article.title}
        </Typography>
        <Typography component={"h6"} variant="h6" sx={{ color: 'text.secondary' }}>
          {article.description}
        </Typography>
        <Typography variant="body1" sx={{mt: 1}}>
          {article.content}
        </Typography>
      </Box>
    </Container>
  )
};

export default Page;

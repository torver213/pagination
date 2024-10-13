"use client";
import { AppArticle } from "@/interfaces";
import { Box, Container, Grid2, Pagination, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import _ from "lodash";
import { getArticles } from "@/lib/articles";
import useSWR from "swr";
import DisplayArticles from "@/components/DisplayArticles";

const ITEM_PER_PAGE = 24;

const getPaginationCount = (total: number) => {
  return Math.ceil(total / ITEM_PER_PAGE);
};


const ArticlePage = ({
    page,
  fallback,
}: {
    page: number;
  fallback: AppArticle[];
}) => {
  const { data, error } = useSWR(
    `/articles?limit=${ITEM_PER_PAGE}&skip=${
      (page - 1) * ITEM_PER_PAGE
    }&sort=id:desc,createdAt:desc`,
    (url) => getArticles(url),
    { fallbackData: fallback }
  );
  if (error) return null;
  return <DisplayArticles articles={data} />;
};

const ArticleClient = ({
  articles,
  totalArticles,
}: {
  articles: AppArticle[];
  totalArticles: number;
}) => {
  const [state, setState] = useState({ page: 1 });

  const debounceFetch = React.useRef(
    _.debounce((page: number) => {
      setState((prev) => ({ ...prev, page }));
    }, 1000)
  ).current;

  useEffect(() => {
    return () => {
      debounceFetch.cancel();
    };
  }, [debounceFetch]);

  const handleFetch = (event: React.ChangeEvent<unknown>, page: number) => {
    event.preventDefault();
    debounceFetch(page);
    setTimeout(() => {
        window.scrollTo({
          top: 0,  // Negative value to scroll up
          behavior: 'smooth'  // Smooth scrolling
        });
      }, 500);
  };

  const totalPages = getPaginationCount(totalArticles);

  return (
    <Container maxWidth="xl">
      <Typography sx={{ my: 3 }} variant="h4" textAlign={"center"}>
        Offset Pagination
      </Typography>
      <Typography
        variant="h5"
        sx={{ textAlign: "center", fontFamily: "PlayFair", pb: 1 }}
      >
        We have {totalArticles} article(s){" "}
      </Typography>

      <ArticlePage
        page={state.page}
        fallback={ articles }
      />
      {/* preload next page */}
      <div style={{ display: "none" }}>
        <ArticlePage
          page={state.page + 1 > totalPages ? state.page : state.page + 1}
          fallback={[]}
        />
      </div>
      {/* show pagination */}
      <Box sx={{ my: 4, display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Pagination
          size="large"
          count={totalPages}
          showFirstButton
          showLastButton
          onChange={handleFetch}
        />
      </Box>
    </Container>
  );
};

export default ArticleClient;

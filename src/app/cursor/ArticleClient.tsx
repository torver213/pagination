"use client";
import { AppArticle } from "@/interfaces";
import { Box, Container, Typography } from "@mui/material";
import React, { useEffect } from "react";
import _ from "lodash";
import DisplayArticles from "@/components/DisplayArticles";
import useSWRInfinite from "swr/infinite";
import { getInfiniteSWRArticles } from "@/lib/swr-hooks";
import { checkSWRIsLoadingMore, checkSWRReachEnd, getSWRData } from "@/utils/swr";
import { nanoid } from "nanoid";
import { LoadingButton } from "@mui/lab";

const PAGE_SIZE = 24;

const ArticleClient = ({
  articles,
  totalArticles,
}: {
  articles: AppArticle[];
  totalArticles: number;
}) => {

  // get keys for fetching data
  const getKey = (
    pageIndex: number,
    previousPageData: { data: AppArticle[] | undefined; nextCursor: string }
  ) => {
    // if no user or reached the end, do not fetch
    if (previousPageData && !previousPageData.data) return null;
    // first page, we don't have `previousPageData`
    if (pageIndex === 0) return {url: `/articles?limit=${PAGE_SIZE}&skip=0&sort=id:desc,createdAt:desc`, type: "cursor"};
    // add the cursor to the API endpoint
    return { url: `/articles?limit=${PAGE_SIZE}&skip=1&sort=id:desc,createdAt:desc&cursor=id:${previousPageData.nextCursor}`, type: "cursor"}
  };


  const { data, size, setSize, error, isLoading } = useSWRInfinite(
    getKey, ({url}) => getInfiniteSWRArticles(url),
    {
      fallbackData: [
        { data: articles, nextCursor: articles[articles.length - 1].id },
      ],
    }
  );

  const allPosts = getSWRData<AppArticle>(data)

  const totalCurrentPosts = allPosts.length

  const articleData = !data ? [] : data

  const isLoadingMore = checkSWRIsLoadingMore({isLoading, size, data}) 

  const isReachingEnd = checkSWRReachEnd({error, data, pageSize: PAGE_SIZE })
  
  const debounceFetch = React.useRef(
    _.debounce(() => {
      setSize(prev => prev + 1);
    }, 1000)
  ).current;

  useEffect(() => {
    return () => {
      debounceFetch.cancel();
    };
  }, [debounceFetch]);

  const handleLoadMore = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    debounceFetch()
    setTimeout(() => {
      window.scrollBy({
        top: -120,  // Negative value to scroll up
        behavior: 'smooth'  // Smooth scrolling
      });
    }, 500);
  };



  return (
    <Container maxWidth="xl">
      <Typography sx={{ my: 3 }} variant="h4" textAlign={"center"}>
        Cursor Pagination
      </Typography>
      <Typography
        variant="h5"
        sx={{ textAlign: "center", fontFamily: "PlayFair", pb: 1 }}
      >
        We have {totalArticles} article(s){" "}
      </Typography>

      {articleData.map(item => <DisplayArticles key={nanoid()} articles={item.data}/>)}

      <Typography variant="h5" sx={{textAlign: "center", fontFamily: "PlayFair", pt: 2}}>Showing {totalCurrentPosts } of {totalArticles} article(s) </Typography>

      <Box sx={{ py: 2, textAlign: "center", display: "block" }}>
        <LoadingButton
          disabled={isLoadingMore || isReachingEnd }
          loading={isLoadingMore}
          variant="contained"
          onClick={(ev) => handleLoadMore(ev)}
        >
          {isLoadingMore
            ? "Loading..."
            : isReachingEnd
            ? "No More Posts"
            : "Load More"}
        </LoadingButton>
      </Box>
    </Container>
  );
};

export default ArticleClient;

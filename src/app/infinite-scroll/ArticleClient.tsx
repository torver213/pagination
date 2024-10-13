"use client";
import { AppArticle } from "@/interfaces";
import { Box, CircularProgress, Container, Typography } from "@mui/material";
import React, { useEffect, useRef } from "react";
import _ from "lodash";
import DisplayArticles from "@/components/DisplayArticles";
import useSWRInfinite from "swr/infinite";
import { getInfiniteSWRArticles } from "@/lib/swr-hooks";
import { checkSWRIsLoadingMore, checkSWRReachEnd, getSWRData } from "@/utils/swr";
import { nanoid } from "nanoid";

const PAGE_SIZE = 24;

const ArticleClient = ({
  articles,
  totalArticles,
}: {
  articles: AppArticle[];
  totalArticles: number;
}) => {
  const lastItemRef = useRef<HTMLElement | null>(null); // Ref to track the last item before new data is appended
  // get keys for fetching data
  const getKey = (
    pageIndex: number,
    previousPageData: { data: AppArticle[] | undefined; nextCursor: string }
  ) => {
    // if no user or reached the end, do not fetch
    if (previousPageData && !previousPageData.data) return null;
    // first page, we don't have `previousPageData`
    if (pageIndex === 0) return {url: `/articles?limit=${PAGE_SIZE}&skip=0&sort=id:desc,createdAt:desc`, type: "infinite"};
    // add the cursor to the API endpoint
    return { url: `/articles?limit=${PAGE_SIZE}&skip=1&sort=id:desc,createdAt:desc&cursor=id:${previousPageData.nextCursor}`, type: "infinite"}
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

  const isLoadingMore = checkSWRIsLoadingMore({isLoading, size, data}) 

  const isReachingEnd = checkSWRReachEnd({error, data, pageSize: PAGE_SIZE })

  const articleData = !data ? [] : data
  
  const debounceFetch = React.useRef(
    _.debounce(() => {
      setSize(prev => prev + 1);
      lastItemRef.current = document.getElementById(`item-${size}`);
    }, 1000)
  ).current;

  useEffect(() => {
    return () => {
      debounceFetch.cancel();
    };
  }, [debounceFetch]);

  
  // Handle scroll event
  useEffect(() => {
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      if (((scrollTop + clientHeight) >= (scrollHeight - 10)) && !isReachingEnd) {
        debounceFetch()
        setTimeout(() => {
          window.scrollBy({
            top: -100,  // Negative value to scroll up
            behavior: 'smooth'  // Smooth scrolling
          });
        }, 500);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  return (
    <Container maxWidth="xl">
      <Typography sx={{ my: 3 }} variant="h4" textAlign={"center"}>
        Infinite Scroll Pagination
      </Typography>
      <Typography
        variant="h5"
        sx={{ textAlign: "center", fontFamily: "PlayFair", pb: 1 }}
      >
        We have {totalArticles} article(s){" "}
      </Typography>

      {articleData.map((item) =><DisplayArticles key={nanoid()} articles={item.data}/>)}

      <Typography variant="h5" sx={{textAlign: "center", fontFamily: "PlayFair", pt: 2}}>Showing {totalCurrentPosts } of {totalArticles} article(s) </Typography>

      <Box sx={{display: "flex", justifyContent: "center", alignItems: "center"}}>
        {(isLoadingMore && !isReachingEnd) && <CircularProgress color="error" size={20} /> }
        {isReachingEnd && <Typography color="textDisabled">No More Artciles</Typography> }
      </Box>

    </Container>
  );
};

export default ArticleClient;

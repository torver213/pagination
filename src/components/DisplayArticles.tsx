"use client";
import ArticleCard from "./ArticleCard";
import { AppArticle } from "@/interfaces";
import { Grid2 } from "@mui/material";
import React, {  } from "react";

const DisplayArticles = ({ articles }: { articles: AppArticle[] }) => {
    return (
      <React.Fragment>
        <Grid2 container spacing={2}>
          {articles.map((article) => (
            <Grid2 key={article.id} size={{ lg: 4 }} id={article.id}>
              <ArticleCard article={article} />
            </Grid2>
          ))}
        </Grid2>
      </React.Fragment>
    );
  };

  export default DisplayArticles
import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { AppArticle } from '@/interfaces';
import Link from 'next/link';

export default function ArticleCard({article}:{article: AppArticle}) {
  return (
    <Card sx={{height: "100%"}}>
      <Link href={`/articles/${article.slug}`}>
      <CardMedia
        sx={{ height: 300 }}
        image={article.thumbnail}
        title={article.title}
      />
      </Link>
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {article.title}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {article.description}
        </Typography>
      </CardContent>
    </Card>
  );
}

export interface AppArticle {
    id: string;
    title: string;
    description: string;
    content: string;
    slug: string;
    thumbnail: string;
    createdAt: string
    updatedAt: string
}

export interface AppDummnyArticle extends Omit<AppArticle, 'id' | 'createdAt' | 'updatedAt'> {}

export type SearchQueryParams = {
    skip: string;
    limit: string;
    cursor?: string;
    sort: string;
    filter?: string;
    stats?: string;
  };
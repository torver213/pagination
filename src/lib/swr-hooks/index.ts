
import { AppArticle } from "@/interfaces";
import { cache } from "react";
import {AxiosResponse } from 'axios'
import { axiosAPI } from "@/config";

type SWRCursorPaginate<T> = {
    data: T[];
    nextCursor: string;
  };
export const getInfiniteSWRArticles = cache(async (
      url: string,
    ): Promise<SWRCursorPaginate<AppArticle>> => {
        try {
          let res: AxiosResponse = await axiosAPI.get(url);
          const data: AppArticle[] = res.data;
          return { data, nextCursor: data[data.length - 1].id };
        } catch (error: any) {
          throw error;
        }
      }
  );
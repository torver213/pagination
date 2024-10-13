import { axiosAPI } from "@/config"
import { AppArticle } from "@/interfaces"
import { cache } from "react"
import {AxiosResponse } from 'axios'


export const getArticles = cache(async (url: string) =>{
    try {
        let res: AxiosResponse =  await axiosAPI.get(url)
        return res.data as AppArticle[]
    } catch (error: any) {
        throw error
    }
})
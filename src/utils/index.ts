import slugify from "slugify";
import { nanoid } from "nanoid";
import * as txtgen from "txtgen";
import {Picsum}  from 'picsum-photos'
import { AppDummnyArticle } from "@/interfaces";


export const slugifyString = (str: string) => {
    const _str = `${str} ${nanoid(5)}`
    return slugify(_str, {
      replacement: '-',  // replace spaces with replacement character, defaults to `-`
      remove: undefined, // remove characters that match regex, defaults to `undefined`
      lower: true,      // convert to lower case, defaults to `false`
      strict: true,     // strip special characters except replacement, defaults to `false`
      trim: true         // trim leading and trailing replacement chars, defaults to `true`
    })
  }
export const generateDummnyArticles = (limit: number) => {
    const dummyArticles: AppDummnyArticle[] = [];
    for (let i = 0; i < limit; i++) {
        const title = txtgen.sentence()
        const article = {
            title: txtgen.sentence(),
            slug: slugifyString(title),
            description: txtgen.paragraph(4),
            content: txtgen.article(),
            thumbnail: Picsum.url({
                height: 1200,
                width: 1200,
                jpg: true,
                grayscale: false
            })
        }
        dummyArticles.push(article)
    }
    return dummyArticles
}
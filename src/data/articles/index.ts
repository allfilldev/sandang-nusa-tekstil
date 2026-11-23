import { gsmKainArticle } from "@/data/articles/gsm-kain";
import { kainTenunRajutArticle } from "@/data/articles/kain-tenun-rajut";
import { memilihKainGarmenArticle } from "@/data/articles/memilih-kain-garmen";
import type { Article } from "@/domain/article";

export const articles: Article[] = [kainTenunRajutArticle, gsmKainArticle, memilihKainGarmenArticle];

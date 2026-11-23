import { authors } from "@/data/authors";
import type { Author } from "@/domain/author";

export function getAuthorById(authorId: string): Author {
  const author = authors.find((item) => item.id === authorId);
  if (!author) {
    throw new Error(`Author not found: ${authorId}`);
  }
  return author;
}

export function getDefaultAuthor(): Author {
  return authors[0];
}

import { Post } from "@prisma/client";

export const sortByDate = (a: Post, b: Post) => (a.createdAt < b.createdAt ? 1 : -1);
export const sortByUpvotes = (a: Post, b: Post) => (a.upvotes < b.upvotes ? 1 : -1);

"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/utils/prisma";

import { MIN_TITLE_LENGTH, MAX_TITLE_LENGTH, MIN_CONTENT_LENGTH, MAX_CONTENT_LENGTH } from "@/utils/constants";

export async function addPost(formData: FormData) {
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;

  if (title.length < MIN_TITLE_LENGTH) {
    return;
  }

  if (title.length > MAX_TITLE_LENGTH) {
    return;
  }

  if (content.length < MIN_CONTENT_LENGTH) {
    return;
  }

  if (content.length > MAX_CONTENT_LENGTH) {
    return;
  }

  const post = await prisma.post.create({
    data: {
      title,
      content,
    },
  });

  revalidatePath(`/${post.id}`);
  revalidatePath("/");
}

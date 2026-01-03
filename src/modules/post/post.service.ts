import { Post } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const createPost = async (
  data: Omit<Post, "id" | "createdAt" | "updatedAt">,
  userId: string
) => {
  const result = await prisma.post.create({
    data: {
      ...data,
      authorId: userId,
    },
  });
  return result;
};

const readPost = async () => {
  const result = await prisma.post.findMany();
  return result;
};

const singlePost = async (id: string) => {
  const result = prisma.post.findUnique({
    where: { id },
  });
  return result;
};

export const postService = {
  createPost,
  readPost,
  singlePost,
};

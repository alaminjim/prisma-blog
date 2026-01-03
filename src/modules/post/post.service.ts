import { Post } from "../../../generated/prisma/client";
import { PostWhereInput } from "../../../generated/prisma/models";
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

const readPost = async (payload: {
  search: string | undefined;
  tags: string[];
}) => {
  const addCondition: PostWhereInput[] = [];

  if (payload.search) {
    addCondition.push({
      OR: [
        {
          content: {
            contains: payload.search as string,
            mode: "insensitive",
          },
        },
        {
          tags: {
            has: payload.search as string,
          },
        },
      ],
    });
  }

  if (payload.tags.length > 0) {
    addCondition.push({
      tags: {
        hasEvery: payload.tags as string[],
      },
    });
  }

  const result = await prisma.post.findMany({
    where: {
      AND: addCondition,
    },
  });
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

import { Post, PostStatus } from "../../../generated/prisma/client";
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
  isFeatured: boolean | undefined;
  status: PostStatus | undefined;
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

  if (typeof payload.isFeatured === "boolean") {
    addCondition.push({
      isFeatured: payload.isFeatured,
    });
  }

  if (
    payload.status === "PUBLISHED" ||
    payload.status === "ARCHIVED" ||
    payload.status === "DRAFT"
  ) {
    addCondition.push({
      status: payload.status,
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

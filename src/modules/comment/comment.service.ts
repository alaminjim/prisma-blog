import { prisma } from "../../lib/prisma";

const createComment = async (payload: {
  content: string;
  authorId: string;
  postId: string;
  parentId: string;
}) => {
  await prisma.post.findUniqueOrThrow({
    where: {
      id: payload.postId,
    },
  });

  if (payload.parentId) {
    await prisma.comments.findUniqueOrThrow({
      where: {
        id: payload.parentId,
      },
    });
  }

  return await prisma.comments.create({
    data: payload,
  });
};

const getIdByComment = async (id: string) => {
  return await prisma.comments.findUnique({
    where: {
      id,
    },
    include: {
      post: {
        select: {
          id: true,
          content: true,
          views: true,
        },
      },
    },
  });
};

export const commentService = {
  createComment,
  getIdByComment,
};

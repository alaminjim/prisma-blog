import { CommentStatus } from "../../../generated/prisma/enums";
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

const getAuthorId = async (authorId: string) => {
  return await prisma.comments.findMany({
    where: { authorId },
    orderBy: {
      createdAt: "desc",
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

const deleteComment = async (id: string, authorId: string) => {
  const DeleteCommentData = await prisma.comments.findMany({
    where: {
      id,
      authorId,
    },
  });

  if (!DeleteCommentData) {
    throw new Error("Does not exists this comment");
  }

  return await prisma.comments.delete({
    where: {
      id,
    },
  });
};

const updateComment = async (
  id: string,
  data: { content?: string; status?: CommentStatus },
  authorId: string
) => {
  const commentData = await prisma.comments.findMany({
    where: {
      id,
      authorId,
    },
  });

  if (!commentData) {
    throw new Error("Does not exists this comment");
  }

  return await prisma.comments.update({
    where: {
      id,
      authorId,
    },
    data,
  });
};

const moderateComment = async (id: string, data: { status: CommentStatus }) => {
  const commentData = await prisma.comments.findUniqueOrThrow({
    where: {
      id,
    },
    select: {
      id: true,
      status: true,
    },
  });

  if (commentData.status === data.status) {
    throw new Error(`This status ${data.status} al Ready have date`);
  }

  return await prisma.comments.update({
    where: {
      id,
    },
    data,
  });
};

export const commentService = {
  createComment,
  getIdByComment,
  getAuthorId,
  deleteComment,
  updateComment,
  moderateComment,
};

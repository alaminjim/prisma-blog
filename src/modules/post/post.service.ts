import {
  CommentStatus,
  Post,
  PostStatus,
} from "../../../generated/prisma/client";
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
  page: number;
  limit: number;
  skip: number;
  sortBy: string;
  sortOrder: string;
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
    take: payload.limit,
    skip: payload.skip,
    where: {
      AND: addCondition,
    },
    orderBy: {
      [payload.sortBy]: payload.sortOrder,
    },
    include: {
      _count: {
        select: { comment: true },
      },
    },
  });

  const total = await prisma.post.count({
    where: {
      AND: addCondition,
    },
  });
  return {
    data: result,
    pagination: {
      total,
      page: payload.page,
      limit: payload.limit,
      totalPage: Math.ceil(total / payload.limit),
    },
  };
};

const singlePost = async (id: string) => {
  return await prisma.$transaction(async (tx) => {
    await tx.post.update({
      where: {
        id: id,
      },
      data: {
        views: {
          increment: 1,
        },
      },
    });
    const result = tx.post.findUnique({
      where: { id },
      include: {
        comment: {
          where: {
            parentId: null,
          },
          orderBy: {
            createdAt: "desc",
          },
          include: {
            reply: {
              include: {
                reply: true,
              },
              orderBy: {
                createdAt: "asc",
              },
            },
          },
        },
        _count: {
          select: {
            comment: true,
          },
        },
      },
    });
    return result;
  });
};

const getMyPost = async (authorId: string) => {
  await prisma.user.findUniqueOrThrow({
    where: {
      id: authorId,
      status: "ACTIVE",
    },
    select: {
      id: true,
    },
  });

  const result = await prisma.post.findMany({
    where: {
      authorId,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      _count: {
        select: { comment: true },
      },
    },
  });

  const total = await prisma.post.aggregate({
    _count: {
      id: true,
    },

    where: {
      authorId,
    },
  });
  return { data: result, total };
};

// user cannot update isFeature
// admin can update all post
// user can only own post update

const updateOwnPost = async (
  postId: string,
  data: Partial<Post>,
  authorId: string,
  isAdmin: boolean
) => {
  const postData = await prisma.post.findUniqueOrThrow({
    where: {
      id: postId,
    },
    select: {
      id: true,
      authorId: true,
    },
  });

  if (!isAdmin && postData.authorId !== authorId) {
    throw new Error("You are not owner this post");
  }

  if (!isAdmin) {
    delete data.isFeatured;
  }

  return await prisma.post.update({
    where: {
      id: postData.id,
    },
    data,
  });
};

const deleteOwnPost = async (
  postId: string,
  authorId: string,
  isAdmin: boolean
) => {
  const postData = await prisma.post.findUniqueOrThrow({
    where: {
      id: postId,
    },
    select: {
      id: true,
      authorId: true,
    },
  });

  if (!isAdmin && postData.authorId !== authorId) {
    throw new Error("You are not owner this post");
  }

  return await prisma.post.delete({
    where: {
      id: postId,
    },
  });
};

const postStats = async () => {
  return await prisma.$transaction(async (tx) => {
    const [
      totalPost,
      publishedPost,
      draftsPost,
      archivedPost,
      totalComments,
      approvedComments,
      rejectComments,
      totalUser,
      totalAdmin,
      userCount,
      totalViews,
    ] = await Promise.all([
      await tx.post.count(),
      await tx.post.count({
        where: {
          status: PostStatus.PUBLISHED,
        },
      }),
      await tx.post.count({
        where: {
          status: PostStatus.ARCHIVED,
        },
      }),
      await tx.post.count({
        where: {
          status: PostStatus.DRAFT,
        },
      }),
      await tx.comments.count(),
      await tx.comments.count({
        where: {
          status: CommentStatus.APPROVED,
        },
      }),
      await tx.comments.count({
        where: {
          status: CommentStatus.REJECT,
        },
      }),
      await tx.user.count(),
      await tx.user.count({
        where: {
          role: "ADMIN",
        },
      }),
      await tx.user.count({
        where: {
          role: "USER",
        },
      }),
      await tx.post.aggregate({
        _sum: {
          views: true,
        },
      }),
    ]);
    return {
      totalPost,
      publishedPost,
      draftsPost,
      archivedPost,
      totalComments,
      approvedComments,
      rejectComments,
      totalUser,
      totalAdmin,
      userCount,
      totalViews: totalViews._sum.views,
    };
  });
};

export const postService = {
  createPost,
  readPost,
  singlePost,
  getMyPost,
  updateOwnPost,
  deleteOwnPost,
  postStats,
};

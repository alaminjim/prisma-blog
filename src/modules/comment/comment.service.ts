const createComment = async (payload: {
  content: string;
  authorId: string;
  postId: string;
  parentId: string;
}) => {
  console.log("comment", payload);
};

export const commentService = {
  createComment,
};

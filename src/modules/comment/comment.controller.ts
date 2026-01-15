import { Request, Response } from "express";
import { commentService } from "./comment.service";

const createComment = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    req.body.authorId = user?.id;

    const result = await commentService.createComment(req.body);

    res.status(201).json(result);
  } catch (error: any) {
    res.status(400).json({
      error: "comment creation failed",
      details: error,
    });
  }
};

const getIdByComment = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const result = await commentService.getIdByComment(id as string);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({
      error: "comment fetch failed",
      details: error,
    });
  }
};

const getIdByAuthor = async (req: Request, res: Response) => {
  try {
    const authorId = req.params.authorId;
    const result = await commentService.getAuthorId(authorId as string);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({
      error: "comment fetch failed",
      details: error,
    });
  }
};

const deleteComment = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const id = req.params.deleteId;
    const result = await commentService.deleteComment(
      id as string,
      user?.id as string
    );
    res.status(200).json({ data: result, message: "Delete Successful" });
  } catch (error: any) {
    res.status(400).json({
      error: "comment delete failed",
      details: error,
    });
  }
};

const updateComment = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const id = req.params.updateId;
    const result = await commentService.updateComment(
      id as string,
      req.body,
      user?.id as string
    );
    res.status(200).json({ data: result, message: "update Successful" });
  } catch (error: any) {
    res.status(400).json({
      error: "comment update failed",
      details: error,
    });
  }
};

const moderateComment = async (req: Request, res: Response) => {
  try {
    const commentId = req.params.commentId;

    const result = await commentService.moderateComment(
      commentId as string,
      req.body
    );
    res.status(200).json({ data: result, message: "update Successful" });
  } catch (error: any) {
    const errorMessage = error ? error.message : "comment update failed";
    res.status(400).json({
      error: errorMessage,
      details: error,
    });
  }
};

export const commentController = {
  createComment,
  getIdByComment,
  getIdByAuthor,
  deleteComment,
  updateComment,
  moderateComment,
};

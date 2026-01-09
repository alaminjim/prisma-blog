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

export const commentController = {
  createComment,
  getIdByComment,
  getIdByAuthor,
};

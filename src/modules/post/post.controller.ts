import { Request, Response } from "express";
import { postService } from "./post.service";

const createPost = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(400).json({
        error: "unAuthorized",
      });
    }

    const result = await postService.createPost(req.body, user.id as string);
    res.status(201).json(result);
  } catch (error: any) {
    res.status(400).json({
      error: "post creation failed",
      details: error,
    });
  }
};

const readPost = async (req: Request, res: Response) => {
  try {
    const result = await postService.readPost();
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      error: "post read failed",
      details: error,
    });
  }
};

const singlePost = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const result = await postService.singlePost(id as string);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      error: "post read failed",
      details: error,
    });
  }
};

export const postController = {
  createPost,
  readPost,
  singlePost,
};

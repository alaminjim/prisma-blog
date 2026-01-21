import { NextFunction, Request, Response } from "express";
import { postService } from "./post.service";
import { PostStatus } from "../../../generated/prisma/enums";
import sortAndPagination from "../../helpers/sortandpagination";
import filtering from "../../helpers/filtering";
import { UserRole } from "../../types/type";

const createPost = async (req: Request, res: Response, next: NextFunction) => {
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
    next(error);
  }
};

const readPost = async (req: Request, res: Response) => {
  try {
    const {
      search: postSearch,
      tags,
      isFeatured,
      status,
    } = filtering(req.query as any);

    const { page, limit, skip, sortBy, sortOrder } = sortAndPagination(
      req.query,
    );

    const result = await postService.readPost({
      search: postSearch,
      tags,
      isFeatured,
      status,
      page,
      limit,
      skip,
      sortBy,
      sortOrder,
    });
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

const getMyPost = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const result = await postService.getMyPost(user?.id as string);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(400).json({
      error: "post read failed",
      details: error,
    });
  }
};

const updateOwnPost = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const { postId } = req.params;
    const isAdmin = user?.role === UserRole.ADMIN;
    const result = await postService.updateOwnPost(
      postId as string,
      req.body,
      user?.id as string,
      isAdmin,
    );
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(400).json({
      error: "post read failed",
      details: error,
    });
  }
};

const deleteOwnPost = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const { postId } = req.params;
    const isAdmin = user?.role === UserRole.ADMIN;
    const result = await postService.deleteOwnPost(
      postId as string,
      user?.id as string,
      isAdmin,
    );
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(400).json({
      error: "post delete failed",
      details: error,
    });
  }
};

const postStats = async (req: Request, res: Response) => {
  try {
    const result = await postService.postStats();
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(400).json({
      error: "post stats failed",
      details: error,
    });
  }
};

export const postController = {
  createPost,
  readPost,
  singlePost,
  getMyPost,
  updateOwnPost,
  deleteOwnPost,
  postStats,
};

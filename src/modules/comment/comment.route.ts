import express from "express";
import { commentController } from "./comment.controller";
import auth from "../middleware/auth";
import { UserRole } from "../../types/type";

const router = express.Router();

router.get(
  "/author/:authorId",
  auth(UserRole.USER, UserRole.ADMIN),
  commentController.getIdByAuthor
);

router.get(
  "/:id",
  auth(UserRole.USER, UserRole.ADMIN),
  commentController.getIdByComment
);

router.post(
  "/",
  auth(UserRole.USER, UserRole.ADMIN),
  commentController.createComment
);

export const commentRouter = router;

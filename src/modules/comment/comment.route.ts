import express from "express";
import { commentController } from "./comment.controller";
import auth from "../middleware/auth";
import { UserRole } from "../../types/type";

const router = express.Router();

router.get("/author/:authorId", commentController.getIdByAuthor);

router.get("/:id", commentController.getIdByComment);

router.post(
  "/",
  auth(UserRole.USER, UserRole.ADMIN),
  commentController.createComment
);

router.delete(
  "/:deleteId",
  auth(UserRole.USER, UserRole.ADMIN),
  commentController.deleteComment
);

router.patch("/:updateId", commentController.updateComment);

export const commentRouter = router;

import express from "express";
import { commentController } from "./comment.controller";
import auth from "../middleware/auth";
import { UserRole } from "../../types/type";

const router = express.Router();

router.post(
  "/",
  auth(UserRole.USER, UserRole.ADMIN),
  commentController.createComment
);

export const commentRouter = router;

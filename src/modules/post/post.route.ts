import express from "express";
import { postController } from "./post.controller";
import auth from "../middleware/auth";
import { UserRole } from "../../types/type";

const router = express.Router();

router.get(
  "/my-posts",
  auth(UserRole.ADMIN, UserRole.USER),
  postController.getMyPost
);

router.get("/post-stats", auth(UserRole.ADMIN), postController.postStats);

router.get("/", postController.readPost);

router.get("/:id", postController.singlePost);

router.post(
  "/",
  auth(UserRole.USER, UserRole.ADMIN),
  postController.createPost
);

router.patch(
  "/:postId",
  auth(UserRole.ADMIN, UserRole.USER),
  postController.updateOwnPost
);

router.delete(
  "/:postId",
  auth(UserRole.ADMIN, UserRole.USER),
  postController.deleteOwnPost
);

export const postRouter = router;

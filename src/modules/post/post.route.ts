import express from "express";
import { postController } from "./post.controller";
import auth from "../middleware/auth";
import { UserRole } from "../../types/type";

const router = express.Router();

router.get("/", postController.readPost);

router.get("/:id", postController.singlePost);

router.post("/", auth(UserRole.USER), postController.createPost);

export const postRouter = router;

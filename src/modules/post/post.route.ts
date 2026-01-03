import express from "express";
import { postController } from "./post.controller";
import auth from "../middleware/auth";
import { UserRole } from "../../types/type";

const router = express.Router();

router.post("/", auth(UserRole.USER), postController.createPost);

router.get("/", postController.readPost);

export const postRouter = router;

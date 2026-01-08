import express, { Request, Response } from "express";
import { postRouter } from "./modules/post/post.route";
import { auth } from "./lib/auth";
import { toNodeHandler } from "better-auth/node";
import cors from "cors";
import { commentRouter } from "./modules/comment/comment.route";

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: process.env.APP_URL || "http://localhost:4000",
    credentials: true,
  })
);

app.use("/posts", postRouter);

app.use("/comments", commentRouter);

app.all("/api/auth/*splat", toNodeHandler(auth));

app.get("/", (req: Request, res: Response) => {
  res.send("API IS WORKING");
});

export default app;

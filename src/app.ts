import express, { Request, Response } from "express";
import { postRouter } from "./modules/post/post.route";
import { auth } from "./lib/auth";
import { toNodeHandler } from "better-auth/node";
import cors from "cors";
import { commentRouter } from "./modules/comment/comment.route";
import errorHandler from "./modules/middleware/errorHandler";
import { notFound } from "./modules/middleware/notFound";

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: process.env.APP_URL || "http://localhost:4000",
    credentials: true,
  }),
);

app.use("/posts", postRouter);

app.use("/comments", commentRouter);

app.all("/api/auth/*splat", toNodeHandler(auth));

app.get("/", (req: Request, res: Response) => {
  res.send("API IS WORKING");
});

app.use(notFound);

app.use(errorHandler);

export default app;

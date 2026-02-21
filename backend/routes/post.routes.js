import { Router } from "express";
import {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
} from "../controllers/post.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import {
  validate,
  createPostSchema,
  updatePostSchema,
} from "../validators/index.js";
import upload from "../middleware/upload.middleware.js";

const router = Router();

// Public
router.get("/", getPosts);
router.get("/:id", getPost);

// Protected
router.post(
  "/",
  protect,
  upload.single("thumbnail"),
  validate(createPostSchema),
  createPost,
);
router.put(
  "/:id",
  protect,
  upload.single("thumbnail"),
  validate(updatePostSchema),
  updatePost,
);
router.delete("/:id", protect, deletePost);

export default router;

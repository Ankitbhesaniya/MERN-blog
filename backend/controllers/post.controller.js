import * as postService from "../services/post.service.js";
import { sendSuccess, sendError } from "../utils/response.js";
import { HTTP_STATUS } from "../constants/index.js";

export const getPosts = async (req, res, next) => {
  try {
    const result = await postService.fetchPosts(req.query);
    return sendSuccess(res, HTTP_STATUS.OK, "Posts fetched.", result);
  } catch (err) {
    next(err);
  }
};

export const getPost = async (req, res, next) => {
  try {
    const post = await postService.fetchPostById(req.params.id);
    return sendSuccess(res, HTTP_STATUS.OK, "Post fetched.", post);
  } catch (err) {
    next(err);
  }
};

export const createPost = async (req, res, next) => {
  try {
    const thumbnail = req.file ? `/uploads/${req.file.filename}` : null;
    const post = await postService.createPost({
      ...req.body,
      authorId: req.user._id,
      thumbnail,
    });
    return sendSuccess(res, HTTP_STATUS.CREATED, "Post created.", post);
  } catch (err) {
    next(err);
  }
};

export const updatePost = async (req, res, next) => {
  try {
    const thumbnail = req.file ? `/uploads/${req.file.filename}` : null;
    const post = await postService.updatePost({
      postId: req.params.id,
      userId: req.user._id,
      updates: req.body,
      thumbnail,
    });
    return sendSuccess(res, HTTP_STATUS.OK, "Post updated.", post);
  } catch (err) {
    next(err);
  }
};

export const deletePost = async (req, res, next) => {
  try {
    await postService.deletePost({ postId: req.params.id, userId: req.user._id });
    return sendSuccess(res, HTTP_STATUS.OK, "Post deleted.");
  } catch (err) {
    next(err);
  }
};

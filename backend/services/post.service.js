import mongoose from "mongoose";
import Post from "../models/Post.model.js";
import User from "../models/User.model.js";
import { getPagination, buildPaginationMeta } from "../utils/pagination.js";


export const fetchPosts = async (query) => {
  const { page, limit, skip } = getPagination(query);
  const { author } = query;

  
  const matchStage = {};

  if (author) {
    
    const users = await User.find(
      { name: { $regex: author, $options: "i" } },
      { _id: 1 }
    );
    const userIds = users.map((u) => u._id);
    matchStage.author = { $in: userIds };
  }

  const pipeline = [
    { $match: matchStage },

    
    {
      $lookup: {
        from: "users",
        localField: "author",
        foreignField: "_id",
        as: "author",
        pipeline: [{ $project: { name: 1, email: 1 } }],
      },
    },
    { $unwind: "$author" },

    
    {
      $project: {
        title: 1,
        content: 1,
        thumbnail: 1,
        createdAt: 1,
        updatedAt: 1,
        author: 1,
        
        excerpt: { $substr: ["$content", 0, 150] },
      },
    },

    { $sort: { createdAt: -1 } },

    
    {
      $facet: {
        metadata: [{ $count: "total" }],
        posts: [{ $skip: skip }, { $limit: limit }],
      },
    },
  ];

  const [result] = await Post.aggregate(pipeline);

  const total = result.metadata[0]?.total || 0;
  const posts = result.posts;

  return { posts, pagination: buildPaginationMeta(total, page, limit) };
};


export const fetchPostById = async (postId) => {
  if (!mongoose.Types.ObjectId.isValid(postId)) {
    const err = new Error("Invalid post ID.");
    err.statusCode = 400;
    throw err;
  }

  const pipeline = [
    { $match: { _id: new mongoose.Types.ObjectId(postId) } },
    {
      $lookup: {
        from: "users",
        localField: "author",
        foreignField: "_id",
        as: "author",
        pipeline: [{ $project: { name: 1, email: 1 } }],
      },
    },
    { $unwind: "$author" },
  ];

  const [post] = await Post.aggregate(pipeline);

  if (!post) {
    const err = new Error("Post not found.");
    err.statusCode = 404;
    throw err;
  }

  return post;
};


export const createPost = async ({ title, content, authorId, thumbnail }) => {
  const post = await Post.create({
    title,
    content,
    author: authorId,
    thumbnail: thumbnail || null,
  });

  return fetchPostById(post._id.toString());
};


export const updatePost = async ({ postId, userId, updates, thumbnail }) => {
  if (!mongoose.Types.ObjectId.isValid(postId)) {
    const err = new Error("Invalid post ID.");
    err.statusCode = 400;
    throw err;
  }

  const post = await Post.findById(postId);
  if (!post) {
    const err = new Error("Post not found.");
    err.statusCode = 404;
    throw err;
  }

  if (post.author.toString() !== userId.toString()) {
    const err = new Error("You are not authorized to edit this post.");
    err.statusCode = 403;
    throw err;
  }

  if (updates.title) post.title = updates.title;
  if (updates.content) post.content = updates.content;
  if (thumbnail) post.thumbnail = thumbnail;

  await post.save();

  return fetchPostById(postId);
};


export const deletePost = async ({ postId, userId }) => {
  if (!mongoose.Types.ObjectId.isValid(postId)) {
    const err = new Error("Invalid post ID.");
    err.statusCode = 400;
    throw err;
  }

  const post = await Post.findById(postId);
  if (!post) {
    const err = new Error("Post not found.");
    err.statusCode = 404;
    throw err;
  }

  if (post.author.toString() !== userId.toString()) {
    const err = new Error("You are not authorized to delete this post.");
    err.statusCode = 403;
    throw err;
  }

  await post.deleteOne();
};

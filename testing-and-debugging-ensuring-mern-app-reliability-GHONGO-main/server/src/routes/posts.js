const express = require('express');
const mongoose = require('mongoose');
const Post = require('../models/Post');
const { authMiddleware } = require('../utils/auth');

const router = express.Router();

// Create Post
router.post('/', authMiddleware, async (req, res, next) => {
  try {
    const { title, content, category } = req.body;
    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }
    const slug = (title || '').toString().trim().toLowerCase().replace(/\s+/g, '-');
    const created = await Post.create({
      title,
      content,
      author: req.user.id,
      category: category ? new mongoose.Types.ObjectId(category) : undefined,
      slug,
    });
    return res.status(201).json(created.toObject());
  } catch (err) {
    return next(err);
  }
});

// List Posts with optional category filter and pagination
router.get('/', async (req, res, next) => {
  try {
    const { category, page = 1, limit = 20 } = req.query;
    const query = {};
    if (category) query.category = category;
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 20;
    const posts = await Post.find(query)
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .lean();
    return res.json(posts);
  } catch (err) {
    return next(err);
  }
});

// Get by ID
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id).lean();
    if (!post) return res.status(404).json({ error: 'Post not found' });
    return res.json(post);
  } catch (err) {
    return next(err);
  }
});

// Update
router.put('/:id', authMiddleware, async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const existing = await Post.findById(id);
    if (!existing) return res.status(404).json({ error: 'Post not found' });
    if (existing.author.toString() !== req.user.id) return res.status(403).json({ error: 'Forbidden' });
    if (updates.title) {
      updates.slug = updates.title.toString().trim().toLowerCase().replace(/\s+/g, '-');
    }
    const updated = await Post.findByIdAndUpdate(id, updates, { new: true, runValidators: true }).lean();
    return res.json(updated);
  } catch (err) {
    return next(err);
  }
});

// Delete
router.delete('/:id', authMiddleware, async (req, res, next) => {
  try {
    const { id } = req.params;
    const existing = await Post.findById(id);
    if (!existing) return res.status(404).json({ error: 'Post not found' });
    if (existing.author.toString() !== req.user.id) return res.status(403).json({ error: 'Forbidden' });
    await Post.findByIdAndDelete(id);
    return res.json({ success: true });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;


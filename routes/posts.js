const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../middleware/auth');
const Post = require('../models/Post');

// Create post page
router.get('/create', ensureAuthenticated, (req, res) => {
  res.render('create');
});

// Create post process
router.post('/create', ensureAuthenticated, async (req, res) => {
  try {
    const { title, body } = req.body;
    const newPost = new Post({
      title,
      body,
      user: req.user.id,
    });
    await newPost.save();
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    res.render('error/500');
  }
});

module.exports = router;

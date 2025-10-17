const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');

const router = express.Router();

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
  const token = jwt.sign({ id: req.user._id, role: req.user.role }, process.env.JWT_SECRET);
  res.cookie('jwt', token, { httpOnly: true, secure: false });
  res.redirect('/api-docs');
});

router.get('/token', (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  const token = jwt.sign({ id: req.user._id, role: req.user.role }, process.env.JWT_SECRET);
  res.json({ token });
});

module.exports = router;

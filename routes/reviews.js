const express = require('express');
const Joi = require('joi');
const Review = require('../models/Review');
const { authenticateJWT } = require('../middleware/authMiddleware');

const router = express.Router();

const reviewSchema = Joi.object({
  game: Joi.string().required(),
  user: Joi.string().required(),
  rating: Joi.number().min(1).max(5).required(),
  title: Joi.string().required(),
  body: Joi.string()
});

/**
 * @swagger
 * /api/reviews:
 *   get:
 *     summary: Get all reviews
 *     responses:
 *       200:
 *         description: List of reviews
 */
router.get('/', async (req, res) => {
  const reviews = await Review.find().populate('game').populate('user');
  res.json(reviews);
});

/**
 * @swagger
 * /api/reviews/{id}:
 *   get:
 *     summary: Get review by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Review object
 *       404:
 *         description: Review not found
 */
router.get('/:id', async (req, res) => {
  const review = await Review.findById(req.params.id).populate('game').populate('user');
  if (!review) return res.status(404).json({ error: 'Review not found' });
  res.json(review);
});

/**
 * @swagger
 * /api/reviews:
 *   post:
 *     summary: Create a new review
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Review'
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       201:
 *         description: Review created
 *       400:
 *         description: Validation error
 */
router.post('/', authenticateJWT, async (req, res) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });
  const review = new Review(req.body);
  await review.save();
  res.status(201).json(review);
});

/**
 * @swagger
 * /api/reviews/{id}:
 *   put:
 *     summary: Update review by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Review'
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Review updated
 *       404:
 *         description: Review not found
 *       400:
 *         description: Validation error
 */
router.put('/:id', authenticateJWT, async (req, res) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });
  const review = await Review.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!review) return res.status(404).json({ error: 'Review not found' });
  res.json(review);
});

/**
 * @swagger
 * /api/reviews/{id}:
 *   delete:
 *     summary: Delete review by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       204:
 *         description: Review deleted
 *       404:
 *         description: Review not found
 */
router.delete('/:id', authenticateJWT, async (req, res) => {
  const review = await Review.findByIdAndDelete(req.params.id);
  if (!review) return res.status(404).json({ error: 'Review not found' });
  res.status(204).send();
});

module.exports = router;

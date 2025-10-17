const express = require('express');
const Joi = require('joi');
const Game = require('../models/Game');
const { authenticateJWT } = require('../middleware/authMiddleware');

const router = express.Router();

const gameSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string(),
  developer: Joi.string(),
  genres: Joi.array().items(Joi.string()),
  platforms: Joi.array().items(Joi.string()),
  releaseDates: Joi.array().items(Joi.object({
    region: Joi.string(),
    date: Joi.date()
  })),
  media: Joi.object({
    cover: Joi.string(),
    screenshots: Joi.array().items(Joi.string()),
    trailerUrl: Joi.string()
  }),
  price: Joi.number(),
  stock: Joi.number()
});

/**
 * @swagger
 * /api/games:
 *   get:
 *     summary: Get all games
 *     responses:
 *       200:
 *         description: List of games
 */
router.get('/', async (req, res) => {
  const games = await Game.find().populate('developer');
  res.json(games);
});

/**
 * @swagger
 * /api/games/{id}:
 *   get:
 *     summary: Get game by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Game object
 *       404:
 *         description: Game not found
 */
router.get('/:id', async (req, res) => {
  const game = await Game.findById(req.params.id).populate('developer');
  if (!game) return res.status(404).json({ error: 'Game not found' });
  res.json(game);
});

/**
 * @swagger
 * /api/games:
 *   post:
 *     summary: Create a new game
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Game'
 *     responses:
 *       201:
 *         description: Game created
 *       400:
 *         description: Validation error
 */
router.post('/', authenticateJWT, async (req, res) => {
  const { error } = gameSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });
  const game = new Game(req.body);
  await game.save();
  res.status(201).json(game);
});

/**
 * @swagger
 * /api/games/{id}:
 *   put:
 *     summary: Update game by ID
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
 *             $ref: '#/components/schemas/Game'
 *     responses:
 *       200:
 *         description: Game updated
 *       404:
 *         description: Game not found
 *       400:
 *         description: Validation error
 */
router.put('/:id', authenticateJWT, async (req, res) => {
  const { error } = gameSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });
  const game = await Game.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!game) return res.status(404).json({ error: 'Game not found' });
  res.json(game);
});

/**
 * @swagger
 * /api/games/{id}:
 *   delete:
 *     summary: Delete game by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Game deleted
 *       404:
 *         description: Game not found
 */
router.delete('/:id', authenticateJWT, async (req, res) => {
  const game = await Game.findByIdAndDelete(req.params.id);
  if (!game) return res.status(404).json({ error: 'Game not found' });
  res.status(204).send();
});

module.exports = router;

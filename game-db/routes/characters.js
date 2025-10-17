const express = require('express');
const Joi = require('joi');
const Character = require('../models/Character');
const { authenticateJWT } = require('../middleware/authMiddleware');

const router = express.Router();

const characterSchema = Joi.object({
  name: Joi.string().required(),
  bio: Joi.string(),
  firstAppearance: Joi.string(),
  abilities: Joi.array().items(Joi.string()),
  images: Joi.array().items(Joi.string())
});

/**
 * @swagger
 * /api/characters:
 *   get:
 *     summary: Get all characters
 *     responses:
 *       200:
 *         description: List of characters
 */
router.get('/', async (req, res) => {
  const characters = await Character.find().populate('firstAppearance');
  res.json(characters);
});

/**
 * @swagger
 * /api/characters/{id}:
 *   get:
 *     summary: Get character by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Character object
 *       404:
 *         description: Character not found
 */
router.get('/:id', async (req, res) => {
  const character = await Character.findById(req.params.id).populate('firstAppearance');
  if (!character) return res.status(404).json({ error: 'Character not found' });
  res.json(character);
});

/**
 * @swagger
 * /api/characters:
 *   post:
 *     summary: Create a new character
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Character'
 *     responses:
 *       201:
 *         description: Character created
 *       400:
 *         description: Validation error
 */
router.post('/', authenticateJWT, async (req, res) => {
  const { error } = characterSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });
  const character = new Character(req.body);
  await character.save();
  res.status(201).json(character);
});

/**
 * @swagger
 * /api/characters/{id}:
 *   put:
 *     summary: Update character by ID
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
 *             $ref: '#/components/schemas/Character'
 *     responses:
 *       200:
 *         description: Character updated
 *       404:
 *         description: Character not found
 *       400:
 *         description: Validation error
 */
router.put('/:id', authenticateJWT, async (req, res) => {
  const { error } = characterSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });
  const character = await Character.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!character) return res.status(404).json({ error: 'Character not found' });
  res.json(character);
});

/**
 * @swagger
 * /api/characters/{id}:
 *   delete:
 *     summary: Delete character by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Character deleted
 *       404:
 *         description: Character not found
 */
router.delete('/:id', authenticateJWT, async (req, res) => {
  const character = await Character.findByIdAndDelete(req.params.id);
  if (!character) return res.status(404).json({ error: 'Character not found' });
  res.status(204).send();
});

module.exports = router;

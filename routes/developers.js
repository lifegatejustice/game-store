const express = require('express');
const Joi = require('joi');
const Developer = require('../models/Developer');
const { authenticateJWT } = require('../middleware/authMiddleware');

const router = express.Router();

const developerSchema = Joi.object({
  name: Joi.string().required(),
  foundedYear: Joi.number(),
  country: Joi.string(),
  website: Joi.string(),
  description: Joi.string()
});

/**
 * @swagger
 * /api/developers:
 *   get:
 *     summary: Get all developers
 *     responses:
 *       200:
 *         description: List of developers
 */
router.get('/', async (req, res) => {
  const developers = await Developer.find();
  res.json(developers);
});

/**
 * @swagger
 * /api/developers/{id}:
 *   get:
 *     summary: Get developer by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Developer object
 *       404:
 *         description: Developer not found
 */
router.get('/:id', async (req, res) => {
  const developer = await Developer.findById(req.params.id);
  if (!developer) return res.status(404).json({ error: 'Developer not found' });
  res.json(developer);
});

/**
 * @swagger
 * /api/developers:
 *   post:
 *     summary: Create a new developer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Developer'
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       201:
 *         description: Developer created
 *       400:
 *         description: Validation error
 */
router.post('/', authenticateJWT, async (req, res) => {
  const { error } = developerSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });
  const developer = new Developer(req.body);
  await developer.save();
  res.status(201).json(developer);
});

/**
 * @swagger
 * /api/developers/{id}:
 *   put:
 *     summary: Update developer by ID
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
 *             $ref: '#/components/schemas/Developer'
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Developer updated
 *       404:
 *         description: Developer not found
 *       400:
 *         description: Validation error
 */
router.put('/:id', authenticateJWT, async (req, res) => {
  const { error } = developerSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });
  const developer = await Developer.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!developer) return res.status(404).json({ error: 'Developer not found' });
  res.json(developer);
});

/**
 * @swagger
 * /api/developers/{id}:
 *   delete:
 *     summary: Delete developer by ID
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
 *         description: Developer deleted
 *       404:
 *         description: Developer not found
 */
router.delete('/:id', authenticateJWT, async (req, res) => {
  const developer = await Developer.findByIdAndDelete(req.params.id);
  if (!developer) return res.status(404).json({ error: 'Developer not found' });
  res.status(204).send();
});

module.exports = router;

const express = require('express');
const router = express.Router();
const Message = require('../modeles/messages');

// GET /api/messages - Récupérer tous les messages (limité à 250)
router.get('/', async (req, res) => {
  try {
    const messages = await Message.find().limit(250);
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/messages/:id - Récupérer un message par ID
router.get('/:id', async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) return res.status(404).json({ message: 'Message non trouvé' });
    res.json(message);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/messages/description/:texte - Récupérer les messages par description
router.get('/description/:texte', async (req, res) => {
  try {
    const messages = await Message.find({ description: new RegExp(req.params.texte, 'i') }).limit(250).sort({ date: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/messages/titre/:texte - Récupérer les messages par titre
router.get('/titre/:texte', async (req, res) => {
  try {
    const messages = await Message.find({ titre: new RegExp(req.params.texte, 'i') }).limit(250).sort({ date: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/messages/auteur/:texte - Récupérer les messages par auteur
router.get('/auteur/:texte', async (req, res) => {
  try {
    const messages = await Message.find({ auteur: new RegExp(req.params.texte, 'i') }).limit(250).sort({ date: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/messages/:id - Supprimer un message par ID
router.delete('/:id', async (req, res) => {
  try {
    const message = await Message.findByIdAndDelete(req.params.id);
    if (!message) return res.status(404).json({ message: 'Message non trouvé' });
    res.json({ message: 'Message supprimé' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/messages - Ajouter un message
router.post('/', async (req, res) => {
  const message = new Message(req.body);
  try {
    const newMessage = await message.save();
    res.status(201).json(newMessage);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT /api/messages/:id - Modifier un message
router.put('/:id', async (req, res) => {
  try {
    const updatedMessage = await Message.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedMessage) return res.status(404).json({ message: 'Message non trouvé' });
    res.json(updatedMessage);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;


const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose'); // Importer mongoose pour MongoDB
const app = express();
const PORT = 8000;
require('dotenv').config(); // Charger les variables d'environnement

// Use CORS middleware to allow cross-origin requests
app.use(cors());

// Connexion à MongoDB Atlas
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connecté à MongoDB Atlas');
}).catch((err) => {
  console.error('Erreur de connexion à MongoDB Atlas', err);
});

// Modèle Mongoose pour les messages
const messageSchema = new mongoose.Schema({
    titre: String,
    auteur: String,
    date: String,
    description: String,
    commentaires: [
        {
            auteur: String,
            date: String,
            commentaire: String
        }
    ]
});

const Message = mongoose.model('Message', messageSchema);

// Route pour récupérer tous les messages depuis la base de données
app.get('/api/messages', async (req, res) => {
    try {
        const messages = await Message.find().limit(250); // Limiter à 250 messages
        res.json(messages);
    } catch (err) {
        res.status(500).json({ error: 'Erreur lors de la récupération des messages' });
    }
});

// Route pour récupérer les messages par titre (recherche partielle)
app.get('/api/messages/titre/:texte', async (req, res) => {
    try {
        const filteredMessages = await Message.find({
            titre: { $regex: req.params.texte, $options: 'i' } // Recherche insensible à la casse
        }).limit(250);
        res.json(filteredMessages);
    } catch (err) {
        res.status(500).json({ error: 'Erreur lors de la récupération des messages' });
    }
});

// Route pour récupérer les messages par auteur (recherche partielle)
app.get('/api/messages/auteur/:texte', async (req, res) => {
    try {
        const filteredMessages = await Message.find({
            auteur: { $regex: req.params.texte, $options: 'i' } // Recherche insensible à la casse
        }).limit(250);
        res.json(filteredMessages);
    } catch (err) {
        res.status(500).json({ error: 'Erreur lors de la récupération des messages' });
    }
});

// Gestion des erreurs 404 pour les routes non trouvées
app.use((req, res) => {
    res.status(404).json({ error: 'Route non trouvée' });
});

// Démarrer le serveur sur le port 8000
app.listen(PORT, () => {
    console.log(`Le serveur est en cours d'exécution sur http://localhost:${PORT}`);
});






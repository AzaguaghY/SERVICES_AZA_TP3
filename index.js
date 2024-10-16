const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose'); // Importer mongoose pour MongoDB
const app = express();
const PORT = 8000;
const path = require('path');
require('dotenv').config(); // Charger les variables d'environnement

// Middleware pour analyser les requêtes en JSON
app.use(express.json());
// Middleware pour servir les fichiers statiques
app.use(express.static(path.join(__dirname, 'public')));

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
    date: {
        type: Date,
        default: Date.now // Date par défaut à la création du message
    },
    description: String,
    commentaires: [
        {
            auteur: String,
            date: {
                type: Date,
                default: Date.now
            },
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
// Route pour récupérer un message par son ID
app.get('/api/messages/:id', async (req, res) => {
    try {
        const message = await Message.findById(req.params.id);
        if (!message) {
            return res.status(404).json({ error: 'Message non trouvé' });
        }
        res.json(message);
    } catch (err) {
        res.status(500).json({ error: 'Erreur lors de la récupération du message' });
    }
});

// Route pour ajouter un nouveau message (POST)
app.post('/api/messages', async (req, res) => {
    const { titre, auteur, description } = req.body;

    // Vérifier si les champs sont remplis
    if (!titre || !auteur || !description) {
        return res.status(400).json({ error: 'Titre, auteur et description sont requis' });
    }

    const newMessage = new Message({
        titre: titre,
        auteur: auteur,
        description: description,
        date: new Date()
    });

    try {
        // Enregistrer le message dans la base de données
        const savedMessage = await newMessage.save();
        res.status(201).json(savedMessage);
    } catch (err) {
        res.status(500).json({ error: 'Erreur lors de l\'ajout du message' });
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
// Route pour supprimer un message par son ID
app.delete('/api/messages/:id', async (req, res) => {
    try {
        const message = await Message.findByIdAndDelete(req.params.id);
        if (!message) {
            return res.status(404).json({ error: 'Message non trouvé' });
        }
        res.json({ message: 'Message supprimé avec succès' });
    } catch (err) {
        res.status(500).json({ error: 'Erreur lors de la suppression du message' });
    }
});

// Route pour la documentation de l'API
app.get('/api/aide', (req, res) => {
    res.sendFile(path.join(__dirname, 'aide.html'));
});
// Gestion des erreurs 404 pour les routes non trouvées
app.use((req, res) => {
    res.status(404).json({ error: 'Route non trouvée' });
});


// Démarrer le serveur sur le port 8000
app.listen(PORT, () => {
    console.log(`Le serveur est en cours d'exécution sur http://localhost:${PORT}`);
});






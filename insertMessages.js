const mongoose = require('mongoose');
const Message = require('./modeles/messages');  // Importer le modèle Mongoose pour les messages
require('dotenv').config();  // Charger les variables d'environnement à partir du fichier .env

// Connecter MongoDB via Mongoose
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connecté à MongoDB Atlas');
  insertMessages();  // Appeler la fonction pour insérer les données
}).catch((err) => {
  console.error('Erreur de connexion à MongoDB Atlas', err);
});

// Le tableau des discussions à insérer
const messages = [
    {
        titre: "Comment faire fructifier votre argent sans risques",
        auteur: "joseph@trucmachin.com",
        date: "2021-10-25T01:00:00",
        description: "Dans ce sujet nous allons discuter des possibilités de faire fructifier votre argent sans prendre de risques.",
        commentaires: [
            { 
                auteur: "jtecroispas@ici.com", 
                date: "2021-10-25T00:00:00", 
                commentaire: "Tu dis n'importe quoi" 
            }
        ]
    },
    {
        titre: "22222 Comment faire fructifier votre argent sans risques",
        auteur: "22joseph@trucmachin.com",
        date: "2021-10-25T01:00:00",
        description: "Suite à notre discussion sur les méthodes d'investissement.",
        commentaires: [
            { 
                auteur: "jtecroispas@ici.com", 
                date: "2021-10-25T02:00:00", 
                commentaire: "Autre chose" 
            }
        ]
    },
    {
        titre: "Voici un message d'intérêt général pour tester les longs titres...",
        auteur: "julie@jo.com",
        date: "2021-10-22T01:00:00",
        description: "Voici un message d'intérêt général pour tester les longs titres qui dépassent parfois les espaces prévus par les applications.",
        commentaires: [
            { 
                auteur: "bob@ici.com", 
                date: "2021-10-24T00:00:00", 
                commentaire: "Ok, voici une première réponse." 
            },
            { 
                auteur: "roger@ici.com", 
                date: "2021-10-24T08:00:00", 
                commentaire: "Ok, voici une deuxième réponse." 
            },
            { 
                auteur: "luc@ici.com", 
                date: "2021-10-25T02:00:00", 
                commentaire: "Autre chose." 
            },
            { 
                auteur: "paul@truc.com", 
                date: "2021-10-26T13:00:00", 
                commentaire: "Ok, voici encore une réponse." 
            },
            { 
                auteur: "lebel@machin.com", 
                date: "2021-10-26T15:00:00", 
                commentaire: "Ok, voici une cinquième réponse." 
            }
        ]
    }
];

// Fonction pour insérer les messages dans MongoDB
async function insertMessages() {
  try {
    await Message.insertMany(messages);  // Insérer plusieurs messages
    console.log('Discussions ajoutées avec succès dans MongoDB');
    mongoose.connection.close();  // Fermer la connexion à MongoDB
  } catch (error) {
    console.error('Erreur lors de l\'insertion des discussions', error);
  }
}

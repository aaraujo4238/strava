import express from 'express';
import path from 'path';
import { fetchActivities, createRanking } from './api';
import { AthleteRanking } from './types';

const app = express();
const PORT = process.env.PORT || 3000;

// Définir le chemin de base pour l'application
// En production, ce sera /apps/strava/public
const BASE_PATH = process.env.NODE_ENV === 'production' 
  ? '/apps/strava/public' 
  : '';

// Middleware pour servir les fichiers statiques
app.use(`${BASE_PATH}`, express.static(path.join(__dirname, '../public')));

// Route principale qui renvoie la page HTML
app.get(`${BASE_PATH}/`, (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// API endpoint pour récupérer le classement
app.get(`${BASE_PATH}/api/ranking`, async (req, res) => {
  try {
    // Récupérer le paramètre de tri depuis la requête (par défaut: 'distance')
    const sortBy = req.query.sortBy === 'elevation' ? 'elevation' : 'distance';
    
    const activities = await fetchActivities();
    const ranking = createRanking(activities, sortBy as 'distance' | 'elevation');
    res.json(ranking);
  } catch (error) {
    console.error('Erreur lors de la création du classement:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des données' });
  }
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}${BASE_PATH}`);
});

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const api_1 = require("./api");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Définir le chemin de base pour l'application
// En production, ce sera /apps/strava/public
const BASE_PATH = process.env.NODE_ENV === 'production'
    ? '/apps/strava/public'
    : '';
// Middleware pour servir les fichiers statiques
app.use(`${BASE_PATH}`, express_1.default.static(path_1.default.join(__dirname, '../public')));
// Route principale qui renvoie la page HTML
app.get(`${BASE_PATH}/`, (req, res) => {
    res.sendFile(path_1.default.join(__dirname, '../public/index.html'));
});
// API endpoint pour récupérer le classement
app.get(`${BASE_PATH}/api/ranking`, async (req, res) => {
    try {
        // Récupérer le paramètre de tri depuis la requête (par défaut: 'distance')
        const sortBy = req.query.sortBy === 'elevation' ? 'elevation' : 'distance';
        const activities = await (0, api_1.fetchActivities)();
        const ranking = (0, api_1.createRanking)(activities, sortBy);
        res.json(ranking);
    }
    catch (error) {
        console.error('Erreur lors de la création du classement:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération des données' });
    }
});
// Démarrer le serveur
app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}${BASE_PATH}`);
});

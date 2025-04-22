#!/bin/bash

# Script de déploiement pour l'application Axome Strava Challenge

# Définir le répertoire de production
PROD_DIR="/chemin/vers/votre/serveur/web/apps/strava"

# Compiler l'application
echo "Compilation de l'application..."
npm run build

# Créer les répertoires nécessaires
echo "Création des répertoires de production..."
mkdir -p $PROD_DIR

# Copier les fichiers
echo "Copie des fichiers vers le répertoire de production..."
cp -r dist $PROD_DIR/
cp -r public $PROD_DIR/
cp package.json $PROD_DIR/

# Installer les dépendances en mode production
echo "Installation des dépendances en mode production..."
cd $PROD_DIR
npm install --production

# Définir l'environnement de production
echo "Configuration de l'environnement de production..."
export NODE_ENV=production

echo "Déploiement terminé avec succès!"
echo "L'application est accessible à l'adresse: https://axome.app/apps/strava/public/"

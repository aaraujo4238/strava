import axios from 'axios';
import { Activity, AthleteRanking } from './types';

// ID du fichier Google Drive
const FILE_ID = '1fK3GBA-2Ii39RaVYRnmw4zVK89PQtaOt';
// URL de téléchargement direct pour Google Drive
const DRIVE_DOWNLOAD_URL = `https://drive.google.com/uc?export=download&id=${FILE_ID}`;

/**
 * Récupère les données d'activités depuis le fichier Google Drive
 */
export async function fetchActivities(): Promise<Activity[]> {
  try {
    // Récupérer les données du fichier Google Drive
    const response = await axios.get(DRIVE_DOWNLOAD_URL);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des données depuis Google Drive:', error);
    throw error;
  }
}

/**
 * Crée un classement des athlètes par distance totale parcourue ou dénivelé total
 * @param activities Liste des activités
 * @param sortBy Critère de tri ('distance' ou 'elevation')
 */
export function createRanking(activities: Activity[], sortBy: 'distance' | 'elevation' = 'distance'): AthleteRanking[] {
  // Filtrer pour ne garder que les activités de type "Run"
  const runActivities = activities.filter(activity => activity.type === "Run");
  
  // Créer un Map pour stocker les données par athlète
  // Utiliser une combinaison de firstname et lastname comme clé unique
  const athletesMap = new Map<string, AthleteRanking>();
  
  // Parcourir toutes les activités de course à pied
  runActivities.forEach(activity => {
    const athlete = activity.athlete;
    // Créer une clé unique pour chaque athlète basée sur son nom complet
    const athleteKey = `${athlete.firstname}_${athlete.lastname}`;
    
    // Convertir la distance de mètres en kilomètres et arrondir à 2 décimales
    const distanceInKm = parseFloat((activity.distance / 1000).toFixed(2));
    
    // Récupérer le dénivelé en mètres
    const elevationGain = activity.total_elevation_gain;
    
    if (athletesMap.has(athleteKey)) {
      // Mettre à jour les données de l'athlète existant
      const athleteData = athletesMap.get(athleteKey)!;
      athleteData.totalDistance += distanceInKm;
      athleteData.totalElevation += elevationGain;
      athleteData.activities += 1;
    } else {
      // Créer une nouvelle entrée pour l'athlète
      athletesMap.set(athleteKey, {
        athlete: athlete,
        totalDistance: distanceInKm,
        totalElevation: elevationGain,
        activities: 1
      });
    }
  });
  
  // Convertir le Map en tableau et trier selon le critère choisi
  let ranking = Array.from(athletesMap.values());
  
  if (sortBy === 'distance') {
    // Trier par distance totale (décroissant)
    ranking = ranking.sort((a, b) => b.totalDistance - a.totalDistance);
  } else {
    // Trier par dénivelé total (décroissant)
    ranking = ranking.sort((a, b) => b.totalElevation - a.totalElevation);
  }
  
  return ranking;
}

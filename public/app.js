document.addEventListener('DOMContentLoaded', () => {
  const loadingElement = document.getElementById('loading');
  const errorElement = document.getElementById('error');
  const rankingCard = document.getElementById('ranking-card');
  const rankingTable = document.getElementById('ranking-table');
  const rankingBody = document.getElementById('ranking-body');
  const lastUpdatedElement = document.getElementById('last-updated');
  const sortByDistanceButton = document.getElementById('sort-by-distance');
  const sortByElevationButton = document.getElementById('sort-by-elevation');
  
  // État actuel du tri
  let currentSortBy = 'distance';

  // Fonction pour formater la date
  function formatDate(date) {
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return date.toLocaleDateString('fr-FR', options);
  }

  // Fonction pour récupérer les données de classement
  async function fetchRanking(sortBy = 'distance') {
    try {
      // Déterminer l'URL de l'API en fonction de l'environnement
      let apiUrl;
      
      // Vérifier si nous sommes sur Render ou en local
      if (window.location.hostname === 'strava-o803.onrender.com') {
        // Sur Render, utiliser le chemin absolu
        apiUrl = '/api/ranking?sortBy=' + sortBy;
      } else {
        // En local ou autre environnement, utiliser le chemin relatif
        const basePath = window.location.pathname.endsWith('/') 
          ? window.location.pathname 
          : window.location.pathname + '/';
        apiUrl = `${basePath}api/ranking?sortBy=${sortBy}`;
      }
      
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erreur lors de la récupération du classement:', error);
      throw error;
    }
  }

  // Fonction pour créer un badge de position
  function createPositionBadge(position) {
    const badge = document.createElement('div');
    badge.classList.add('position-badge');
    badge.textContent = position;
    return badge;
  }

  // Fonction pour afficher le classement dans le tableau
  function displayRanking(ranking) {
    // Vider le contenu actuel du tableau
    rankingBody.innerHTML = '';
    
    // Mettre à jour la date de dernière mise à jour
    lastUpdatedElement.textContent = `Mis à jour le ${formatDate(new Date())}`;
    
    // Ajouter chaque athlète au tableau
    ranking.forEach((item, index) => {
      const row = document.createElement('tr');
      
      // Créer la cellule de position
      const positionCell = document.createElement('td');
      positionCell.classList.add('position');
      
      // Ajouter des classes spéciales pour les 3 premiers
      if (index < 3) {
        positionCell.classList.add(`position-${index + 1}`);
        
        // Ajouter un badge pour les 3 premiers
        const badge = createPositionBadge(index + 1);
        positionCell.appendChild(badge);
      } else {
        positionCell.textContent = index + 1;
      }
      
      // Créer la cellule d'information de l'athlète
      const athleteCell = document.createElement('td');
      const athleteInfo = document.createElement('div');
      athleteInfo.classList.add('athlete-info');
      
      // Utiliser une image par défaut pour tous les athlètes
      const avatar = document.createElement('img');
      avatar.src = 'https://www.strava.com/images/default-avatar-50.png';
      avatar.alt = `${item.athlete.firstname} ${item.athlete.lastname}`;
      avatar.classList.add('athlete-avatar');
      
      // Ajouter le nom de l'athlète
      const athleteName = document.createElement('span');
      athleteName.textContent = `${item.athlete.firstname} ${item.athlete.lastname}`;
      athleteName.classList.add('athlete-name');
      
      athleteInfo.appendChild(avatar);
      athleteInfo.appendChild(athleteName);
      athleteCell.appendChild(athleteInfo);
      
      // Créer la cellule de distance avec icône
      const distanceCell = document.createElement('td');
      const distanceInfo = document.createElement('div');
      distanceInfo.classList.add('stats');
      
      const distanceIcon = document.createElement('i');
      distanceIcon.classList.add('fas', 'fa-route');
      
      const distanceText = document.createElement('span');
      distanceText.textContent = `${item.totalDistance.toFixed(2)} km`;
      
      distanceInfo.appendChild(distanceIcon);
      distanceInfo.appendChild(distanceText);
      distanceCell.appendChild(distanceInfo);
      
      // Créer la cellule de dénivelé avec icône
      const elevationCell = document.createElement('td');
      const elevationInfo = document.createElement('div');
      elevationInfo.classList.add('stats');
      
      const elevationIcon = document.createElement('i');
      elevationIcon.classList.add('fas', 'fa-mountain');
      
      const elevationText = document.createElement('span');
      elevationText.textContent = `${item.totalElevation.toFixed(0)} m`;
      
      elevationInfo.appendChild(elevationIcon);
      elevationInfo.appendChild(elevationText);
      elevationCell.appendChild(elevationInfo);
      
      // Créer la cellule du nombre d'activités avec icône
      const activitiesCell = document.createElement('td');
      const activitiesInfo = document.createElement('div');
      activitiesInfo.classList.add('stats');
      
      const activitiesIcon = document.createElement('i');
      activitiesIcon.classList.add('fas', 'fa-running');
      
      const activitiesText = document.createElement('span');
      activitiesText.textContent = item.activities;
      
      activitiesInfo.appendChild(activitiesIcon);
      activitiesInfo.appendChild(activitiesText);
      activitiesCell.appendChild(activitiesInfo);
      
      // Ajouter toutes les cellules à la ligne
      row.appendChild(positionCell);
      row.appendChild(athleteCell);
      row.appendChild(distanceCell);
      row.appendChild(elevationCell);
      row.appendChild(activitiesCell);
      
      // Ajouter la ligne au tableau
      rankingBody.appendChild(row);
    });
  }

  // Fonction principale pour charger et afficher les données
  async function loadRanking(sortBy = 'distance') {
    try {
      // Afficher l'indicateur de chargement
      loadingElement.classList.remove('hidden');
      errorElement.classList.add('hidden');
      rankingCard.classList.add('hidden');
      
      // Récupérer les données
      const ranking = await fetchRanking(sortBy);
      
      // Masquer l'indicateur de chargement
      loadingElement.classList.add('hidden');
      
      // Afficher le tableau si des données sont disponibles
      if (ranking && ranking.length > 0) {
        displayRanking(ranking);
        rankingCard.classList.remove('hidden');
      } else {
        throw new Error('Aucune donnée disponible');
      }
    } catch (error) {
      // Afficher l'erreur
      loadingElement.classList.add('hidden');
      errorElement.classList.remove('hidden');
      console.error('Erreur:', error);
    }
  }

  // Ajouter des effets visuels lors du changement de tri
  function animateSort(button) {
    button.classList.add('animate-click');
    setTimeout(() => {
      button.classList.remove('animate-click');
    }, 300);
  }

  // Gestionnaire d'événement pour le bouton de tri par distance
  sortByDistanceButton.addEventListener('click', () => {
    if (currentSortBy !== 'distance') {
      currentSortBy = 'distance';
      sortByDistanceButton.classList.add('active');
      sortByElevationButton.classList.remove('active');
      animateSort(sortByDistanceButton);
      loadRanking('distance');
    }
  });

  // Gestionnaire d'événement pour le bouton de tri par dénivelé
  sortByElevationButton.addEventListener('click', () => {
    if (currentSortBy !== 'elevation') {
      currentSortBy = 'elevation';
      sortByElevationButton.classList.add('active');
      sortByDistanceButton.classList.remove('active');
      animateSort(sortByElevationButton);
      loadRanking('elevation');
    }
  });

  // Charger les données au chargement de la page
  loadRanking();
});

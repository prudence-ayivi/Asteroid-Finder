// lib/api.js
const NASA_API_KEY = process.env.NASA_API_KEY;
const SBDB_BASE_URL = 'https://ssd-api.jpl.nasa.gov/sbdb.api';
const NEOWS_BASE_URL = 'https://api.nasa.gov/neo/rest/v1';
const MPC_BASE_URL = 'https://minorplanetcenter.net/web_service';

// Fonction pour formater la date au format YYYY-MM-DD
const formatDate = (date) => {
  const d = new Date(date);
  return d.toISOString().split('T')[0];
};

// Fonction pour vérifier si une date est valide
const isValidDate = (date) => {
  return !isNaN(new Date(date).getTime());
};

// Fonction pour obtenir des dates 5 jours avant et après
const getDateRange = (date) => {
  const d = new Date(date);
  
  // 5 jours avant
  const startDate = new Date(d);
  startDate.setDate(d.getDate() - 5);
  
  // 5 jours après
  const endDate = new Date(d);
  endDate.setDate(d.getDate() + 5);
  
  return {
    start: formatDate(startDate),
    original: formatDate(d),
    end: formatDate(endDate)
  };
};

// Fonction pour chercher des astéroïdes par date avec MPC
export const fetchAsteroidsByDateMPC = async (date) => {
  try {
    // Vérifier si la date est valide
    if (!isValidDate(date)) {
      throw new Error('Date invalide');
    }
    
    const formattedDate = formatDate(date);
    
    // Endpoint spécifique pour MPC - à adapter selon leur documentation
    const response = await fetch(`${MPC_BASE_URL}/search?discovered=${formattedDate}`);
    
    if (!response.ok) {
      throw new Error('Erreur lors de la requête MPC');
    }
    
    const data = await response.json();
    
    // Si aucun résultat, chercher dans une plage étendue
    if (data.length === 0) {
      const { start, end } = getDateRange(date);
      
      // Nouvelle requête avec plage étendue
      const extendedResponse = await fetch(`${MPC_BASE_URL}/search?discovered_after=${start}&discovered_before=${end}`);
      
      if (!extendedResponse.ok) {
        throw new Error('Erreur lors de la requête MPC étendue');
      }
      
      const extendedData = await extendedResponse.json();
      
      return {
        asteroids: mapMPCToAsteroids(extendedData),
        exactMatch: false,
        message: `Aucun astéroïde découvert le ${formattedDate}. Voici ceux découverts entre ${start} et ${end}.`
      };
    }
    
    return {
      asteroids: mapMPCToAsteroids(data),
      exactMatch: true
    };
  } catch (error) {
    console.error('Erreur lors de la recherche MPC:', error);
    throw error;
  }
};

// Fonction pour chercher des astéroïdes par date avec NASA NeoWs
export const fetchAsteroidsByDateNeoWs = async (date) => {
  try {
    if (!isValidDate(date)) {
      throw new Error('Date invalide');
    }
    
    const formattedDate = formatDate(date);
    
    // NeoWs requiert une clé API
    const response = await fetch(`${NEOWS_BASE_URL}/feed?start_date=${formattedDate}&end_date=${formattedDate}&api_key=${NASA_API_KEY}`);
    
    if (!response.ok) {
      throw new Error('Erreur lors de la requête NeoWs');
    }
    
    const data = await response.json();
    
    // Si aucun résultat, chercher dans une plage étendue
    if (!data.near_earth_objects[formattedDate] || data.near_earth_objects[formattedDate].length === 0) {
      const { start, end } = getDateRange(date);
      
      const extendedResponse = await fetch(`${NEOWS_BASE_URL}/feed?start_date=${start}&end_date=${end}&api_key=${NASA_API_KEY}`);
      
      if (!extendedResponse.ok) {
        throw new Error('Erreur lors de la requête NeoWs étendue');
      }
      
      const extendedData = await extendedResponse.json();
      
      // Aplatir tous les astéroïdes de la plage de dates
      const allAsteroids = Object.values(extendedData.near_earth_objects).flat();
      
      return {
        asteroids: mapNeoWsToAsteroids(allAsteroids),
        exactMatch: false,
        message: `Aucun astéroïde découvert le ${formattedDate}. Voici ceux observés entre ${start} et ${end}.`
      };
    }
    
    return {
      asteroids: mapNeoWsToAsteroids(data.near_earth_objects[formattedDate]),
      exactMatch: true
    };
  } catch (error) {
    console.error('Erreur lors de la recherche NeoWs:', error);
    throw error;
  }
};

// Fonction pour chercher des astéroïdes par date en combinant les sources
export const fetchAsteroidsByDate = async (date) => {
  try {
    // Essayer d'abord MPC qui contient plus d'informations de découverte
    const mpcResult = await fetchAsteroidsByDateMPC(date);
    
    if (mpcResult.asteroids.length > 0) {
      return mpcResult;
    }
    
    // Si MPC ne donne rien, essayer NeoWs
    const neowsResult = await fetchAsteroidsByDateNeoWs(date);
    return neowsResult;
  } catch (error) {
    console.error('Erreur lors de la recherche d\'astéroïdes:', error);
    throw error;
  }
};

// Fonction pour chercher un astéroïde par ID (SBDB)
export const fetchAsteroidById = async (id) => {
  try {
    const response = await fetch(`${SBDB_BASE_URL}?sstr=${id}&discovery=true`);
    
    if (!response.ok) {
      throw new Error('Erreur lors de la requête SBDB');
    }
    
    const data = await response.json();
    return mapSBDBToAsteroid(data);
  } catch (error) {
    console.error('Erreur lors de la recherche par ID:', error);
    throw error;
  }
};

// Fonction pour chercher un astéroïde par nom (SBDB)
export const fetchAsteroidByName = async (name) => {
  try {
    const response = await fetch(`${SBDB_BASE_URL}?sstr=${encodeURIComponent(name)}&discovery=true`);
    
    if (!response.ok) {
      throw new Error('Erreur lors de la requête SBDB');
    }
    
    const data = await response.json();
    return mapSBDBToAsteroid(data);
  } catch (error) {
    console.error('Erreur lors de la recherche par nom:', error);
    throw error;
  }
};

// Fonctions de mapping des données selon leur source
function mapMPCToAsteroids(data) {
  // À adapter selon le format réel de réponse du MPC
  return data.map(item => ({
    id: item.number || item.designation,
    name: item.name || item.designation,
    fullName: item.full_name,
    discoveryDate: item.discovery_date,
    // Autres propriétés à mapper...
  }));
}

function mapNeoWsToAsteroids(data) {
  return data.map(item => ({
    id: item.neo_reference_id,
    name: item.name,
    diameter: item.estimated_diameter.kilometers.estimated_diameter_max,
    isNEO: item.is_potentially_hazardous_asteroid,
    isPHO: item.is_potentially_hazardous_asteroid,
    orbitData: {
      perihelionDistance: item.close_approach_data[0]?.orbiting_body || 'Earth',
      // Autres propriétés orbitales si disponibles
    }
    // Autres propriétés à mapper...
  }));
}

function mapSBDBToAsteroid(data) {
  if (!data || !data.object) {
    return null;
  }
  
  const object = data.object;
  
  return {
    id: object.spkid || object.des,
    name: object.name || object.des,
    fullName: object.fullname,
    discoveryDate: data.discovery?.discovery_date,
    diameter: data.phys_par?.diameter,
    magnitude: data.phys_par?.h,
    semiMajorAxis: data.orbit?.a,
    eccentricity: data.orbit?.e,
    inclination: data.orbit?.i,
    ascendingNode: data.orbit?.om,
    argPeriapsis: data.orbit?.w,
    meanAnomaly: data.orbit?.ma,
    orbitPeriod: data.orbit?.period,
    category: object.kind,
    type: object.orbit_class?.name,
    isNEO: object.neo === 'Y',
    isPHO: object.pha === 'Y',
    // Autres propriétés à mapper...
  };
}
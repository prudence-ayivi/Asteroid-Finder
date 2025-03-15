/**
 * Client pour appeler les API REST internes
 */
export const apiClient = {
    /**
     * Recherche des astéroïdes par date
     * @param {string} date - Date au format YYYY-MM-DD
     * @returns {Promise<Object>} Résultat de la recherche
     */
    getAsteroidsByDate: async (date) => {
      try {
        const response = await fetch(`/api/asteroids/date?date=${encodeURIComponent(date)}`);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Erreur lors de la recherche par date');
        }
        
        return await response.json();
      } catch (error) {
        console.error('Erreur client API (getAsteroidsByDate):', error);
        throw error;
      }
    },
    
    /**
     * Recherche d'un astéroïde par ID
     * @param {string} id - Identifiant de l'astéroïde
     * @returns {Promise<Object>} Données de l'astéroïde
     */
    getAsteroidById: async (id) => {
      try {
        const response = await fetch(`/api/asteroids/id?id=${encodeURIComponent(id)}`);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Erreur lors de la recherche par ID');
        }
        
        return await response.json();
      } catch (error) {
        console.error('Erreur client API (getAsteroidById):', error);
        throw error;
      }
    },
    
    /**
     * Recherche d'un astéroïde par nom
     * @param {string} name - Nom de l'astéroïde
     * @returns {Promise<Object>} Données de l'astéroïde
     */
    getAsteroidByName: async (name) => {
      try {
        const response = await fetch(`/api/asteroids/name?name=${encodeURIComponent(name)}`);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Erreur lors de la recherche par nom');
        }
        
        return await response.json();
      } catch (error) {
        console.error('Erreur client API (getAsteroidByName):', error);
        throw error;
      }
    }
  };
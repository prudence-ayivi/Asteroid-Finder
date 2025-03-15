// app/page.js
'use client';

import { useState } from 'react';
import SearchForm from '@/components/SearchForm';
import AsteroidDisplay from '@/components/AsteroidDisplay';
import AsteroidList from '@/components/AsteroidList';
import { apiClient } from '@/lib/api-client';

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchResults, setSearchResults] = useState(null);
  const [selectedAsteroid, setSelectedAsteroid] = useState(null);
  
  const handleSearch = async (searchParams) => {
    setLoading(true);
    setError(null);
    setSearchResults(null);
    setSelectedAsteroid(null);
    
    try {
      let result;
      
      if (searchParams.type === 'date') {
        result = await apiClient.getAsteroidsByDate(searchParams.value);
        setSearchResults(result);
        
        // S'il n'y a qu'un seul astéroïde, le sélectionner automatiquement
        if (result.asteroids && result.asteroids.length === 1) {
          setSelectedAsteroid(result.asteroids[0]);
        }
      } else if (searchParams.type === 'id') {
        // Essayer d'abord par ID
        try {
          result = await apiClient.getAsteroidById(searchParams.value);
          setSelectedAsteroid(result);
        } catch (idError) {
          // Si échec, essayer par nom
          try {
            result = await apiClient.getAsteroidByName(searchParams.value);
            setSelectedAsteroid(result);
          } catch (nameError) {
            throw new Error('Aucun astéroïde trouvé avec cet identifiant ou ce nom');
          }
        }
      }
    } catch (error) {
      console.error('Error during search:', error);
      setError(error.message || 'Une erreur est survenue lors de la recherche');
    } finally {
      setLoading(false);
    }
  };
  
  const handleSelectAsteroid = (asteroid) => {
    setSelectedAsteroid(asteroid);
  };
  
  return (
    <main className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Découverte d\'Astéroïdes
        </h1>
        
        <SearchForm onSearch={handleSearch} />
        
        {loading && (
          <div className="mt-8 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
            <p className="mt-2 text-gray-600">Recherche en cours...</p>
          </div>
        )}
        
        {error && (
          <div className="mt-8 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded">
            <p>{error}</p>
          </div>
        )}
        
        {searchResults && searchResults.asteroids && searchResults.asteroids.length > 1 && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">
              {searchResults.asteroids.length} astéroïdes trouvés
            </h2>
            <AsteroidList 
              asteroids={searchResults.asteroids} 
              onSelectAsteroid={handleSelectAsteroid} 
            />
            {searchResults.message && (
              <p className="mt-4 text-yellow-600 bg-yellow-50 p-3 rounded">
                {searchResults.message}
              </p>
            )}
          </div>
        )}
        
        {selectedAsteroid && (
          <div className="mt-8">
            <AsteroidDisplay 
              asteroid={selectedAsteroid} 
              exactMatch={searchResults?.exactMatch !== false}
            />
          </div>
        )}
      </div>
    </main>
  );
}
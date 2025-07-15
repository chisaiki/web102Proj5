import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { MarvelAPI } from './services/marvelApi'

function App() {
  const [characters, setCharacters] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  // Function to fetch Marvel characters
  const fetchCharacters = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const data = await MarvelAPI.getCharacters()
      setCharacters(data.results)
    } catch (err) {
      setError(err.message)
      console.error('Error fetching Marvel data:', err)
    } finally {
      setLoading(false)
    }
  }

  // Function to search for characters
  const searchCharacters = async (name = searchTerm) => {
    if (!name.trim()) return
    
    setLoading(true)
    setError(null)
    
    try {
      const data = await MarvelAPI.searchCharacters(name)
      setCharacters(data.results)
    } catch (err) {
      setError(err.message)
      console.error('Error searching characters:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    searchCharacters()
  }

  return (
    <div className="App">
      <h1>Marvel Character Explorer</h1>
      
      <div className="controls">
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for characters..."
            className="search-input"
          />
          <button type="submit" disabled={loading}>
            Search
          </button>
        </form>
        
        <button onClick={fetchCharacters} disabled={loading}>
          {loading ? 'Loading...' : 'Fetch Popular Characters'}
        </button>
        
        <button onClick={() => searchCharacters('Spider')} disabled={loading}>
          Spider Characters
        </button>
      </div>

      {error && <div className="error">Error: {error}</div>}

      <div className="characters-grid">
        {characters.map((character) => (
          <div key={character.id} className="character-card">
            <h3>{character.name}</h3>
            {character.thumbnail && character.thumbnail.path !== 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available' && (
              <img 
                src={`${character.thumbnail.path}.${character.thumbnail.extension}`}
                alt={character.name}
                style={{ width: '100px', height: '100px', objectFit: 'cover' }}
              />
            )}
            <p>{character.description || 'No description available'}</p>
            <div className="character-stats">
              <p>Comics: {character.comics.available}</p>
              <p>Series: {character.series.available}</p>
              <p>Stories: {character.stories.available}</p>
            </div>
          </div>
        ))}
      </div>

      {characters.length === 0 && !loading && !error && (
        <div className="no-results">
          <p>No characters found. Try searching for something!</p>
        </div>
      )}
    </div>
  )
}

export default App

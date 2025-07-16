import { useState, useEffect } from 'react'
import { MarvelAPI } from '../services/marvelApi'

function MarvelDashboard() {
  const [characters, setCharacters] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [statistics, setStatistics] = useState({})

  // Fetch data using useEffect and async/await
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true)
      setError(null)
      
      try {
        // Fetch multiple batches to get more diverse data
        const batch1 = await MarvelAPI.getCharacters({ limit: 20, offset: 0 })
        const batch2 = await MarvelAPI.getCharacters({ limit: 20, offset: 20 })
        const batch3 = await MarvelAPI.getCharacters({ limit: 20, offset: 40 })
        
        const allCharacters = [
          ...batch1.results,
          ...batch2.results,
          ...batch3.results
        ]
        
        // Filter to get at least 10 unique characters with descriptions
        const uniqueCharacters = allCharacters
          .filter((char, index, self) => 
            index === self.findIndex(c => c.id === char.id)
          )
          .slice(0, 15) // Get 15 characters to ensure we have enough data
        
        setCharacters(uniqueCharacters)
        calculateStatistics(uniqueCharacters)
      } catch (err) {
        setError(err.message)
        console.error('Error fetching dashboard data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  // Calculate summary statistics
  const calculateStatistics = (charactersData) => {
    if (!charactersData || charactersData.length === 0) return

    // 1. Total number of characters
    const totalCharacters = charactersData.length

    // 2. Comic appearances statistics
    const comicCounts = charactersData.map(char => char.comics.available)
    const totalComics = comicCounts.reduce((sum, count) => sum + count, 0)
    const avgComics = Math.round(totalComics / comicCounts.length)
    const maxComics = Math.max(...comicCounts)
    const minComics = Math.min(...comicCounts)

    // 3. Characters with descriptions vs without
    const charactersWithDesc = charactersData.filter(char => 
      char.description && char.description.trim().length > 0
    ).length
    const descriptionPercentage = Math.round((charactersWithDesc / totalCharacters) * 100)

    // 4. Series participation statistics
    const seriesCounts = charactersData.map(char => char.series.available)
    const avgSeries = Math.round(seriesCounts.reduce((sum, count) => sum + count, 0) / seriesCounts.length)
    const maxSeries = Math.max(...seriesCounts)

    // 5. Story participation statistics
    const storyCounts = charactersData.map(char => char.stories.available)
    const avgStories = Math.round(storyCounts.reduce((sum, count) => sum + count, 0) / storyCounts.length)

    // 6. Quartile analysis for comic appearances
    const sortedComics = [...comicCounts].sort((a, b) => a - b)
    const q1Index = Math.floor(sortedComics.length * 0.25)
    const q3Index = Math.floor(sortedComics.length * 0.75)
    const medianIndex = Math.floor(sortedComics.length * 0.5)
    
    const quartiles = {
      q1: sortedComics[q1Index],
      median: sortedComics[medianIndex],
      q3: sortedComics[q3Index]
    }

    setStatistics({
      totalCharacters,
      totalComics,
      avgComics,
      maxComics,
      minComics,
      charactersWithDesc,
      descriptionPercentage,
      avgSeries,
      maxSeries,
      avgStories,
      quartiles
    })
  }

  if (loading) {
    return (
      <div className="dashboard-loading">
        <h2>🔄 Loading Marvel Dashboard...</h2>
        <p>Fetching character data from the Marvel Universe...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="dashboard-error">
        <h2>❌ Dashboard Error</h2>
        <p>Error: {error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    )
  }

  return (
    <div className="marvel-dashboard">
      <h1>📊 Marvel Characters Dashboard</h1>
      
      {/* Summary Statistics Section */}
      <div className="statistics-grid">
        <div className="stat-card">
          <h3>📈 Total Characters</h3>
          <div className="stat-number">{statistics.totalCharacters}</div>
          <p>Unique characters in dataset</p>
        </div>
        
        <div className="stat-card">
          <h3>📚 Comic Statistics</h3>
          <div className="stat-number">{statistics.avgComics}</div>
          <p>Average comics per character</p>
          <small>Range: {statistics.minComics} - {statistics.maxComics}</small>
        </div>
        
        <div className="stat-card">
          <h3>📝 Description Coverage</h3>
          <div className="stat-number">{statistics.descriptionPercentage}%</div>
          <p>Characters with descriptions</p>
          <small>{statistics.charactersWithDesc} out of {statistics.totalCharacters}</small>
        </div>
        
        <div className="stat-card">
          <h3>📺 Series Participation</h3>
          <div className="stat-number">{statistics.avgSeries}</div>
          <p>Average series per character</p>
          <small>Max: {statistics.maxSeries} series</small>
        </div>
        
        <div className="stat-card">
          <h3>📖 Story Statistics</h3>
          <div className="stat-number">{statistics.avgStories}</div>
          <p>Average stories per character</p>
        </div>
        
        <div className="stat-card">
          <h3>📊 Comic Quartiles</h3>
          <div className="quartile-display">
            <div>Q1: {statistics.quartiles?.q1}</div>
            <div>Median: {statistics.quartiles?.median}</div>
            <div>Q3: {statistics.quartiles?.q3}</div>
          </div>
          <p>Comic appearance distribution</p>
        </div>
      </div>

      {/* Characters List */}
      <div className="characters-section">
        <h2>🦸‍♂️ Character Data ({characters.length} items)</h2>
        <div className="characters-list">
          {characters.map((character, index) => (
            <div key={character.id} className="character-row">
              <div className="character-index">#{index + 1}</div>
              
              <div className="character-image">
                {character.thumbnail && character.thumbnail.path !== 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available' ? (
                  <img 
                    src={`${character.thumbnail.path}.${character.thumbnail.extension}`}
                    alt={character.name}
                  />
                ) : (
                  <div className="no-image">No Image</div>
                )}
              </div>
              
              <div className="character-info">
                <h3>{character.name}</h3>
                <p className="character-description">
                  {character.description || 'No description available for this character.'}
                </p>
              </div>
              
              <div className="character-stats">
                <div className="stat-item">
                  <span className="stat-label">Comics:</span>
                  <span className="stat-value">{character.comics.available}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Series:</span>
                  <span className="stat-value">{character.series.available}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Stories:</span>
                  <span className="stat-value">{character.stories.available}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Events:</span>
                  <span className="stat-value">{character.events.available}</span>
                </div>
              </div>
              
              <div className="character-actions">
                <button 
                  className="btn-primary"
                  onClick={() => window.open(`https://marvel.com/characters/${character.name.toLowerCase().replace(/\s+/g, '-')}`, '_blank')}
                >
                  View Details
                </button>
                <div className="character-id">ID: {character.id}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default MarvelDashboard

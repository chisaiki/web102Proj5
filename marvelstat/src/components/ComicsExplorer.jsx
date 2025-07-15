import { useState } from 'react'
import { MarvelAPI } from '../services/marvelApi'

function ComicsExplorer() {
  const [comics, setComics] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchComics = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const data = await MarvelAPI.getComics({ limit: 12 })
      setComics(data.results)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const searchComics = async (title) => {
    setLoading(true)
    setError(null)
    
    try {
      const data = await MarvelAPI.searchComics(title)
      setComics(data.results)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="comics-explorer">
      <h2>Marvel Comics</h2>
      
      <div className="controls">
        <button onClick={fetchComics} disabled={loading}>
          {loading ? 'Loading...' : 'Fetch Comics'}
        </button>
        <button onClick={() => searchComics('Spider-Man')} disabled={loading}>
          Spider-Man Comics
        </button>
        <button onClick={() => searchComics('X-Men')} disabled={loading}>
          X-Men Comics
        </button>
      </div>

      {error && <div className="error">Error: {error}</div>}

      <div className="comics-grid">
        {comics.map((comic) => (
          <div key={comic.id} className="comic-card">
            <h3>{comic.title}</h3>
            {comic.thumbnail && comic.thumbnail.path !== 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available' && (
              <img 
                src={`${comic.thumbnail.path}.${comic.thumbnail.extension}`}
                alt={comic.title}
                style={{ width: '120px', height: '180px', objectFit: 'cover' }}
              />
            )}
            <p>{comic.description ? comic.description.substring(0, 100) + '...' : 'No description available'}</p>
            <div className="comic-info">
              <p>Issue: #{comic.issueNumber || 'N/A'}</p>
              <p>Pages: {comic.pageCount || 'Unknown'}</p>
              <p>Price: {comic.prices[0]?.price ? `$${comic.prices[0].price}` : 'N/A'}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ComicsExplorer

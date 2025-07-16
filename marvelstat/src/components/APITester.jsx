import { useState } from 'react'
import { MarvelAPITest } from '../services/marvelApiTest'

function APITester() {
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

  const testAPI = async () => {
    setLoading(true)
    setResult('')
    
    const apiKey = import.meta.env.VITE_API_KEY
    
    console.log('=== API Test Debug Info ===')
    console.log('API Key from env:', apiKey)
    console.log('API Key type:', typeof apiKey)
    console.log('API Key length:', apiKey ? apiKey.length : 'undefined')
    console.log('API Key has quotes:', apiKey && (apiKey.startsWith('"') || apiKey.endsWith('"')))
    console.log('Raw API Key:', JSON.stringify(apiKey))
    console.log('Current URL:', window.location.href)
    console.log('Current origin:', window.location.origin)
    
    // Clean the API key (remove any quotes)
    const cleanApiKey = apiKey ? apiKey.replace(/^"|"$/g, '') : ''
    console.log('Cleaned API Key:', cleanApiKey)
    console.log('Cleaned API Key length:', cleanApiKey.length)
    
    try {
      console.log('Testing with MarvelAPITest service...')
      const data = await MarvelAPITest.testConnection()
      setResult(`✅ SUCCESS: Found ${data.results.length} characters using test service`)
      console.log('API Response:', data)
    } catch (error) {
      console.error('MarvelAPITest failed:', error)
      
      // Fallback: try direct fetch
      try {
        console.log('Trying direct fetch as fallback...')
        const url = `https://gateway.marvel.com/v1/public/characters?apikey=${cleanApiKey}&limit=1`
        console.log('Direct fetch URL:', url)
        
        const response = await fetch(url)
        console.log('Direct fetch - Response status:', response.status)
        console.log('Direct fetch - Response statusText:', response.statusText)
        
        if (response.ok) {
          const data = await response.json()
          setResult(`✅ SUCCESS: Direct fetch worked! Found ${data.data.results.length} characters`)
          console.log('Direct fetch - API Response:', data)
        } else {
          const errorText = await response.text()
          console.error('Direct fetch - Full error response:', errorText)
          
          // Try to parse the error as JSON
          try {
            const errorJson = JSON.parse(errorText)
            setResult(`❌ ERROR ${response.status}: ${response.statusText}\nCode: ${errorJson.code}\nMessage: ${errorJson.message}\n\n🔧 TROUBLESHOOTING:\n- Wait 5-10 minutes after adding domains\n- Try hard refresh (Ctrl+F5)\n- Check Marvel account for typos in domain list`)
          } catch {
            setResult(`❌ ERROR ${response.status}: ${response.statusText}\n${errorText}\n\n🔧 TROUBLESHOOTING:\n- Wait 5-10 minutes after adding domains\n- Try hard refresh (Ctrl+F5)\n- Check Marvel account for typos in domain list`)
          }
        }
      } catch (directError) {
        setResult(`❌ NETWORK ERROR: ${directError.message}\n\n🔧 TROUBLESHOOTING:\n- Check internet connection\n- Try again in a few minutes\n- Marvel API might be temporarily down`)
        console.error('Direct fetch failed:', directError)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ 
      padding: '20px', 
      margin: '20px', 
      border: '2px solid #ccc', 
      borderRadius: '8px',
      backgroundColor: '#f9f9f9',
      color: 'black'
    }}>
      <h2 style={{ color: 'black' }}>🔧 API Troubleshooter</h2>
      <p style={{ color: 'black' }}>Current API Key: {import.meta.env.VITE_API_KEY ? '✅ Loaded' : '❌ Missing'}</p>
      <p style={{ color: 'black' }}>Key Length: {import.meta.env.VITE_API_KEY?.length || 0} characters</p>
      <button 
        onClick={testAPI} 
        disabled={loading}
        style={{
          padding: '10px 20px',
          background: loading ? '#ccc' : '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: loading ? 'not-allowed' : 'pointer'
        }}
      >
        {loading ? 'Testing...' : 'Test API Key'}
      </button>
      
      {result && (
        <pre style={{ 
          marginTop: '10px', 
          padding: '10px', 
          background: '#f0f0f0', 
          borderRadius: '4px',
          whiteSpace: 'pre-wrap',
          fontSize: '12px',
          color: 'black'
        }}>
          {result}
        </pre>
      )}
      
      <div style={{ marginTop: '15px', fontSize: '12px', color: 'black' }}>
        <strong style={{ color: 'black' }}>Troubleshooting Steps:</strong>
        <ol>
          <li>Check browser console for detailed logs</li>
          <li>Verify domain authorization at <a href="https://developer.marvel.com/account" target="_blank">developer.marvel.com/account</a></li>
          <li>Add "localhost" and "127.0.0.1" to authorized referers</li>
          <li>Restart dev server after .env changes</li>
        </ol>
      </div>
    </div>
  )
}

export default APITester

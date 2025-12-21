import { useState, useEffect } from 'react'
import './App.css'
import GameMaster from './components/GameMaster'
import DisplayView from './components/DisplayView'

function App() {
  const [view, setView] = useState('home')
  const [gameState, setGameState] = useState(() => {
    const saved = localStorage.getItem('gameState')
    return saved ? JSON.parse(saved) : {
      players: [],
      currentEvent: null,
      gameTitle: 'Epic Game Night',
      theme: 'default',
      colorScheme: {
        primaryColor: '#6C63FF',
        secondaryColor: '#FF6B6B',
        successColor: '#51CF66',
        warningColor: '#FFA94D',
        dangerColor: '#FF6B6B',
        bgDark: '#1A1A2E',
        bgMedium: '#16213E',
        bgLight: '#0F3460',
        textPrimary: '#FFFFFF',
        textSecondary: '#B8B8D1'
      },
      currentScene: {
        type: 'game', // 'game', 'shop', 'image', 'text', 'wheel'
        data: {}
      },
      shopItems: [],
      customScenes: [], // Saved custom scenes (image, text, and wheel)
      wheelSpinTrigger: null, // Timestamp to trigger wheel spins from GM
      mapMode: 'custom', // 'grid' or 'custom'
      mapGrid: {
        rows: 5,
        cols: 5,
        tiles: Array(25).fill().map((_, i) => ({
          id: i,
          type: 'normal',
          label: ''
        }))
      },
      customMap: {
        tiles: [], // Each tile has: { id, x, y, type, label, connections }
        backgroundImage: '' // URL or data URI for background image
      }
    }
  })

  // Apply color scheme to CSS variables
  useEffect(() => {
    if (gameState.colorScheme) {
      const root = document.documentElement
      root.style.setProperty('--primary-color', gameState.colorScheme.primaryColor)
      root.style.setProperty('--secondary-color', gameState.colorScheme.secondaryColor)
      root.style.setProperty('--success-color', gameState.colorScheme.successColor)
      root.style.setProperty('--warning-color', gameState.colorScheme.warningColor)
      root.style.setProperty('--danger-color', gameState.colorScheme.dangerColor)
      root.style.setProperty('--bg-dark', gameState.colorScheme.bgDark)
      root.style.setProperty('--bg-medium', gameState.colorScheme.bgMedium)
      root.style.setProperty('--bg-light', gameState.colorScheme.bgLight)
      root.style.setProperty('--text-primary', gameState.colorScheme.textPrimary)
      root.style.setProperty('--text-secondary', gameState.colorScheme.textSecondary)
    }
  }, [gameState.colorScheme])

  useEffect(() => {
    localStorage.setItem('gameState', JSON.stringify(gameState))
    window.dispatchEvent(new Event('storage'))
  }, [gameState])

  if (view === 'home') {
    return (
      <div className="home-screen">
        <h1>🎮 Game Master App</h1>
        <p className="subtitle">Interactive party game controller</p>
        <div className="view-selector">
          <button
            className="view-button master-button"
            onClick={() => setView('master')}
          >
            🎯 Game Master Control
          </button>
          <button
            className="view-button display-button"
            onClick={() => setView('display')}
          >
            📺 TV Display View
          </button>
        </div>
        <div className="instructions">
          <h3>How to use:</h3>
          <ol>
            <li>Open <strong>Game Master Control</strong> on your phone/tablet</li>
            <li>Open <strong>TV Display View</strong> in a new tab and mirror it to your TV</li>
            <li>Control everything from the Game Master interface!</li>
          </ol>
        </div>
      </div>
    )
  }

  if (view === 'master') {
    return <GameMaster gameState={gameState} setGameState={setGameState} onBack={() => setView('home')} />
  }

  if (view === 'display') {
    return <DisplayView onBack={() => setView('home')} />
  }
}

export default App

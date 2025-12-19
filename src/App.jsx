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
      currentScene: {
        type: 'game', // 'game', 'shop', 'image', 'text'
        data: {}
      },
      shopItems: [],
      mapGrid: {
        rows: 5,
        cols: 5,
        tiles: Array(25).fill().map((_, i) => ({
          id: i,
          type: 'normal',
          label: ''
        }))
      }
    }
  })

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

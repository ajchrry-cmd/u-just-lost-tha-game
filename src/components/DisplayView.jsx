import { useState, useEffect } from 'react'
import './DisplayView.css'

export default function DisplayView({ onBack }) {
  const [gameState, setGameState] = useState(() => {
    const saved = localStorage.getItem('gameState')
    return saved ? JSON.parse(saved) : {
      players: [],
      currentEvent: null,
      gameTitle: 'Epic Game Night',
      theme: 'default'
    }
  })

  useEffect(() => {
    const handleStorageChange = () => {
      const saved = localStorage.getItem('gameState')
      if (saved) {
        setGameState(JSON.parse(saved))
      }
    }

    window.addEventListener('storage', handleStorageChange)

    const interval = setInterval(handleStorageChange, 500)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      clearInterval(interval)
    }
  }, [])

  const sortedPlayers = [...gameState.players].sort((a, b) => b.score - a.score)

  return (
    <div className="display-view">
      <button className="back-button-display" onClick={onBack}>← Exit Display</button>

      <header className="display-header">
        <h1>{gameState.gameTitle}</h1>
      </header>

      {gameState.currentEvent && (
        <section className="event-display">
          <div className="event-content">
            <h2>{gameState.currentEvent.title}</h2>
            {gameState.currentEvent.description && (
              <p>{gameState.currentEvent.description}</p>
            )}
          </div>
        </section>
      )}

      <section className="scoreboard">
        <h2>🏆 Scoreboard</h2>
        <div className="players-grid">
          {sortedPlayers.map((player, index) => (
            <div
              key={player.id}
              className={`player-display ${player.status}`}
              style={{ borderColor: player.color }}
            >
              <div className="player-rank">
                {index === 0 && '👑'}
                {index === 1 && '🥈'}
                {index === 2 && '🥉'}
                {index > 2 && `#${index + 1}`}
              </div>
              <div className="player-name">{player.name}</div>
              <div className="player-score-display">{player.score}</div>
              {player.status !== 'active' && (
                <div className="player-status-badge">{player.status}</div>
              )}
            </div>
          ))}
        </div>

        {gameState.players.length === 0 && (
          <div className="empty-state">
            <p>No players yet!</p>
            <p className="hint">Add players from the Game Master control panel</p>
          </div>
        )}
      </section>

      <footer className="display-footer">
        <div className="player-count">
          {gameState.players.length} {gameState.players.length === 1 ? 'Player' : 'Players'}
        </div>
      </footer>
    </div>
  )
}

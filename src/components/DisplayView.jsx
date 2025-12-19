import { useState, useEffect } from 'react'
import './DisplayView.css'

export default function DisplayView({ onBack }) {
  const [gameState, setGameState] = useState(() => {
    const saved = localStorage.getItem('gameState')
    return saved ? JSON.parse(saved) : {
      players: [],
      currentEvent: null,
      gameTitle: 'Epic Game Night',
      theme: 'default',
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

  const getPlayersAtPosition = (position) => {
    return gameState.players.filter(p => p.position === position)
  }

  return (
    <div className="display-view">
      <div className="rotate-message">
        <div className="rotate-message-icon">📱➡️📺</div>
        <h2>Please Rotate Your Device</h2>
        <p>This display works best in landscape mode</p>
      </div>

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

      <section className="map-section">
        <div className="game-map" style={{
          gridTemplateColumns: `repeat(${gameState.mapGrid.cols}, 1fr)`,
          gridTemplateRows: `repeat(${gameState.mapGrid.rows}, 1fr)`
        }}>
          {gameState.mapGrid.tiles.map((tile, index) => {
            const playersHere = getPlayersAtPosition(index)
            return (
              <div key={tile.id} className="map-tile" data-tile-type={tile.type}>
                <span className="tile-number">{index}</span>
                {tile.label && <span className="tile-label">{tile.label}</span>}
                {playersHere.length > 0 && (
                  <div className="tile-players">
                    {playersHere.map(player => (
                      <div
                        key={player.id}
                        className="player-marker"
                        style={{ backgroundColor: player.color }}
                        title={player.name}
                      >
                        {player.name.charAt(0)}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </section>

      <section className="players-bar">
        {gameState.players.length === 0 && (
          <div className="empty-state">
            <p>No players yet!</p>
            <p className="hint">Add players from the Game Master control panel</p>
          </div>
        )}

        {gameState.players.map(player => (
          <div
            key={player.id}
            className={`player-panel ${player.status}`}
            style={{ borderColor: player.color }}
          >
            <div className="player-header">
              <h3 style={{ color: player.color }}>{player.name}</h3>
              <div className="player-score-badge">{player.score}pts</div>
            </div>

            <div className="player-stats-bar">
              <div className="stat">
                <span className="stat-icon">❤️</span>
                <div className="stat-bar">
                  <div
                    className="stat-fill health"
                    style={{ width: `${Math.min(100, player.stats?.health || 0)}%` }}
                  />
                </div>
                <span className="stat-value">{player.stats?.health || 0}</span>
              </div>

              <div className="stat">
                <span className="stat-icon">⚡</span>
                <div className="stat-bar">
                  <div
                    className="stat-fill energy"
                    style={{ width: `${Math.min(100, player.stats?.energy || 0)}%` }}
                  />
                </div>
                <span className="stat-value">{player.stats?.energy || 0}</span>
              </div>

              <div className="stat">
                <span className="stat-icon">⚔️</span>
                <span className="stat-value">{player.stats?.attack || 0}</span>
              </div>

              <div className="stat">
                <span className="stat-icon">🛡️</span>
                <span className="stat-value">{player.stats?.defense || 0}</span>
              </div>
            </div>

            <div className="player-inventory-bar">
              <span className="inventory-label">🎒</span>
              <div className="inventory-items">
                {player.inventory?.map(item => (
                  <div key={item.id} className="inventory-item" title={item.name}>
                    {item.name}
                  </div>
                ))}
                {Array.from({ length: 4 - (player.inventory?.length || 0) }).map((_, i) => (
                  <div key={`empty-${i}`} className="inventory-item empty">—</div>
                ))}
              </div>
            </div>

            {player.status !== 'active' && (
              <div className="player-status-overlay">{player.status}</div>
            )}
          </div>
        ))}
      </section>
    </div>
  )
}

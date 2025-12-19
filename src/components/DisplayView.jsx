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

      <div className="display-content">
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

        <section className="players-stats">
          {gameState.players.length === 0 && (
            <div className="empty-state">
              <p>No players yet!</p>
              <p className="hint">Add players from the Game Master control panel</p>
            </div>
          )}

          {gameState.players.map(player => (
            <div
              key={player.id}
              className={`player-stat-card ${player.status}`}
              style={{ borderColor: player.color }}
            >
              <div className="player-stat-header">
                <h3 className="player-stat-name" style={{ color: player.color }}>
                  {player.name}
                </h3>
                <div className="player-stat-score">{player.score}pts</div>
              </div>

              <div className="player-stat-grid">
                <div className="stat-item">
                  <span className="stat-item-icon">❤️</span>
                  <div className="stat-item-bar">
                    <div
                      className="stat-item-fill health"
                      style={{ width: `${Math.min(100, player.stats?.health || 0)}%` }}
                    />
                  </div>
                  <span className="stat-item-value">{player.stats?.health || 0}</span>
                </div>

                <div className="stat-item">
                  <span className="stat-item-icon">⚡</span>
                  <div className="stat-item-bar">
                    <div
                      className="stat-item-fill energy"
                      style={{ width: `${Math.min(100, player.stats?.energy || 0)}%` }}
                    />
                  </div>
                  <span className="stat-item-value">{player.stats?.energy || 0}</span>
                </div>

                <div className="stat-item">
                  <span className="stat-item-icon">⚔️</span>
                  <span className="stat-item-value">{player.stats?.attack || 0}</span>
                </div>

                <div className="stat-item">
                  <span className="stat-item-icon">🛡️</span>
                  <span className="stat-item-value">{player.stats?.defense || 0}</span>
                </div>
              </div>

              <div className="player-stat-inventory">
                <span className="inventory-icon">🎒</span>
                <div className="inventory-slots">
                  {player.inventory?.map(item => (
                    <div key={item.id} className="inventory-slot" title={item.name}>
                      {item.name}
                    </div>
                  ))}
                  {Array.from({ length: 4 - (player.inventory?.length || 0) }).map((_, i) => (
                    <div key={`empty-${i}`} className="inventory-slot empty">—</div>
                  ))}
                </div>
              </div>

              {player.status !== 'active' && (
                <div className="player-stat-status">{player.status}</div>
              )}
            </div>
          ))}
        </section>
      </div>
    </div>
  )
}

import { useState, useEffect, useCallback, useRef } from 'react'
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

  const [isSpinning, setIsSpinning] = useState(false)
  const [wheelRotation, setWheelRotation] = useState(0)
  const [wheelResult, setWheelResult] = useState(null)
  const lastSpinTrigger = useRef(null)

  const currentScene = gameState.currentScene?.type || 'game'
  const sceneData = gameState.currentScene?.data || {}

  const spinWheel = useCallback(() => {
    if (isSpinning || !sceneData.outcomes || sceneData.outcomes.length < 2) return

    setIsSpinning(true)
    setWheelResult(null)

    // Calculate which outcome to land on based on percentages
    const outcomes = sceneData.outcomes
    const totalPercentage = outcomes.reduce((sum, o) => sum + o.percentage, 0)
    const random = Math.random() * totalPercentage

    let cumulativePercentage = 0
    let selectedOutcome = outcomes[0]

    for (const outcome of outcomes) {
      cumulativePercentage += outcome.percentage
      if (random <= cumulativePercentage) {
        selectedOutcome = outcome
        break
      }
    }

    // Calculate rotation to land on the selected outcome
    const outcomeIndex = outcomes.indexOf(selectedOutcome)
    const segmentAngle = 360 / outcomes.length
    const targetAngle = 360 - (outcomeIndex * segmentAngle + segmentAngle / 2)
    const spins = 5 // Number of full rotations
    const finalRotation = wheelRotation + (spins * 360) + targetAngle + (Math.random() * 20 - 10)

    setWheelRotation(finalRotation)

    setTimeout(() => {
      setIsSpinning(false)
      setWheelResult(selectedOutcome)
    }, 4000)
  }, [isSpinning, sceneData.outcomes, wheelRotation])

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

  // Watch for wheel spin trigger from Game Master
  useEffect(() => {
    if (
      gameState.wheelSpinTrigger &&
      gameState.currentScene?.type === 'wheel' &&
      !isSpinning &&
      gameState.wheelSpinTrigger !== lastSpinTrigger.current
    ) {
      lastSpinTrigger.current = gameState.wheelSpinTrigger
      spinWheel()
    }
  }, [gameState.wheelSpinTrigger, gameState.currentScene?.type, isSpinning, spinWheel])

  const getPlayersAtPosition = (position) => {
    return gameState.players.filter(p => p.position === position)
  }

  const getPlayersAtTile = (tileId) => {
    return gameState.players.filter(p => p.position === tileId)
  }

  const renderGameView = () => {
    const isCustomMode = gameState.mapMode === 'custom'
    const customTiles = gameState.customMap?.tiles || []

    return (
      <div className="display-content">
        <section className="map-section">
          {isCustomMode ? (
            <div className="custom-map-display" style={{
              backgroundImage: gameState.customMap?.backgroundImage
                ? `url(${gameState.customMap.backgroundImage})`
                : 'none',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}>
              {/* Render connections */}
              <svg className="connections-layer" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1 }}>
                {customTiles.map(tile =>
                  (tile.connections || []).map(connId => {
                    const connTile = customTiles.find(t => t.id === connId)
                    if (!connTile) return null
                    return (
                      <line
                        key={`${tile.id}-${connId}`}
                        x1={`${tile.x}%`}
                        y1={`${tile.y}%`}
                        x2={`${connTile.x}%`}
                        y2={`${connTile.y}%`}
                        stroke="#6C63FF"
                        strokeWidth="4"
                        strokeDasharray="8,8"
                        opacity="0.7"
                      />
                    )
                  })
                )}
              </svg>

              {/* Render tiles */}
              {customTiles.map(tile => {
                const playersHere = getPlayersAtTile(tile.id)
                return (
                  <div
                    key={tile.id}
                    className={`custom-map-tile shape-${tile.shape || 'circle'}`}
                    style={{
                      left: `${tile.x}%`,
                      top: `${tile.y}%`,
                      width: `${tile.size || 80}px`,
                      height: `${tile.size || 80}px`,
                      background: tile.color || undefined,
                      transform: `translate(-50%, -50%) rotate(${tile.rotation || 0}deg) ${tile.shape === 'diamond' ? 'rotate(45deg)' : ''}`,
                      zIndex: 2
                    }}
                  >
                    <div className="tile-label-display" style={{ transform: `rotate(-${tile.rotation || 0}deg) ${tile.shape === 'diamond' ? 'rotate(-45deg)' : ''}` }}>
                      {tile.label}
                    </div>
                    {playersHere.length > 0 && (
                      <div className="tile-players" style={{ transform: `rotate(-${tile.rotation || 0}deg) ${tile.shape === 'diamond' ? 'rotate(-45deg)' : ''}` }}>
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
              {customTiles.length === 0 && (
                <div className="empty-map-message">
                  <p>No tiles on the map yet</p>
                  <p className="hint">Add tiles from the Game Master panel</p>
                </div>
              )}
            </div>
          ) : (
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
          )}
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
                <span className="stat-item-icon">⚡</span>
                <div className="stat-item-bar">
                  <div
                    className="stat-item-fill power"
                    style={{ width: `${Math.min(100, player.stats?.power || 0)}%` }}
                  />
                </div>
                <span className="stat-item-value">{player.stats?.power || 0}</span>
              </div>

              <div className="stat-item">
                <span className="stat-item-icon">💰</span>
                <span className="stat-item-value">{player.stats?.gold || 0}</span>
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
  )
  }

  const renderShopView = () => (
    <div className="shop-scene">
      <h2 className="shop-title">🛒 Shop</h2>
      <div className="shop-items-grid">
        {sceneData.items?.map(item => (
          <div key={item.id} className="shop-item-display">
            <div className="shop-item-name">{item.name}</div>
            <div className="shop-item-price">💰 {item.price}</div>
          </div>
        ))}
        {(!sceneData.items || sceneData.items.length === 0) && (
          <div className="empty-scene">
            <p>No items in the shop</p>
            <p className="hint">Add items from the Game Master panel</p>
          </div>
        )}
      </div>
    </div>
  )

  const renderImageView = () => (
    <div className="image-scene">
      {sceneData.title && <h2 className="image-title">{sceneData.title}</h2>}
      {sceneData.url ? (
        <img src={sceneData.url} alt={sceneData.title || 'Scene image'} className="scene-image" />
      ) : (
        <div className="empty-scene">
          <p>No image to display</p>
          <p className="hint">Add an image URL from the Game Master panel</p>
        </div>
      )}
    </div>
  )

  const renderTextView = () => (
    <div className="text-scene">
      {sceneData.title && <h2 className="text-title">{sceneData.title}</h2>}
      {sceneData.text ? (
        <div className="text-content">{sceneData.text}</div>
      ) : (
        <div className="empty-scene">
          <p>No text to display</p>
          <p className="hint">Add text from the Game Master panel</p>
        </div>
      )}
    </div>
  )

  const renderWheelView = () => {
    const outcomes = sceneData.outcomes || []

    if (outcomes.length === 0) {
      return (
        <div className="wheel-scene">
          <div className="empty-scene">
            <p>No wheel configured</p>
            <p className="hint">Add outcomes from the Game Master panel</p>
          </div>
        </div>
      )
    }

    const segmentAngle = 360 / outcomes.length
    const colors = ['#6C63FF', '#FF6B6B', '#4ECDC4', '#FFD93D', '#95E1D3', '#F38181', '#AA96DA', '#FCBAD3']

    return (
      <div className="wheel-scene">
        <div className="wheel-container">
          <div className="wheel-pointer">▼</div>
          <svg
            className="spinning-wheel"
            viewBox="-200 -200 400 400"
            style={{
              transform: `rotate(${wheelRotation}deg)`,
              transition: isSpinning ? 'transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)' : 'none'
            }}
          >
            {outcomes.map((outcome, index) => {
              const startAngle = (index * segmentAngle - 90) * (Math.PI / 180)
              const endAngle = ((index + 1) * segmentAngle - 90) * (Math.PI / 180)
              const largeArc = segmentAngle > 180 ? 1 : 0

              const x1 = 180 * Math.cos(startAngle)
              const y1 = 180 * Math.sin(startAngle)
              const x2 = 180 * Math.cos(endAngle)
              const y2 = 180 * Math.sin(endAngle)

              const textAngle = (index * segmentAngle + segmentAngle / 2)
              const textRadius = 120
              const textX = textRadius * Math.cos((textAngle - 90) * Math.PI / 180)
              const textY = textRadius * Math.sin((textAngle - 90) * Math.PI / 180)

              return (
                <g key={outcome.id}>
                  <path
                    d={`M 0 0 L ${x1} ${y1} A 180 180 0 ${largeArc} 1 ${x2} ${y2} Z`}
                    fill={colors[index % colors.length]}
                    stroke="#1A1A2E"
                    strokeWidth="2"
                  />
                  <text
                    x={textX}
                    y={textY}
                    fill="white"
                    fontSize="16"
                    fontWeight="bold"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    transform={`rotate(${textAngle}, ${textX}, ${textY})`}
                  >
                    {outcome.name}
                  </text>
                  <text
                    x={textX}
                    y={textY + 18}
                    fill="white"
                    fontSize="12"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    transform={`rotate(${textAngle}, ${textX}, ${textY + 18})`}
                  >
                    {outcome.percentage}%
                  </text>
                </g>
              )
            })}
            <circle cx="0" cy="0" r="30" fill="#1A1A2E" stroke="white" strokeWidth="3" />
          </svg>
        </div>

        {wheelResult && (
          <div className="wheel-result">
            <h2>🎉 Result: {wheelResult.name}</h2>
          </div>
        )}

        {isSpinning && (
          <div className="spinning-message">
            <h2>🎡 Spinning...</h2>
          </div>
        )}
      </div>
    )
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

      {gameState.currentEvent && currentScene === 'game' && (
        <section className="event-display">
          <div className="event-content">
            <h2>{gameState.currentEvent.title}</h2>
            {gameState.currentEvent.description && (
              <p>{gameState.currentEvent.description}</p>
            )}
          </div>
        </section>
      )}

      {currentScene === 'game' && renderGameView()}
      {currentScene === 'shop' && renderShopView()}
      {currentScene === 'image' && renderImageView()}
      {currentScene === 'text' && renderTextView()}
      {currentScene === 'wheel' && renderWheelView()}
    </div>
  )
}

import { useState } from 'react'
import './GameMaster.css'

export default function GameMaster({ gameState, setGameState, onBack }) {
  const [newPlayerName, setNewPlayerName] = useState('')
  const [newEventTitle, setNewEventTitle] = useState('')
  const [newEventDescription, setNewEventDescription] = useState('')
  const [editingPlayer, setEditingPlayer] = useState(null)
  const [selectedPlayer, setSelectedPlayer] = useState(null)
  const [newItemName, setNewItemName] = useState('')

  // Scene management state
  const [newShopItemName, setNewShopItemName] = useState('')
  const [newShopItemPrice, setNewShopItemPrice] = useState(10)
  const [imageUrl, setImageUrl] = useState('')
  const [imageTitle, setImageTitle] = useState('')
  const [customText, setCustomText] = useState('')
  const [customTextTitle, setCustomTextTitle] = useState('')

  const addPlayer = () => {
    if (newPlayerName.trim()) {
      setGameState({
        ...gameState,
        players: [
          ...gameState.players,
          {
            id: Date.now(),
            name: newPlayerName,
            score: 0,
            status: 'active',
            color: getRandomColor(),
            position: 0,
            stats: {
              power: 50,
              gold: 100
            },
            inventory: []
          }
        ]
      })
      setNewPlayerName('')
    }
  }

  const removePlayer = (playerId) => {
    setGameState({
      ...gameState,
      players: gameState.players.filter(p => p.id !== playerId)
    })
    if (selectedPlayer === playerId) setSelectedPlayer(null)
  }

  const updatePlayerScore = (playerId, change) => {
    setGameState({
      ...gameState,
      players: gameState.players.map(p =>
        p.id === playerId ? { ...p, score: Math.max(0, p.score + change) } : p
      )
    })
  }

  const updatePlayerName = (playerId, newName) => {
    setGameState({
      ...gameState,
      players: gameState.players.map(p =>
        p.id === playerId ? { ...p, name: newName } : p
      )
    })
    setEditingPlayer(null)
  }

  const updatePlayerStatus = (playerId, status) => {
    setGameState({
      ...gameState,
      players: gameState.players.map(p =>
        p.id === playerId ? { ...p, status } : p
      )
    })
  }

  const updatePlayerPosition = (playerId, newPosition) => {
    setGameState({
      ...gameState,
      players: gameState.players.map(p =>
        p.id === playerId ? { ...p, position: newPosition } : p
      )
    })
  }

  const updatePlayerStat = (playerId, stat, value) => {
    setGameState({
      ...gameState,
      players: gameState.players.map(p =>
        p.id === playerId ? { ...p, stats: { ...p.stats, [stat]: Math.max(0, value) } } : p
      )
    })
  }

  const addItemToPlayer = (playerId) => {
    if (!newItemName.trim()) return

    setGameState({
      ...gameState,
      players: gameState.players.map(p => {
        if (p.id === playerId && p.inventory.length < 4) {
          return {
            ...p,
            inventory: [...p.inventory, { id: Date.now(), name: newItemName }]
          }
        }
        return p
      })
    })
    setNewItemName('')
  }

  const removeItemFromPlayer = (playerId, itemId) => {
    setGameState({
      ...gameState,
      players: gameState.players.map(p =>
        p.id === playerId
          ? { ...p, inventory: p.inventory.filter(item => item.id !== itemId) }
          : p
      )
    })
  }

  const movePlayerUp = (playerId) => {
    const player = gameState.players.find(p => p.id === playerId)
    if (!player) return
    const newPos = player.position - gameState.mapGrid.cols
    if (newPos >= 0) updatePlayerPosition(playerId, newPos)
  }

  const movePlayerDown = (playerId) => {
    const player = gameState.players.find(p => p.id === playerId)
    if (!player) return
    const newPos = player.position + gameState.mapGrid.cols
    if (newPos < gameState.mapGrid.tiles.length) updatePlayerPosition(playerId, newPos)
  }

  const movePlayerLeft = (playerId) => {
    const player = gameState.players.find(p => p.id === playerId)
    if (!player) return
    if (player.position % gameState.mapGrid.cols > 0) {
      updatePlayerPosition(playerId, player.position - 1)
    }
  }

  const movePlayerRight = (playerId) => {
    const player = gameState.players.find(p => p.id === playerId)
    if (!player) return
    if ((player.position + 1) % gameState.mapGrid.cols !== 0) {
      updatePlayerPosition(playerId, player.position + 1)
    }
  }

  const setCurrentEvent = () => {
    if (newEventTitle.trim()) {
      setGameState({
        ...gameState,
        currentEvent: {
          title: newEventTitle,
          description: newEventDescription,
          timestamp: Date.now()
        }
      })
      setNewEventTitle('')
      setNewEventDescription('')
    }
  }

  const clearEvent = () => {
    setGameState({
      ...gameState,
      currentEvent: null
    })
  }

  const updateGameTitle = (newTitle) => {
    setGameState({
      ...gameState,
      gameTitle: newTitle
    })
  }

  const resetAllScores = () => {
    if (confirm('Reset all player scores to 0?')) {
      setGameState({
        ...gameState,
        players: gameState.players.map(p => ({ ...p, score: 0 }))
      })
    }
  }

  const getRandomColor = () => {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2']
    return colors[Math.floor(Math.random() * colors.length)]
  }

  // Scene management functions
  const switchScene = (type, data = {}) => {
    setGameState({
      ...gameState,
      currentScene: { type, data }
    })
  }

  const addShopItem = () => {
    if (newShopItemName.trim()) {
      setGameState({
        ...gameState,
        shopItems: [
          ...gameState.shopItems,
          {
            id: Date.now(),
            name: newShopItemName,
            price: newShopItemPrice
          }
        ]
      })
      setNewShopItemName('')
      setNewShopItemPrice(10)
    }
  }

  const removeShopItem = (itemId) => {
    setGameState({
      ...gameState,
      shopItems: gameState.shopItems.filter(item => item.id !== itemId)
    })
  }

  const showShop = () => {
    switchScene('shop', { items: gameState.shopItems })
  }

  const showImage = () => {
    if (imageUrl.trim()) {
      switchScene('image', { url: imageUrl, title: imageTitle })
    }
  }

  const showCustomText = () => {
    if (customText.trim()) {
      switchScene('text', { text: customText, title: customTextTitle })
    }
  }

  const selectedPlayerData = gameState.players.find(p => p.id === selectedPlayer)

  return (
    <div className="game-master">
      <header className="gm-header">
        <button className="back-button" onClick={onBack}>← Back</button>
        <h1>🎯 Game Master Control</h1>
      </header>

      <div className="gm-content">
        <section className="section game-settings">
          <h2>⚙️ Game Settings</h2>
          <div className="input-group">
            <label>Game Title:</label>
            <input
              type="text"
              value={gameState.gameTitle}
              onChange={(e) => updateGameTitle(e.target.value)}
              placeholder="Enter game title"
            />
          </div>
        </section>

        <section className="section scene-management">
          <h2>🎬 TV Display Scene Control</h2>
          <p className="scene-current">Current Scene: <strong>{gameState.currentScene?.type || 'game'}</strong></p>

          <div className="scene-buttons">
            <button
              className={`scene-button ${gameState.currentScene?.type === 'game' ? 'active' : ''}`}
              onClick={() => switchScene('game')}
            >
              🎮 Game View
            </button>
            <button
              className={`scene-button ${gameState.currentScene?.type === 'shop' ? 'active' : ''}`}
              onClick={showShop}
            >
              🛒 Shop
            </button>
            <button
              className={`scene-button ${gameState.currentScene?.type === 'image' ? 'active' : ''}`}
              onClick={showImage}
            >
              🖼️ Image
            </button>
            <button
              className={`scene-button ${gameState.currentScene?.type === 'text' ? 'active' : ''}`}
              onClick={showCustomText}
            >
              📄 Custom Text
            </button>
          </div>

          {/* Shop Management */}
          <div className="scene-editor shop-editor">
            <h3>🛒 Shop Items</h3>
            <div className="add-shop-item">
              <input
                type="text"
                value={newShopItemName}
                onChange={(e) => setNewShopItemName(e.target.value)}
                placeholder="Item name"
                onKeyPress={(e) => e.key === 'Enter' && addShopItem()}
              />
              <input
                type="number"
                value={newShopItemPrice}
                onChange={(e) => setNewShopItemPrice(parseInt(e.target.value) || 0)}
                placeholder="Price"
                style={{ width: '100px' }}
              />
              <button onClick={addShopItem}>Add Item</button>
            </div>
            <div className="shop-items-list">
              {gameState.shopItems?.map(item => (
                <div key={item.id} className="shop-item-chip">
                  <span>{item.name} - 💰{item.price}</span>
                  <button onClick={() => removeShopItem(item.id)}>✕</button>
                </div>
              ))}
              {(!gameState.shopItems || gameState.shopItems.length === 0) && (
                <p className="empty-hint">No shop items yet</p>
              )}
            </div>
          </div>

          {/* Image Scene */}
          <div className="scene-editor image-editor">
            <h3>🖼️ Image Scene</h3>
            <div className="input-group">
              <label>Image Title (optional):</label>
              <input
                type="text"
                value={imageTitle}
                onChange={(e) => setImageTitle(e.target.value)}
                placeholder="Image title"
              />
            </div>
            <div className="input-group">
              <label>Image URL:</label>
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>

          {/* Custom Text Scene */}
          <div className="scene-editor text-editor">
            <h3>📄 Custom Text Scene</h3>
            <div className="input-group">
              <label>Title (optional):</label>
              <input
                type="text"
                value={customTextTitle}
                onChange={(e) => setCustomTextTitle(e.target.value)}
                placeholder="Scene title"
              />
            </div>
            <div className="input-group">
              <label>Text Content:</label>
              <textarea
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder="Enter text to display..."
                rows="4"
              />
            </div>
          </div>
        </section>

        <section className="section player-management">
          <div className="section-header">
            <h2>👥 Players ({gameState.players.length})</h2>
            <button className="danger-button small" onClick={resetAllScores}>Reset All Scores</button>
          </div>

          <div className="add-player">
            <input
              type="text"
              value={newPlayerName}
              onChange={(e) => setNewPlayerName(e.target.value)}
              placeholder="Enter player name"
              onKeyPress={(e) => e.key === 'Enter' && addPlayer()}
            />
            <button onClick={addPlayer}>Add Player</button>
          </div>

          <div className="players-list">
            {gameState.players.map(player => (
              <div key={player.id} className="player-card" style={{ borderColor: player.color }}>
                <div className="player-info">
                  {editingPlayer === player.id ? (
                    <input
                      type="text"
                      defaultValue={player.name}
                      onBlur={(e) => updatePlayerName(player.id, e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && updatePlayerName(player.id, e.target.value)}
                      autoFocus
                    />
                  ) : (
                    <h3 onClick={() => setEditingPlayer(player.id)}>{player.name}</h3>
                  )}
                  <span className="player-status" data-status={player.status}>
                    {player.status}
                  </span>
                </div>

                <div className="player-score">
                  <button onClick={() => updatePlayerScore(player.id, -1)}>-1</button>
                  <span className="score">{player.score}</span>
                  <button onClick={() => updatePlayerScore(player.id, 1)}>+1</button>
                  <button onClick={() => updatePlayerScore(player.id, 5)}>+5</button>
                </div>

                <div className="player-actions">
                  <select
                    value={player.status}
                    onChange={(e) => updatePlayerStatus(player.id, e.target.value)}
                  >
                    <option value="active">Active</option>
                    <option value="eliminated">Eliminated</option>
                    <option value="safe">Safe</option>
                    <option value="danger">In Danger</option>
                  </select>
                  <button
                    className={selectedPlayer === player.id ? "primary-button" : ""}
                    onClick={() => setSelectedPlayer(player.id)}
                  >
                    {selectedPlayer === player.id ? '✓ Selected' : 'Select'}
                  </button>
                  <button className="danger-button" onClick={() => removePlayer(player.id)}>Remove</button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {selectedPlayerData && (
          <>
            <section className="section player-control">
              <h2>🎮 Control: {selectedPlayerData.name}</h2>

              <div className="control-group">
                <h3>📍 Position Control</h3>
                <p>Current Position: Tile {selectedPlayerData.position}</p>
                <div className="position-controls">
                  <button onClick={() => movePlayerUp(selectedPlayer)}>⬆️ Up</button>
                  <div className="horizontal-controls">
                    <button onClick={() => movePlayerLeft(selectedPlayer)}>⬅️ Left</button>
                    <button onClick={() => movePlayerRight(selectedPlayer)}>➡️ Right</button>
                  </div>
                  <button onClick={() => movePlayerDown(selectedPlayer)}>⬇️ Down</button>
                </div>
                <div className="direct-position">
                  <label>Or jump to tile:</label>
                  <input
                    type="number"
                    min="0"
                    max={gameState.mapGrid.tiles.length - 1}
                    value={selectedPlayerData.position}
                    onChange={(e) => updatePlayerPosition(selectedPlayer, parseInt(e.target.value) || 0)}
                  />
                </div>
              </div>

              <div className="control-group">
                <h3>📊 Stats</h3>
                <div className="stats-grid">
                  <div className="stat-control">
                    <label>⚡ Power</label>
                    <div className="stat-buttons">
                      <button onClick={() => updatePlayerStat(selectedPlayer, 'power', selectedPlayerData.stats.power - 10)}>-10</button>
                      <input
                        type="number"
                        value={selectedPlayerData.stats.power}
                        onChange={(e) => updatePlayerStat(selectedPlayer, 'power', parseInt(e.target.value) || 0)}
                      />
                      <button onClick={() => updatePlayerStat(selectedPlayer, 'power', selectedPlayerData.stats.power + 10)}>+10</button>
                    </div>
                  </div>
                  <div className="stat-control">
                    <label>💰 Gold</label>
                    <div className="stat-buttons">
                      <button onClick={() => updatePlayerStat(selectedPlayer, 'gold', selectedPlayerData.stats.gold - 10)}>-10</button>
                      <input
                        type="number"
                        value={selectedPlayerData.stats.gold}
                        onChange={(e) => updatePlayerStat(selectedPlayer, 'gold', parseInt(e.target.value) || 0)}
                      />
                      <button onClick={() => updatePlayerStat(selectedPlayer, 'gold', selectedPlayerData.stats.gold + 10)}>+10</button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="control-group">
                <h3>🎒 Inventory ({selectedPlayerData.inventory.length}/4)</h3>
                <div className="inventory-controls">
                  {selectedPlayerData.inventory.length < 4 && (
                    <div className="add-item">
                      <input
                        type="text"
                        value={newItemName}
                        onChange={(e) => setNewItemName(e.target.value)}
                        placeholder="Item name"
                        onKeyPress={(e) => e.key === 'Enter' && addItemToPlayer(selectedPlayer)}
                      />
                      <button onClick={() => addItemToPlayer(selectedPlayer)}>Add Item</button>
                    </div>
                  )}
                  <div className="items-list">
                    {selectedPlayerData.inventory.map(item => (
                      <div key={item.id} className="item-chip">
                        <span>{item.name}</span>
                        <button onClick={() => removeItemFromPlayer(selectedPlayer, item.id)}>✕</button>
                      </div>
                    ))}
                  </div>
                  {selectedPlayerData.inventory.length === 0 && (
                    <p className="empty-inventory">No items yet</p>
                  )}
                </div>
              </div>
            </section>
          </>
        )}

        <section className="section event-management">
          <h2>📢 Current Event</h2>

          {gameState.currentEvent ? (
            <div className="current-event">
              <h3>{gameState.currentEvent.title}</h3>
              <p>{gameState.currentEvent.description}</p>
              <button className="danger-button" onClick={clearEvent}>Clear Event</button>
            </div>
          ) : (
            <div className="add-event">
              <input
                type="text"
                value={newEventTitle}
                onChange={(e) => setNewEventTitle(e.target.value)}
                placeholder="Event title"
              />
              <textarea
                value={newEventDescription}
                onChange={(e) => setNewEventDescription(e.target.value)}
                placeholder="Event description (optional)"
                rows="3"
              />
              <button onClick={setCurrentEvent}>Set Event</button>
            </div>
          )}
        </section>

        <section className="section quick-actions">
          <h2>⚡ Quick Actions</h2>
          <div className="action-buttons">
            <button onClick={() => {
              const player = gameState.players[Math.floor(Math.random() * gameState.players.length)]
              if (player) {
                setGameState({
                  ...gameState,
                  currentEvent: {
                    title: `${player.name}'s Turn!`,
                    description: 'Make your choice!',
                    timestamp: Date.now()
                  }
                })
              }
            }}>
              🎯 Random Player
            </button>
            <button onClick={() => {
              setGameState({
                ...gameState,
                currentEvent: {
                  title: '⏸️ Game Paused',
                  description: 'Take a break!',
                  timestamp: Date.now()
                }
              })
            }}>
              ⏸️ Pause Game
            </button>
          </div>
        </section>
      </div>
    </div>
  )
}

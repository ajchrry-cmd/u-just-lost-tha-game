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
  const [imageSceneName, setImageSceneName] = useState('')
  const [customText, setCustomText] = useState('')
  const [customTextTitle, setCustomTextTitle] = useState('')
  const [textSceneName, setTextSceneName] = useState('')
  const [wheelSceneName, setWheelSceneName] = useState('')
  const [wheelOutcomes, setWheelOutcomes] = useState([])
  const [newOutcomeName, setNewOutcomeName] = useState('')
  const [newOutcomePercentage] = useState(25)

  // Map editor state
  const [selectedTile, setSelectedTile] = useState(null)
  const [newTileLabel, setNewTileLabel] = useState('')

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

  const saveImageScene = () => {
    if (imageUrl.trim() && imageSceneName.trim()) {
      setGameState({
        ...gameState,
        customScenes: [
          ...gameState.customScenes,
          {
            id: Date.now(),
            name: imageSceneName,
            type: 'image',
            data: { url: imageUrl, title: imageTitle }
          }
        ]
      })
      setImageUrl('')
      setImageTitle('')
      setImageSceneName('')
    }
  }

  const saveTextScene = () => {
    if (customText.trim() && textSceneName.trim()) {
      setGameState({
        ...gameState,
        customScenes: [
          ...gameState.customScenes,
          {
            id: Date.now(),
            name: textSceneName,
            type: 'text',
            data: { text: customText, title: customTextTitle }
          }
        ]
      })
      setCustomText('')
      setCustomTextTitle('')
      setTextSceneName('')
    }
  }

  const addWheelOutcome = () => {
    if (newOutcomeName.trim() && newOutcomePercentage > 0) {
      setWheelOutcomes([
        ...wheelOutcomes,
        {
          id: Date.now(),
          name: newOutcomeName,
          percentage: newOutcomePercentage
        }
      ])
      setNewOutcomeName('')
      setNewOutcomePercentage(25)
    }
  }

  const removeWheelOutcome = (outcomeId) => {
    setWheelOutcomes(wheelOutcomes.filter(o => o.id !== outcomeId))
  }

  const updateOutcomePercentage = (outcomeId, percentage) => {
    setWheelOutcomes(wheelOutcomes.map(o =>
      o.id === outcomeId ? { ...o, percentage: Math.max(0, Math.min(100, percentage)) } : o
    ))
  }

  const saveWheelScene = () => {
    if (wheelSceneName.trim() && wheelOutcomes.length >= 2) {
      setGameState({
        ...gameState,
        customScenes: [
          ...gameState.customScenes,
          {
            id: Date.now(),
            name: wheelSceneName,
            type: 'wheel',
            data: { outcomes: wheelOutcomes }
          }
        ]
      })
      setWheelSceneName('')
      setWheelOutcomes([])
    }
  }

  const activateCustomScene = (scene) => {
    switchScene(scene.type, scene.data)
  }

  const deleteCustomScene = (sceneId) => {
    setGameState({
      ...gameState,
      customScenes: gameState.customScenes.filter(s => s.id !== sceneId)
    })
  }

  const triggerWheelSpin = () => {
    setGameState({
      ...gameState,
      wheelSpinTrigger: Date.now()
    })
  }

  // Custom map functions
  const toggleMapMode = () => {
    setGameState({
      ...gameState,
      mapMode: gameState.mapMode === 'grid' ? 'custom' : 'grid'
    })
  }

  const addTile = (event) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width) * 100
    const y = ((event.clientY - rect.top) / rect.height) * 100

    const newTile = {
      id: Date.now(),
      x: Math.round(x),
      y: Math.round(y),
      label: `Tile ${(gameState.customMap?.tiles.length || 0) + 1}`,
      type: 'normal',
      size: 80, // Default size in pixels
      shape: 'circle' // Default shape: circle, square, diamond, hexagon
    }

    setGameState({
      ...gameState,
      customMap: {
        ...gameState.customMap,
        tiles: [...(gameState.customMap?.tiles || []), newTile]
      }
    })
  }

  const deleteTile = (tileId) => {
    setGameState({
      ...gameState,
      customMap: {
        ...gameState.customMap,
        tiles: gameState.customMap.tiles.filter(t => t.id !== tileId)
      }
    })
    if (selectedTile === tileId) setSelectedTile(null)
  }

  const updateTileLabel = (tileId, newLabel) => {
    setGameState({
      ...gameState,
      customMap: {
        ...gameState.customMap,
        tiles: gameState.customMap.tiles.map(t =>
          t.id === tileId ? { ...t, label: newLabel } : t
        )
      }
    })
  }

  const moveTile = (tileId, event) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width) * 100
    const y = ((event.clientY - rect.top) / rect.height) * 100

    setGameState({
      ...gameState,
      customMap: {
        ...gameState.customMap,
        tiles: gameState.customMap.tiles.map(t =>
          t.id === tileId ? { ...t, x: Math.round(x), y: Math.round(y) } : t
        )
      }
    })
  }

  const updateTileSize = (tileId, newSize) => {
    setGameState({
      ...gameState,
      customMap: {
        ...gameState.customMap,
        tiles: gameState.customMap.tiles.map(t =>
          t.id === tileId ? { ...t, size: Math.max(40, Math.min(200, newSize)) } : t
        )
      }
    })
  }

  const updateTileShape = (tileId, newShape) => {
    setGameState({
      ...gameState,
      customMap: {
        ...gameState.customMap,
        tiles: gameState.customMap.tiles.map(t =>
          t.id === tileId ? { ...t, shape: newShape } : t
        )
      }
    })
  }

  const setBackgroundImage = (imageUrl) => {
    setGameState({
      ...gameState,
      customMap: {
        ...gameState.customMap,
        backgroundImage: imageUrl
      }
    })
  }

  const handleImageUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setBackgroundImage(e.target.result)
      }
      reader.readAsDataURL(file)
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
          </div>

          {/* Wheel Spin Control */}
          {gameState.currentScene?.type === 'wheel' && (
            <div className="wheel-spin-control">
              <button className="spin-wheel-button" onClick={triggerWheelSpin}>
                🎡 Spin the Wheel on TV!
              </button>
            </div>
          )}

          {/* Saved Custom Scenes */}
          {gameState.customScenes && gameState.customScenes.length > 0 && (
            <div className="saved-scenes">
              <h3>📚 Saved Scenes</h3>
              <div className="saved-scenes-list">
                {gameState.customScenes.map(scene => (
                  <div key={scene.id} className="saved-scene-item">
                    <span className="scene-icon">
                      {scene.type === 'image' ? '🖼️' : scene.type === 'wheel' ? '🎡' : '📄'}
                    </span>
                    <span className="scene-name">{scene.name}</span>
                    <div className="scene-actions">
                      <button
                        className={`activate-button ${gameState.currentScene?.data === scene.data ? 'active' : ''}`}
                        onClick={() => activateCustomScene(scene)}
                      >
                        Show
                      </button>
                      <button
                        className="delete-button"
                        onClick={() => deleteCustomScene(scene.id)}
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

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
            <h3>🖼️ Create Image Scene</h3>
            <div className="input-group">
              <label>Scene Name:</label>
              <input
                type="text"
                value={imageSceneName}
                onChange={(e) => setImageSceneName(e.target.value)}
                placeholder="e.g., 'Forest Entrance'"
              />
            </div>
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
            <button
              className="save-scene-button"
              onClick={saveImageScene}
              disabled={!imageUrl.trim() || !imageSceneName.trim()}
            >
              💾 Save Image Scene
            </button>
          </div>

          {/* Custom Text Scene */}
          <div className="scene-editor text-editor">
            <h3>📄 Create Text Scene</h3>
            <div className="input-group">
              <label>Scene Name:</label>
              <input
                type="text"
                value={textSceneName}
                onChange={(e) => setTextSceneName(e.target.value)}
                placeholder="e.g., 'Dragon Speech'"
              />
            </div>
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
            <button
              className="save-scene-button"
              onClick={saveTextScene}
              disabled={!customText.trim() || !textSceneName.trim()}
            >
              💾 Save Text Scene
            </button>
          </div>

          {/* Spinning Wheel Scene */}
          <div className="scene-editor wheel-editor">
            <h3>🎡 Create Spinning Wheel</h3>
            <div className="input-group">
              <label>Scene Name:</label>
              <input
                type="text"
                value={wheelSceneName}
                onChange={(e) => setWheelSceneName(e.target.value)}
                placeholder="e.g., 'Loot Wheel'"
              />
            </div>

            <div className="wheel-outcomes-section">
              <h4>Wheel Outcomes</h4>
              <div className="add-wheel-outcome">
                <input
                  type="text"
                  value={newOutcomeName}
                  onChange={(e) => setNewOutcomeName(e.target.value)}
                  placeholder="Outcome name"
                  onKeyPress={(e) => e.key === 'Enter' && addWheelOutcome()}
                />
                <input
                  type="number"
                  value={newOutcomePercentage}
                  onChange={(e) => setNewOutcomePercentage(parseInt(e.target.value) || 0)}
                  placeholder="%"
                  min="1"
                  max="100"
                  style={{ width: '80px' }}
                />
                <span className="percentage-label">%</span>
                <button onClick={addWheelOutcome}>Add</button>
              </div>

              {wheelOutcomes.length > 0 && (
                <div className="wheel-outcomes-list">
                  {wheelOutcomes.map(outcome => (
                    <div key={outcome.id} className="wheel-outcome-item">
                      <span className="outcome-name">{outcome.name}</span>
                      <div className="outcome-controls">
                        <input
                          type="number"
                          value={outcome.percentage}
                          onChange={(e) => updateOutcomePercentage(outcome.id, parseInt(e.target.value) || 0)}
                          min="1"
                          max="100"
                          style={{ width: '60px' }}
                        />
                        <span>%</span>
                        <button
                          className="delete-outcome"
                          onClick={() => removeWheelOutcome(outcome.id)}
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                  <div className="total-percentage">
                    Total: {wheelOutcomes.reduce((sum, o) => sum + o.percentage, 0)}%
                    {wheelOutcomes.reduce((sum, o) => sum + o.percentage, 0) !== 100 && (
                      <span className="warning"> (Doesn't need to equal 100%)</span>
                    )}
                  </div>
                </div>
              )}
              {wheelOutcomes.length === 0 && (
                <p className="empty-hint">Add at least 2 outcomes</p>
              )}
            </div>

            <button
              className="save-scene-button"
              onClick={saveWheelScene}
              disabled={!wheelSceneName.trim() || wheelOutcomes.length < 2}
            >
              💾 Save Wheel Scene
            </button>
          </div>
        </section>

        <section className="section map-editor">
          <h2>🗺️ Game Map Editor</h2>

          <div className="map-mode-toggle">
            <button
              className={`mode-button ${gameState.mapMode === 'grid' ? 'active' : ''}`}
              onClick={toggleMapMode}
            >
              📐 Grid Mode
            </button>
            <button
              className={`mode-button ${gameState.mapMode === 'custom' ? 'active' : ''}`}
              onClick={toggleMapMode}
            >
              ✨ Custom Mode
            </button>
          </div>

          {gameState.mapMode === 'custom' && (
            <>
              <div className="background-image-controls">
                <h3>🖼️ Map Background</h3>
                <div className="background-options">
                  <div className="input-group">
                    <label>Image URL:</label>
                    <input
                      type="text"
                      value={gameState.customMap?.backgroundImage || ''}
                      onChange={(e) => setBackgroundImage(e.target.value)}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  <div className="input-group">
                    <label>Or Upload Image:</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </div>
                  {gameState.customMap?.backgroundImage && (
                    <button
                      className="danger-button small"
                      onClick={() => setBackgroundImage('')}
                    >
                      Remove Background
                    </button>
                  )}
                </div>
              </div>

              <p className="map-instructions">
                Click anywhere on the canvas to add a tile. Click a tile to select it for editing or moving.
              </p>

              <div
                className="map-canvas"
                onClick={addTile}
                style={{
                  backgroundImage: gameState.customMap?.backgroundImage
                    ? `url(${gameState.customMap.backgroundImage})`
                    : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                {(gameState.customMap?.tiles || []).map(tile => (
                  <div
                    key={tile.id}
                    className={`custom-tile ${selectedTile === tile.id ? 'selected' : ''} shape-${tile.shape || 'circle'}`}
                    style={{
                      left: `${tile.x}%`,
                      top: `${tile.y}%`,
                      width: `${tile.size || 80}px`,
                      height: `${tile.size || 80}px`
                    }}
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedTile(tile.id)
                    }}
                    onDoubleClick={(e) => {
                      e.stopPropagation()
                      moveTile(tile.id, e)
                    }}
                  >
                    <div className="tile-label">{tile.label}</div>
                  </div>
                ))}
                {(gameState.customMap?.tiles || []).length === 0 && (
                  <div className="empty-canvas">
                    <p>Click to add your first tile</p>
                  </div>
                )}
              </div>

              {selectedTile && (
                <div className="tile-editor">
                  <h3>Edit Selected Tile</h3>
                  <div className="tile-editor-controls">
                    <div className="input-group">
                      <label>Label:</label>
                      <input
                        type="text"
                        value={gameState.customMap.tiles.find(t => t.id === selectedTile)?.label || ''}
                        onChange={(e) => updateTileLabel(selectedTile, e.target.value)}
                        placeholder="Tile label"
                      />
                    </div>
                    <div className="input-group">
                      <label>Size: {gameState.customMap.tiles.find(t => t.id === selectedTile)?.size || 80}px</label>
                      <input
                        type="range"
                        min="40"
                        max="200"
                        value={gameState.customMap.tiles.find(t => t.id === selectedTile)?.size || 80}
                        onChange={(e) => updateTileSize(selectedTile, parseInt(e.target.value))}
                      />
                    </div>
                    <div className="input-group">
                      <label>Shape:</label>
                      <select
                        value={gameState.customMap.tiles.find(t => t.id === selectedTile)?.shape || 'circle'}
                        onChange={(e) => updateTileShape(selectedTile, e.target.value)}
                      >
                        <option value="circle">● Circle</option>
                        <option value="square">■ Square</option>
                        <option value="diamond">◆ Diamond</option>
                        <option value="hexagon">⬡ Hexagon</option>
                        <option value="star">★ Star</option>
                      </select>
                    </div>
                    <button
                      className="danger-button"
                      onClick={() => deleteTile(selectedTile)}
                    >
                      🗑️ Delete Tile
                    </button>
                    <button onClick={() => setSelectedTile(null)}>
                      Deselect
                    </button>
                  </div>
                  <p className="hint">Double-click a tile to move it to a new position</p>
                </div>
              )}

              <div className="map-stats">
                <p>Total Tiles: {(gameState.customMap?.tiles || []).length}</p>
              </div>
            </>
          )}

          {gameState.mapMode === 'grid' && (
            <p className="hint">Grid mode uses the classic 5x5 grid layout</p>
          )}
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

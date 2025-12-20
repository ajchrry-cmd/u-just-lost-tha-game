import { useState } from 'react'
import './GameMaster.css'

export default function GameMaster({ gameState, setGameState, onBack }) {
  // GM Mode: 'setup' or 'playing'
  const [gmMode, setGmMode] = useState('setup')

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
  const [selectedTiles, setSelectedTiles] = useState([])
  const [newTileLabel, setNewTileLabel] = useState('')
  const [copiedTiles, setCopiedTiles] = useState([])
  const [canvasZoom, setCanvasZoom] = useState(1)
  const [canvasPan, setCanvasPan] = useState({ x: 0, y: 0 })
  const [isPanning, setIsPanning] = useState(false)
  const [dragStart, setDragStart] = useState(null)
  const [showCoordinates, setShowCoordinates] = useState(false)
  const [dragCoords, setDragCoords] = useState({ x: 0, y: 0 })
  const [contextMenu, setContextMenu] = useState(null)
  const [tileFilter, setTileFilter] = useState('')

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
    // Don't add tile if clicking on an existing tile
    if (event.target.classList.contains('custom-tile')) return

    const rect = event.currentTarget.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width) * 100
    const y = ((event.clientY - rect.top) / rect.height) * 100

    const newTile = {
      id: Date.now(),
      x: Math.round(x),
      y: Math.round(y),
      label: `Tile ${(gameState.customMap?.tiles.length || 0) + 1}`,
      type: 'normal',
      size: 80,
      shape: 'circle',
      color: null, // null means use default gradient
      rotation: 0,
      connections: [],
      locked: false
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
    const tilesToDelete = tileId ? [tileId] : selectedTiles
    setGameState({
      ...gameState,
      customMap: {
        ...gameState.customMap,
        tiles: gameState.customMap.tiles.filter(t => !tilesToDelete.includes(t.id))
      }
    })
    setSelectedTiles([])
  }

  const deleteSelectedTiles = () => {
    deleteTile(null)
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

  // Multi-select functions
  const toggleTileSelection = (tileId, event) => {
    if (event) event.stopPropagation()

    if (event?.shiftKey) {
      // Add to selection with Shift
      setSelectedTiles(prev =>
        prev.includes(tileId) ? prev.filter(id => id !== tileId) : [...prev, tileId]
      )
    } else {
      // Single selection
      setSelectedTiles([tileId])
    }
  }

  const selectAllTiles = () => {
    const allTileIds = (gameState.customMap?.tiles || []).map(t => t.id)
    setSelectedTiles(allTileIds)
  }

  const deselectAllTiles = () => {
    setSelectedTiles([])
  }

  // Copy/Paste/Duplicate functions
  const copySelectedTiles = () => {
    const tiles = gameState.customMap?.tiles || []
    const tilesToCopy = tiles.filter(t => selectedTiles.includes(t.id))
    setCopiedTiles(tilesToCopy)
  }

  const duplicateSelectedTiles = () => {
    copySelectedTiles()
    setTimeout(() => pasteCopiedTiles(), 10)
  }

  const pasteCopiedTiles = () => {
    if (copiedTiles.length === 0) return

    const newTiles = copiedTiles.map(tile => ({
      ...tile,
      id: Date.now() + Math.random(),
      x: tile.x + 5,
      y: tile.y + 5,
      label: tile.label + ' (copy)'
    }))

    setGameState({
      ...gameState,
      customMap: {
        ...gameState.customMap,
        tiles: [...(gameState.customMap?.tiles || []), ...newTiles]
      }
    })

    setSelectedTiles(newTiles.map(t => t.id))
  }

  // Lock/Unlock functions
  const toggleTileLock = (tileId) => {
    const tilesToToggle = tileId ? [tileId] : selectedTiles
    setGameState({
      ...gameState,
      customMap: {
        ...gameState.customMap,
        tiles: gameState.customMap.tiles.map(t =>
          tilesToToggle.includes(t.id) ? { ...t, locked: !t.locked } : t
        )
      }
    })
  }

  // Color and Rotation functions
  const updateTileColor = (tileId, color) => {
    const tilesToUpdate = tileId ? [tileId] : selectedTiles
    setGameState({
      ...gameState,
      customMap: {
        ...gameState.customMap,
        tiles: gameState.customMap.tiles.map(t =>
          tilesToUpdate.includes(t.id) ? { ...t, color } : t
        )
      }
    })
  }

  const updateTileRotation = (tileId, rotation) => {
    const tilesToUpdate = tileId ? [tileId] : selectedTiles
    setGameState({
      ...gameState,
      customMap: {
        ...gameState.customMap,
        tiles: gameState.customMap.tiles.map(t =>
          tilesToUpdate.includes(t.id) ? { ...t, rotation } : t
        )
      }
    })
  }

  // Connection functions
  const toggleConnection = (fromTileId, toTileId) => {
    setGameState({
      ...gameState,
      customMap: {
        ...gameState.customMap,
        tiles: gameState.customMap.tiles.map(t => {
          if (t.id === fromTileId) {
            const connections = t.connections || []
            const hasConnection = connections.includes(toTileId)
            return {
              ...t,
              connections: hasConnection
                ? connections.filter(id => id !== toTileId)
                : [...connections, toTileId]
            }
          }
          return t
        })
      }
    })
  }

  // Zoom and Pan functions
  const zoomIn = () => setCanvasZoom(prev => Math.min(3, prev + 0.25))
  const zoomOut = () => setCanvasZoom(prev => Math.max(0.5, prev - 0.25))
  const resetZoom = () => {
    setCanvasZoom(1)
    setCanvasPan({ x: 0, y: 0 })
  }

  // Alignment functions
  const alignTiles = (direction) => {
    if (selectedTiles.length < 2) return

    const tiles = gameState.customMap?.tiles || []
    const selectedTileObjects = tiles.filter(t => selectedTiles.includes(t.id))

    let updatedTiles = [...tiles]

    if (direction === 'left') {
      const minX = Math.min(...selectedTileObjects.map(t => t.x))
      updatedTiles = updatedTiles.map(t =>
        selectedTiles.includes(t.id) ? { ...t, x: minX } : t
      )
    } else if (direction === 'right') {
      const maxX = Math.max(...selectedTileObjects.map(t => t.x))
      updatedTiles = updatedTiles.map(t =>
        selectedTiles.includes(t.id) ? { ...t, x: maxX } : t
      )
    } else if (direction === 'top') {
      const minY = Math.min(...selectedTileObjects.map(t => t.y))
      updatedTiles = updatedTiles.map(t =>
        selectedTiles.includes(t.id) ? { ...t, y: minY } : t
      )
    } else if (direction === 'bottom') {
      const maxY = Math.max(...selectedTileObjects.map(t => t.y))
      updatedTiles = updatedTiles.map(t =>
        selectedTiles.includes(t.id) ? { ...t, y: maxY } : t
      )
    } else if (direction === 'center-h') {
      const avgX = selectedTileObjects.reduce((sum, t) => sum + t.x, 0) / selectedTileObjects.length
      updatedTiles = updatedTiles.map(t =>
        selectedTiles.includes(t.id) ? { ...t, x: Math.round(avgX) } : t
      )
    } else if (direction === 'center-v') {
      const avgY = selectedTileObjects.reduce((sum, t) => sum + t.y, 0) / selectedTileObjects.length
      updatedTiles = updatedTiles.map(t =>
        selectedTiles.includes(t.id) ? { ...t, y: Math.round(avgY) } : t
      )
    }

    setGameState({
      ...gameState,
      customMap: {
        ...gameState.customMap,
        tiles: updatedTiles
      }
    })
  }

  const distributeTiles = (direction) => {
    if (selectedTiles.length < 3) return

    const tiles = gameState.customMap?.tiles || []
    const selectedTileObjects = tiles.filter(t => selectedTiles.includes(t.id))

    let updatedTiles = [...tiles]

    if (direction === 'horizontal') {
      const sorted = [...selectedTileObjects].sort((a, b) => a.x - b.x)
      const minX = sorted[0].x
      const maxX = sorted[sorted.length - 1].x
      const spacing = (maxX - minX) / (sorted.length - 1)

      sorted.forEach((tile, index) => {
        const newX = minX + (spacing * index)
        updatedTiles = updatedTiles.map(t =>
          t.id === tile.id ? { ...t, x: Math.round(newX) } : t
        )
      })
    } else if (direction === 'vertical') {
      const sorted = [...selectedTileObjects].sort((a, b) => a.y - b.y)
      const minY = sorted[0].y
      const maxY = sorted[sorted.length - 1].y
      const spacing = (maxY - minY) / (sorted.length - 1)

      sorted.forEach((tile, index) => {
        const newY = minY + (spacing * index)
        updatedTiles = updatedTiles.map(t =>
          t.id === tile.id ? { ...t, y: Math.round(newY) } : t
        )
      })
    }

    setGameState({
      ...gameState,
      customMap: {
        ...gameState.customMap,
        tiles: updatedTiles
      }
    })
  }

  // Auto-numbering function
  const autoNumberTiles = () => {
    const tiles = gameState.customMap?.tiles || []
    const updatedTiles = tiles.map((tile, index) => ({
      ...tile,
      label: `Tile ${index + 1}`
    }))

    setGameState({
      ...gameState,
      customMap: {
        ...gameState.customMap,
        tiles: updatedTiles
      }
    })
  }

  // Export/Import functions
  const exportMap = () => {
    const mapData = {
      tiles: gameState.customMap?.tiles || [],
      backgroundImage: gameState.customMap?.backgroundImage || ''
    }

    const dataStr = JSON.stringify(mapData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)

    const link = document.createElement('a')
    link.href = url
    link.download = `map-${Date.now()}.json`
    link.click()

    URL.revokeObjectURL(url)
  }

  const importMap = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const mapData = JSON.parse(e.target.result)
          setGameState({
            ...gameState,
            customMap: {
              tiles: mapData.tiles || [],
              backgroundImage: mapData.backgroundImage || ''
            }
          })
        } catch (error) {
          alert('Error importing map: Invalid JSON file')
        }
      }
      reader.readAsText(file)
    }
  }

  // Template functions
  const saveAsTemplate = () => {
    const templates = JSON.parse(localStorage.getItem('mapTemplates') || '[]')
    const templateName = prompt('Enter template name:')
    if (!templateName) return

    const newTemplate = {
      id: Date.now(),
      name: templateName,
      tiles: gameState.customMap?.tiles || [],
      backgroundImage: gameState.customMap?.backgroundImage || ''
    }

    templates.push(newTemplate)
    localStorage.setItem('mapTemplates', JSON.stringify(templates))
    alert('Template saved!')
  }

  const loadTemplate = (templateId) => {
    const templates = JSON.parse(localStorage.getItem('mapTemplates') || '[]')
    const template = templates.find(t => t.id === templateId)

    if (template) {
      setGameState({
        ...gameState,
        customMap: {
          tiles: template.tiles,
          backgroundImage: template.backgroundImage
        }
      })
    }
  }

  const deleteTemplate = (templateId) => {
    const templates = JSON.parse(localStorage.getItem('mapTemplates') || '[]')
    const updatedTemplates = templates.filter(t => t.id !== templateId)
    localStorage.setItem('mapTemplates', JSON.stringify(updatedTemplates))
  }

  const clearMap = () => {
    if (confirm('Are you sure you want to clear the entire map?')) {
      setGameState({
        ...gameState,
        customMap: {
          tiles: [],
          backgroundImage: ''
        }
      })
      setSelectedTiles([])
    }
  }

  // Context menu functions
  const handleContextMenu = (event, tileId) => {
    event.preventDefault()
    setContextMenu({
      x: event.clientX,
      y: event.clientY,
      tileId
    })
  }

  const closeContextMenu = () => {
    setContextMenu(null)
  }

  // Bulk operations
  const bulkUpdateSize = (newSize) => {
    if (selectedTiles.length === 0) return

    setGameState({
      ...gameState,
      customMap: {
        ...gameState.customMap,
        tiles: gameState.customMap.tiles.map(t =>
          selectedTiles.includes(t.id) ? { ...t, size: newSize } : t
        )
      }
    })
  }

  const bulkUpdateShape = (newShape) => {
    if (selectedTiles.length === 0) return

    setGameState({
      ...gameState,
      customMap: {
        ...gameState.customMap,
        tiles: gameState.customMap.tiles.map(t =>
          selectedTiles.includes(t.id) ? { ...t, shape: newShape } : t
        )
      }
    })
  }

  const selectedPlayerData = gameState.players.find(p => p.id === selectedPlayer)

  return (
    <div className="game-master">
      <header className="gm-header">
        <button className="back-button" onClick={onBack}>← Back</button>
        <h1>🎯 Game Master Control</h1>

        {/* Mode Switcher */}
        <div className="gm-mode-switcher">
          <button
            className={`mode-button ${gmMode === 'setup' ? 'active' : ''}`}
            onClick={() => setGmMode('setup')}
          >
            🛠️ Setup Mode
          </button>
          <button
            className={`mode-button ${gmMode === 'playing' ? 'active' : ''}`}
            onClick={() => setGmMode('playing')}
          >
            🎮 Playing Mode
          </button>
        </div>
      </header>

      <div className="gm-content">
        {/* SETUP MODE */}
        {gmMode === 'setup' && (
          <>
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
              {/* Compact Toolbar */}
              <div className="map-editor-toolbar">
                <div className="toolbar-group">
                  <span className="toolbar-label">View:</span>
                  <button onClick={zoomOut} title="Zoom Out">-</button>
                  <span className="zoom-display">{Math.round(canvasZoom * 100)}%</span>
                  <button onClick={zoomIn} title="Zoom In">+</button>
                  <button onClick={resetZoom}>Reset</button>
                </div>

                <div className="toolbar-group">
                  <span className="toolbar-label">Edit:</span>
                  <button onClick={copySelectedTiles} disabled={selectedTiles.length === 0} title="Copy">📋</button>
                  <button onClick={pasteCopiedTiles} disabled={copiedTiles.length === 0} title="Paste">📄</button>
                  <button onClick={duplicateSelectedTiles} disabled={selectedTiles.length === 0} title="Duplicate">⎘</button>
                  <button onClick={selectAllTiles} title="Select All">☑</button>
                  <button onClick={deselectAllTiles} disabled={selectedTiles.length === 0} title="Deselect">☐</button>
                </div>

                <div className="toolbar-group">
                  <span className="toolbar-label">Align:</span>
                  <button onClick={() => alignTiles('left')} disabled={selectedTiles.length < 2} title="Align Left">⬅</button>
                  <button onClick={() => alignTiles('center-h')} disabled={selectedTiles.length < 2} title="Center H">↔</button>
                  <button onClick={() => alignTiles('right')} disabled={selectedTiles.length < 2} title="Align Right">➡</button>
                  <button onClick={() => alignTiles('top')} disabled={selectedTiles.length < 2} title="Align Top">⬆</button>
                  <button onClick={() => alignTiles('center-v')} disabled={selectedTiles.length < 2} title="Center V">↕</button>
                  <button onClick={() => alignTiles('bottom')} disabled={selectedTiles.length < 2} title="Align Bottom">⬇</button>
                </div>

                <div className="toolbar-group">
                  <span className="toolbar-label">Distribute:</span>
                  <button onClick={() => distributeTiles('horizontal')} disabled={selectedTiles.length < 3} title="Distribute H">↔️</button>
                  <button onClick={() => distributeTiles('vertical')} disabled={selectedTiles.length < 3} title="Distribute V">↕️</button>
                </div>

                <div className="toolbar-group">
                  <span className="toolbar-label">Tools:</span>
                  <button onClick={autoNumberTiles} title="Auto-number">🔢</button>
                  <button onClick={exportMap} title="Export">💾</button>
                  <label className="file-button-compact" title="Import">
                    📁
                    <input type="file" accept=".json" onChange={importMap} style={{ display: 'none' }} />
                  </label>
                  <button onClick={saveAsTemplate} title="Save Template">⭐</button>
                  <button onClick={clearMap} className="danger-button" title="Clear Map">🗑️</button>
                </div>

                <div className="toolbar-stats">
                  <span>Tiles: {(gameState.customMap?.tiles || []).length}</span>
                  <span>Selected: {selectedTiles.length}</span>
                  {copiedTiles.length > 0 && <span>Clipboard: {copiedTiles.length}</span>}
                </div>
              </div>

              {/* Editor Layout: Canvas + Sidebar */}
              <div className="map-editor-layout">
                {/* Main Canvas Area */}
                <div className="map-editor-canvas-area">
                  <div
                    className="map-canvas-container"
                    onClick={closeContextMenu}
                  >
                    <div
                      className="map-canvas"
                      onClick={addTile}
                      style={{
                        backgroundImage: gameState.customMap?.backgroundImage
                          ? `url(${gameState.customMap.backgroundImage})`
                          : 'none',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        transform: `scale(${canvasZoom}) translate(${canvasPan.x}px, ${canvasPan.y}px)`
                      }}
                    >
                      {/* Render connections */}
                      <svg className="connections-layer" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
                        {(gameState.customMap?.tiles || []).map(tile =>
                          (tile.connections || []).map(connId => {
                            const connTile = (gameState.customMap?.tiles || []).find(t => t.id === connId)
                            if (!connTile) return null
                            return (
                              <line
                                key={`${tile.id}-${connId}`}
                                x1={`${tile.x}%`}
                                y1={`${tile.y}%`}
                                x2={`${connTile.x}%`}
                                y2={`${connTile.y}%`}
                                stroke="#6C63FF"
                                strokeWidth="3"
                                strokeDasharray="5,5"
                                opacity="0.6"
                              />
                            )
                          })
                        )}
                      </svg>

                      {/* Render tiles */}
                      {(gameState.customMap?.tiles || [])
                        .filter(tile => !tileFilter || tile.label.toLowerCase().includes(tileFilter.toLowerCase()))
                        .map(tile => (
                          <div
                            key={tile.id}
                            className={`custom-tile ${selectedTiles.includes(tile.id) ? 'selected' : ''} ${tile.locked ? 'locked' : ''} shape-${tile.shape || 'circle'}`}
                            style={{
                              left: `${tile.x}%`,
                              top: `${tile.y}%`,
                              width: `${tile.size || 80}px`,
                              height: `${tile.size || 80}px`,
                              background: tile.color || undefined,
                              transform: `translate(-50%, -50%) rotate(${tile.rotation || 0}deg) ${tile.shape === 'diamond' ? 'rotate(45deg)' : ''}`
                            }}
                            onClick={(e) => toggleTileSelection(tile.id, e)}
                            onDoubleClick={(e) => {
                              e.stopPropagation()
                              if (!tile.locked) moveTile(tile.id, e)
                            }}
                            onContextMenu={(e) => handleContextMenu(e, tile.id)}
                          >
                            <div className="tile-label" style={{ transform: `rotate(-${tile.rotation || 0}deg) ${tile.shape === 'diamond' ? 'rotate(-45deg)' : ''}` }}>
                              {tile.label}
                            </div>
                            {tile.locked && <div className="lock-indicator">🔒</div>}
                          </div>
                        ))}

                      {(gameState.customMap?.tiles || []).length === 0 && (
                        <div className="empty-canvas">
                          <p>Click to add tiles</p>
                          <p className="hint-small">Shift+Click • Double-click • Right-click</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Sidebar Properties Panel */}
                <div className="map-editor-sidebar">
                  {/* Search */}
                  <div className="sidebar-section">
                    <input
                      type="text"
                      value={tileFilter}
                      onChange={(e) => setTileFilter(e.target.value)}
                      placeholder="🔍 Search..."
                      className="sidebar-search"
                    />
                  </div>

                  {/* Tile Properties - Continue inside sidebar */}
                  {selectedTiles.length > 0 && (
                    <div className="sidebar-section">
                      <h4 className="sidebar-title">
                        {selectedTiles.length === 1 ? '✏️ Edit Tile' : `✏️ ${selectedTiles.length} Tiles`}
                      </h4>

                      {selectedTiles.length === 1 && (() => {
                        const tile = gameState.customMap.tiles.find(t => t.id === selectedTiles[0])
                        return (
                          <>
                            <div className="input-group-compact">
                              <label>Label:</label>
                              <input
                                type="text"
                                value={tile?.label || ''}
                                onChange={(e) => updateTileLabel(selectedTiles[0], e.target.value)}
                              />
                            </div>
                            <div className="input-group-compact">
                              <label>Size: {tile?.size || 80}px</label>
                              <input
                                type="range"
                                min="40"
                                max="200"
                                value={tile?.size || 80}
                                onChange={(e) => updateTileSize(selectedTiles[0], parseInt(e.target.value))}
                              />
                            </div>
                            <div className="input-group-compact">
                              <label>Shape:</label>
                              <select
                                value={tile?.shape || 'circle'}
                                onChange={(e) => updateTileShape(selectedTiles[0], e.target.value)}
                              >
                                <option value="circle">● Circle</option>
                                <option value="square">■ Square</option>
                                <option value="diamond">◆ Diamond</option>
                                <option value="hexagon">⬡ Hexagon</option>
                                <option value="star">★ Star</option>
                              </select>
                            </div>
                            <div className="input-group-compact">
                              <label>Color:</label>
                              <div className="color-control">
                                <input
                                  type="color"
                                  value={tile?.color || '#6C63FF'}
                                  onChange={(e) => updateTileColor(selectedTiles[0], e.target.value)}
                                />
                                <button onClick={() => updateTileColor(selectedTiles[0], null)} className="small">Reset</button>
                              </div>
                            </div>
                            <div className="input-group-compact">
                              <label>Rotation: {tile?.rotation || 0}°</label>
                              <input
                                type="range"
                                min="0"
                                max="360"
                                value={tile?.rotation || 0}
                                onChange={(e) => updateTileRotation(selectedTiles[0], parseInt(e.target.value))}
                              />
                            </div>
                            <div className="input-group-compact">
                              <label>Connections:</label>
                              <select
                                onChange={(e) => {
                                  if (e.target.value) {
                                    toggleConnection(selectedTiles[0], parseInt(e.target.value))
                                    e.target.value = ''
                                  }
                                }}
                              >
                                <option value="">Toggle...</option>
                                {(gameState.customMap?.tiles || [])
                                  .filter(t => t.id !== selectedTiles[0])
                                  .map(t => (
                                    <option key={t.id} value={t.id}>
                                      {(tile?.connections || []).includes(t.id) ? '✓ ' : ''}
                                      {t.label}
                                    </option>
                                  ))}
                              </select>
                            </div>
                            <div className="sidebar-buttons">
                              <button onClick={() => toggleTileLock(selectedTiles[0])} className="small">
                                {tile?.locked ? '🔓' : '🔒'}
                              </button>
                              <button className="danger-button small" onClick={() => deleteTile(selectedTiles[0])}>
                                Delete
                              </button>
                            </div>
                          </>
                        )
                      })()}

                      {selectedTiles.length > 1 && (
                        <>
                          <p className="sidebar-hint">Bulk editing</p>
                          <div className="input-group-compact">
                            <label>Size:</label>
                            <input
                              type="range"
                              min="40"
                              max="200"
                              onChange={(e) => bulkUpdateSize(parseInt(e.target.value))}
                            />
                          </div>
                          <div className="input-group-compact">
                            <label>Shape:</label>
                            <select onChange={(e) => bulkUpdateShape(e.target.value)}>
                              <option value="">Choose...</option>
                              <option value="circle">● Circle</option>
                              <option value="square">■ Square</option>
                              <option value="diamond">◆ Diamond</option>
                              <option value="hexagon">⬡ Hexagon</option>
                              <option value="star">★ Star</option>
                            </select>
                          </div>
                          <div className="input-group-compact">
                            <label>Color:</label>
                            <div className="color-control">
                              <input
                                type="color"
                                onChange={(e) => updateTileColor(null, e.target.value)}
                              />
                              <button onClick={() => updateTileColor(null, null)} className="small">Reset</button>
                            </div>
                          </div>
                          <div className="sidebar-buttons">
                            <button onClick={() => toggleTileLock(null)} className="small">Lock</button>
                            <button className="danger-button small" onClick={deleteSelectedTiles}>Delete</button>
                          </div>
                        </>
                      )}
                    </div>
                  )}

                  {/* Background */}
                  <div className="sidebar-section">
                    <h4 className="sidebar-title">🖼️ Background</h4>
                    <div className="input-group-compact">
                      <input
                        type="text"
                        value={gameState.customMap?.backgroundImage || ''}
                        onChange={(e) => setBackgroundImage(e.target.value)}
                        placeholder="Image URL..."
                      />
                    </div>
                    <div className="input-group-compact">
                      <label className="file-upload-label">
                        📁 Upload
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          style={{ display: 'none' }}
                        />
                      </label>
                    </div>
                    {gameState.customMap?.backgroundImage && (
                      <button
                        className="danger-button small full-width"
                        onClick={() => setBackgroundImage('')}
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  {/* Templates */}
                  <div className="sidebar-section">
                    <h4 className="sidebar-title">📚 Templates</h4>
                    <div className="template-list-compact">
                      {JSON.parse(localStorage.getItem('mapTemplates') || '[]').map(template => (
                        <div key={template.id} className="template-item-compact">
                          <span className="template-name">{template.name}</span>
                          <button onClick={() => loadTemplate(template.id)} className="icon-btn" title="Load">📂</button>
                          <button onClick={() => deleteTemplate(template.id)} className="icon-btn danger" title="Delete">×</button>
                        </div>
                      ))}
                      {JSON.parse(localStorage.getItem('mapTemplates') || '[]').length === 0 && (
                        <p className="sidebar-hint">No templates</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Context Menu */}
              {contextMenu && (
                <div
                  className="context-menu"
                  style={{ left: contextMenu.x, top: contextMenu.y }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <button onClick={() => { copySelectedTiles(); closeContextMenu(); }}>Copy</button>
                  <button onClick={() => { duplicateSelectedTiles(); closeContextMenu(); }}>Duplicate</button>
                  <button onClick={() => { toggleTileLock(contextMenu.tileId); closeContextMenu(); }}>
                    {(gameState.customMap?.tiles || []).find(t => t.id === contextMenu.tileId)?.locked ? 'Unlock' : 'Lock'}
                  </button>
                  <button onClick={() => { deleteTile(contextMenu.tileId); closeContextMenu(); }} className="danger-button">Delete</button>
                </div>
              )}
            </>
          )}

          {gameState.mapMode === 'grid' && (
            <p className="hint">Grid mode uses the classic 5x5 grid layout</p>
          )}
        </section>
          </>
        )}

        {/* PLAYING MODE */}
        {gmMode === 'playing' && (
          <>
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
          </>
        )}
      </div>
    </div>
  )
}

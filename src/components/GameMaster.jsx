import { useState } from 'react'
import './GameMaster.css'

export default function GameMaster({ gameState, setGameState, onBack }) {
  // GM Mode: 'setup' or 'playing'
  const [gmMode, setGmMode] = useState('setup')

  const [newPlayerName, setNewPlayerName] = useState('')
  const [newPlayerAvatar, setNewPlayerAvatar] = useState('')
  const [newEventTitle, setNewEventTitle] = useState('')
  const [newEventDescription, setNewEventDescription] = useState('')
  const [editingPlayer, setEditingPlayer] = useState(null)
  const [editingPlayerAvatar, setEditingPlayerAvatar] = useState(null)
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

  // Battle wheel state
  const [battleSceneName, setBattleSceneName] = useState('')
  const [battlePlayer1, setBattlePlayer1] = useState('')
  const [battlePlayer2, setBattlePlayer2] = useState('')

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

  // Theme presets
  const themePresets = {
    default: {
      name: '🌟 Default',
      colors: {
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
      }
    },
    ocean: {
      name: '🌊 Ocean',
      colors: {
        primaryColor: '#4A90E2',
        secondaryColor: '#50E3C2',
        successColor: '#7ED321',
        warningColor: '#F5A623',
        dangerColor: '#D0021B',
        bgDark: '#0A1E3D',
        bgMedium: '#1E3A5F',
        bgLight: '#2A5283',
        textPrimary: '#FFFFFF',
        textSecondary: '#A5D8FF'
      }
    },
    sunset: {
      name: '🌅 Sunset',
      colors: {
        primaryColor: '#FF6B6B',
        secondaryColor: '#FFD93D',
        successColor: '#6BCF7F',
        warningColor: '#FFA834',
        dangerColor: '#E63946',
        bgDark: '#2D1B2E',
        bgMedium: '#4A2A3D',
        bgLight: '#6B3F52',
        textPrimary: '#FFF5E6',
        textSecondary: '#FFD7C4'
      }
    },
    forest: {
      name: '🌲 Forest',
      colors: {
        primaryColor: '#52B788',
        secondaryColor: '#95D5B2',
        successColor: '#74C69D',
        warningColor: '#F4A261',
        dangerColor: '#E76F51',
        bgDark: '#1B4332',
        bgMedium: '#2D6A4F',
        bgLight: '#40916C',
        textPrimary: '#F1FAEE',
        textSecondary: '#B7E4C7'
      }
    },
    neon: {
      name: '⚡ Neon',
      colors: {
        primaryColor: '#FF10F0',
        secondaryColor: '#00F5FF',
        successColor: '#39FF14',
        warningColor: '#FFFF00',
        dangerColor: '#FF073A',
        bgDark: '#0D0221',
        bgMedium: '#1A0F2E',
        bgLight: '#2E1F47',
        textPrimary: '#FFFFFF',
        textSecondary: '#C77DFF'
      }
    },
    royal: {
      name: '👑 Royal',
      colors: {
        primaryColor: '#7B2CBF',
        secondaryColor: '#C77DFF',
        successColor: '#06D6A0',
        warningColor: '#FFD60A',
        dangerColor: '#EF476F',
        bgDark: '#240046',
        bgMedium: '#3C096C',
        bgLight: '#5A189A',
        textPrimary: '#FFFFFF',
        textSecondary: '#E0AAFF'
      }
    }
  }

  const applyThemePreset = (presetKey) => {
    const preset = themePresets[presetKey]
    if (preset) {
      setGameState({
        ...gameState,
        colorScheme: preset.colors,
        theme: presetKey
      })
    }
  }

  const updateColor = (colorKey, value) => {
    setGameState({
      ...gameState,
      colorScheme: {
        ...gameState.colorScheme,
        [colorKey]: value
      }
    })
  }

  const addPlayer = () => {
    if (newPlayerName.trim()) {
      setGameState({
        ...gameState,
        players: [
          ...gameState.players,
          {
            id: Date.now(),
            name: newPlayerName,
            avatar: newPlayerAvatar.trim() || null,
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
      setNewPlayerAvatar('')
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

  const updatePlayerAvatar = (playerId, avatarUrl) => {
    setGameState({
      ...gameState,
      players: gameState.players.map(p =>
        p.id === playerId ? { ...p, avatar: avatarUrl.trim() || null } : p
      )
    })
    setEditingPlayerAvatar(null)
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

  const saveBattleWheelScene = () => {
    if (battleSceneName.trim() && battlePlayer1 && battlePlayer2) {
      const player1Data = gameState.players.find(p => p.id === battlePlayer1)
      const player2Data = gameState.players.find(p => p.id === battlePlayer2)

      if (!player1Data || !player2Data) return

      const power1 = player1Data.stats?.power || 50
      const power2 = player2Data.stats?.power || 50
      const totalPower = power1 + power2

      const player1Percentage = totalPower > 0 ? Math.round((power1 / totalPower) * 100) : 50
      const player2Percentage = 100 - player1Percentage

      setGameState({
        ...gameState,
        customScenes: [
          ...gameState.customScenes,
          {
            id: Date.now(),
            name: battleSceneName,
            type: 'wheel',
            subtype: 'battle',
            data: {
              outcomes: [
                {
                  id: Date.now(),
                  name: `${player1Data.name} Wins`,
                  percentage: player1Percentage
                },
                {
                  id: Date.now() + 1,
                  name: `${player2Data.name} Wins`,
                  percentage: player2Percentage
                }
              ],
              battleInfo: {
                player1: { id: player1Data.id, name: player1Data.name, power: power1 },
                player2: { id: player2Data.id, name: player2Data.name, power: power2 }
              }
            }
          }
        ]
      })
      setBattleSceneName('')
      setBattlePlayer1('')
      setBattlePlayer2('')
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

  const activateScene = (type) => {
    setGameState({
      ...gameState,
      currentScene: { type, data: {} }
    })
  }

  const activateSceneById = (sceneId) => {
    const scene = gameState.customScenes?.find(s => s.id === sceneId)
    if (scene) {
      setGameState({
        ...gameState,
        currentScene: { id: sceneId, type: scene.type, data: scene.data }
      })
    }
  }

  // Standard shop items library
  const standardShopItems = [
    { name: '🛡️ Immunity Idol', price: 150, description: 'Protects you from one elimination' },
    { name: '🗳️ Extra Vote', price: 100, description: 'Cast an additional vote at tribal council' },
    { name: '🔍 Spy Glass', price: 80, description: 'Learn who another player is voting for' },
    { name: '⚔️ Vote Steal', price: 120, description: 'Steal another player\'s vote' },
    { name: '🚫 Vote Blocker', price: 90, description: 'Prevent one player from voting' },
    { name: '🎯 Nullifier', price: 130, description: 'Cancel someone\'s hidden immunity idol' },
    { name: '💎 Legacy Advantage', price: 110, description: 'Pass immunity to another player if eliminated' },
    { name: '🎲 Shot in the Dark', price: 60, description: '50% chance of safety, lose your vote' },
    { name: '👁️ Knowledge is Power', price: 95, description: 'Steal an advantage from another player' },
    { name: '🔐 Safety Shield', price: 70, description: 'One-time protection from being targeted' },
    { name: '🎪 Challenge Advantage', price: 85, description: 'Start next challenge with a head start' },
    { name: '🗝️ Secret Key', price: 50, description: 'Unlock a hidden advantage clue' },
    { name: '⏰ Time Warp', price: 75, description: 'Rewind and change your last decision' },
    { name: '🎭 Disguise Kit', price: 65, description: 'Vote anonymously at next tribal council' },
    { name: '💰 Bank Heist', price: 45, description: 'Steal 50 gold from another player' },
    { name: '🔮 Fortune Teller', price: 55, description: 'Preview the next challenge type' },
    { name: '⚡ Power Boost', price: 40, description: 'Gain +20 power for next challenge' },
    { name: '🎁 Mystery Box', price: 30, description: 'Random item or advantage' },
    { name: '🏃 Quick Feet', price: 35, description: 'Move twice in one turn' },
    { name: '🧲 Magnet', price: 50, description: 'Steal a random item from another player' }
  ]

  const addStandardShopItems = () => {
    const newItems = standardShopItems.map((item, index) => ({
      id: Date.now() + index,
      name: item.name,
      price: item.price,
      description: item.description
    }))

    setGameState({
      ...gameState,
      shopItems: [...(gameState.shopItems || []), ...newItems]
    })
  }

  // Example Map Templates
  const exampleMapTemplates = [
    {
      id: 'tribal-council',
      name: '🔥 Tribal Council Circle',
      description: '12 seats in a circle',
      tiles: [
        { id: 1, x: 50, y: 10, size: 40, shape: 'circle', color: '#FF6B6B', label: '1', rotation: 0 },
        { id: 2, x: 75, y: 18, size: 40, shape: 'circle', color: '#FF6B6B', label: '2', rotation: 0 },
        { id: 3, x: 90, y: 35, size: 40, shape: 'circle', color: '#FF6B6B', label: '3', rotation: 0 },
        { id: 4, x: 90, y: 60, size: 40, shape: 'circle', color: '#FF6B6B', label: '4', rotation: 0 },
        { id: 5, x: 75, y: 77, size: 40, shape: 'circle', color: '#FF6B6B', label: '5', rotation: 0 },
        { id: 6, x: 50, y: 85, size: 40, shape: 'circle', color: '#FF6B6B', label: '6', rotation: 0 },
        { id: 7, x: 25, y: 77, size: 40, shape: 'circle', color: '#FF6B6B', label: '7', rotation: 0 },
        { id: 8, x: 10, y: 60, size: 40, shape: 'circle', color: '#FF6B6B', label: '8', rotation: 0 },
        { id: 9, x: 10, y: 35, size: 40, shape: 'circle', color: '#FF6B6B', label: '9', rotation: 0 },
        { id: 10, x: 25, y: 18, size: 40, shape: 'circle', color: '#FF6B6B', label: '10', rotation: 0 },
        { id: 11, x: 50, y: 47, size: 50, shape: 'star', color: '#FFD700', label: '🔥', rotation: 0 }
      ]
    },
    {
      id: 'linear-race',
      name: '🏁 Linear Race Track',
      description: '20-space path to finish',
      tiles: Array.from({ length: 20 }, (_, i) => ({
        id: i + 1,
        x: 10 + (i % 10) * 9,
        y: i < 10 ? 25 : 65,
        size: 35,
        shape: i === 0 ? 'star' : i === 19 ? 'hexagon' : 'circle',
        color: i === 0 ? '#4ECDC4' : i === 19 ? '#FFD700' : '#98D8C8',
        label: String(i + 1),
        rotation: 0,
        connections: i < 19 ? [i + 2] : []
      }))
    },
    {
      id: 'island-hopping',
      name: '🏝️ Island Hopping',
      description: '8 islands, multiple paths',
      tiles: [
        { id: 1, x: 15, y: 20, size: 50, shape: 'hexagon', color: '#4ECDC4', label: 'Start', rotation: 0, connections: [2, 3] },
        { id: 2, x: 35, y: 15, size: 45, shape: 'circle', color: '#98D8C8', label: '2', rotation: 0, connections: [4] },
        { id: 3, x: 35, y: 45, size: 45, shape: 'circle', color: '#98D8C8', label: '3', rotation: 0, connections: [4, 5] },
        { id: 4, x: 55, y: 20, size: 45, shape: 'circle', color: '#98D8C8', label: '4', rotation: 0, connections: [6] },
        { id: 5, x: 55, y: 50, size: 45, shape: 'circle', color: '#98D8C8', label: '5', rotation: 0, connections: [6, 7] },
        { id: 6, x: 75, y: 25, size: 45, shape: 'circle', color: '#98D8C8', label: '6', rotation: 0, connections: [8] },
        { id: 7, x: 75, y: 55, size: 45, shape: 'circle', color: '#98D8C8', label: '7', rotation: 0, connections: [8] },
        { id: 8, x: 90, y: 40, size: 50, shape: 'star', color: '#FFD700', label: 'End', rotation: 0 }
      ]
    },
    {
      id: 'hub-spoke',
      name: '⭐ Hub and Spokes',
      description: 'Central hub, 6 paths',
      tiles: [
        { id: 1, x: 50, y: 47, size: 60, shape: 'hexagon', color: '#FFD700', label: 'Hub', rotation: 0, connections: [2, 3, 4, 5, 6, 7] },
        { id: 2, x: 50, y: 10, size: 45, shape: 'circle', color: '#FF6B6B', label: 'N', rotation: 0 },
        { id: 3, x: 80, y: 22, size: 45, shape: 'circle', color: '#4ECDC4', label: 'NE', rotation: 0 },
        { id: 4, x: 80, y: 72, size: 45, shape: 'circle', color: '#98D8C8', label: 'SE', rotation: 0 },
        { id: 5, x: 50, y: 84, size: 45, shape: 'circle', color: '#F7DC6F', label: 'S', rotation: 0 },
        { id: 6, x: 20, y: 72, size: 45, shape: 'circle', color: '#BB8FCE', label: 'SW', rotation: 0 },
        { id: 7, x: 20, y: 22, size: 45, shape: 'circle', color: '#85C1E2', label: 'NW', rotation: 0 }
      ]
    },
    {
      id: 'challenge-arena',
      name: '⚔️ Challenge Arena',
      description: '4 teams, central zone',
      tiles: [
        { id: 1, x: 15, y: 15, size: 50, shape: 'hexagon', color: '#FF6B6B', label: 'Red', rotation: 0, connections: [5] },
        { id: 2, x: 85, y: 15, size: 50, shape: 'hexagon', color: '#4ECDC4', label: 'Blue', rotation: 0, connections: [5] },
        { id: 3, x: 15, y: 75, size: 50, shape: 'hexagon', color: '#F7DC6F', label: 'Yellow', rotation: 0, connections: [5] },
        { id: 4, x: 85, y: 75, size: 50, shape: 'hexagon', color: '#98D8C8', label: 'Green', rotation: 0, connections: [5] },
        { id: 5, x: 50, y: 45, size: 70, shape: 'star', color: '#FFD700', label: 'Arena', rotation: 0 }
      ]
    },
    {
      id: 'spiral-path',
      name: '🌀 Spiral Journey',
      description: '16 spaces to center',
      tiles: [
        { id: 1, x: 10, y: 10, size: 35, shape: 'circle', color: '#4ECDC4', label: '1', rotation: 0, connections: [2] },
        { id: 2, x: 30, y: 10, size: 35, shape: 'circle', color: '#98D8C8', label: '2', rotation: 0, connections: [3] },
        { id: 3, x: 50, y: 10, size: 35, shape: 'circle', color: '#98D8C8', label: '3', rotation: 0, connections: [4] },
        { id: 4, x: 70, y: 10, size: 35, shape: 'circle', color: '#98D8C8', label: '4', rotation: 0, connections: [5] },
        { id: 5, x: 90, y: 10, size: 35, shape: 'circle', color: '#98D8C8', label: '5', rotation: 0, connections: [6] },
        { id: 6, x: 90, y: 30, size: 35, shape: 'circle', color: '#98D8C8', label: '6', rotation: 0, connections: [7] },
        { id: 7, x: 90, y: 50, size: 35, shape: 'circle', color: '#98D8C8', label: '7', rotation: 0, connections: [8] },
        { id: 8, x: 90, y: 70, size: 35, shape: 'circle', color: '#98D8C8', label: '8', rotation: 0, connections: [9] },
        { id: 9, x: 90, y: 90, size: 35, shape: 'circle', color: '#98D8C8', label: '9', rotation: 0, connections: [10] },
        { id: 10, x: 70, y: 90, size: 35, shape: 'circle', color: '#98D8C8', label: '10', rotation: 0, connections: [11] },
        { id: 11, x: 50, y: 90, size: 35, shape: 'circle', color: '#98D8C8', label: '11', rotation: 0, connections: [12] },
        { id: 12, x: 30, y: 90, size: 35, shape: 'circle', color: '#98D8C8', label: '12', rotation: 0, connections: [13] },
        { id: 13, x: 10, y: 90, size: 35, shape: 'circle', color: '#98D8C8', label: '13', rotation: 0, connections: [14] },
        { id: 14, x: 10, y: 70, size: 35, shape: 'circle', color: '#98D8C8', label: '14', rotation: 0, connections: [15] },
        { id: 15, x: 10, y: 50, size: 35, shape: 'circle', color: '#98D8C8', label: '15', rotation: 0, connections: [16] },
        { id: 16, x: 10, y: 30, size: 35, shape: 'circle', color: '#98D8C8', label: '16', rotation: 0, connections: [17] },
        { id: 17, x: 50, y: 50, size: 45, shape: 'star', color: '#FFD700', label: '🏆', rotation: 0 }
      ]
    },
    {
      id: 'grid-board',
      name: '📐 Classic 4x4 Board',
      description: '16-space grid layout',
      tiles: Array.from({ length: 16 }, (_, i) => ({
        id: i + 1,
        x: 15 + (i % 4) * 25,
        y: 15 + Math.floor(i / 4) * 25,
        size: 40,
        shape: i === 0 ? 'star' : i === 15 ? 'hexagon' : 'square',
        color: i === 0 ? '#4ECDC4' : i === 15 ? '#FFD700' : (i % 2 === Math.floor(i / 4) % 2 ? '#98D8C8' : '#85C1E2'),
        label: String(i + 1),
        rotation: 45
      }))
    },
    {
      id: 'crossroads',
      name: '✖️ The Crossroads',
      description: 'Intersecting paths',
      tiles: [
        { id: 1, x: 10, y: 47, size: 45, shape: 'circle', color: '#4ECDC4', label: 'W', rotation: 0, connections: [5] },
        { id: 2, x: 90, y: 47, size: 45, shape: 'circle', color: '#4ECDC4', label: 'E', rotation: 0, connections: [5] },
        { id: 3, x: 50, y: 10, size: 45, shape: 'circle', color: '#4ECDC4', label: 'N', rotation: 0, connections: [5] },
        { id: 4, x: 50, y: 84, size: 45, shape: 'circle', color: '#4ECDC4', label: 'S', rotation: 0, connections: [5] },
        { id: 5, x: 50, y: 47, size: 60, shape: 'star', color: '#FFD700', label: 'Center', rotation: 0, connections: [6, 7, 8, 9] },
        { id: 6, x: 25, y: 25, size: 40, shape: 'hexagon', color: '#FF6B6B', label: 'NW', rotation: 0 },
        { id: 7, x: 75, y: 25, size: 40, shape: 'hexagon', color: '#98D8C8', label: 'NE', rotation: 0 },
        { id: 8, x: 75, y: 69, size: 40, shape: 'hexagon', color: '#F7DC6F', label: 'SE', rotation: 0 },
        { id: 9, x: 25, y: 69, size: 40, shape: 'hexagon', color: '#BB8FCE', label: 'SW', rotation: 0 }
      ]
    }
  ]

  const clearShop = () => {
    if (confirm('Clear all shop items?')) {
      setGameState({
        ...gameState,
        shopItems: []
      })
    }
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

  const handleImageSceneUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setImageUrl(e.target.result)
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

  const loadExampleTemplate = (templateId) => {
    const template = exampleMapTemplates.find(t => t.id === templateId)

    if (template) {
      setGameState({
        ...gameState,
        customMap: {
          tiles: template.tiles.map(tile => ({
            ...tile,
            id: Date.now() + Math.random() // Generate unique IDs
          })),
          backgroundImage: template.backgroundImage || ''
        }
      })
      setSelectedTiles([])
    }
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

        <section className="section theme-customization">
          <h2>🎨 Color Scheme</h2>

          {/* Preset Themes */}
          <div className="theme-presets">
            <h3>Quick Themes</h3>
            <div className="preset-buttons">
              {Object.entries(themePresets).map(([key, preset]) => (
                <button
                  key={key}
                  className={`preset-button ${gameState.theme === key ? 'active' : ''}`}
                  onClick={() => applyThemePreset(key)}
                  style={{
                    background: `linear-gradient(135deg, ${preset.colors.primaryColor}, ${preset.colors.secondaryColor})`
                  }}
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Colors */}
          <div className="custom-colors">
            <h3>Custom Colors</h3>
            <div className="color-grid">
              <div className="color-picker-group">
                <label>Primary Color:</label>
                <div className="color-input-wrapper">
                  <input
                    type="color"
                    value={gameState.colorScheme?.primaryColor || '#6C63FF'}
                    onChange={(e) => updateColor('primaryColor', e.target.value)}
                  />
                  <input
                    type="text"
                    value={gameState.colorScheme?.primaryColor || '#6C63FF'}
                    onChange={(e) => updateColor('primaryColor', e.target.value)}
                    placeholder="#6C63FF"
                  />
                </div>
              </div>

              <div className="color-picker-group">
                <label>Secondary Color:</label>
                <div className="color-input-wrapper">
                  <input
                    type="color"
                    value={gameState.colorScheme?.secondaryColor || '#FF6B6B'}
                    onChange={(e) => updateColor('secondaryColor', e.target.value)}
                  />
                  <input
                    type="text"
                    value={gameState.colorScheme?.secondaryColor || '#FF6B6B'}
                    onChange={(e) => updateColor('secondaryColor', e.target.value)}
                    placeholder="#FF6B6B"
                  />
                </div>
              </div>

              <div className="color-picker-group">
                <label>Success Color:</label>
                <div className="color-input-wrapper">
                  <input
                    type="color"
                    value={gameState.colorScheme?.successColor || '#51CF66'}
                    onChange={(e) => updateColor('successColor', e.target.value)}
                  />
                  <input
                    type="text"
                    value={gameState.colorScheme?.successColor || '#51CF66'}
                    onChange={(e) => updateColor('successColor', e.target.value)}
                    placeholder="#51CF66"
                  />
                </div>
              </div>

              <div className="color-picker-group">
                <label>Warning Color:</label>
                <div className="color-input-wrapper">
                  <input
                    type="color"
                    value={gameState.colorScheme?.warningColor || '#FFA94D'}
                    onChange={(e) => updateColor('warningColor', e.target.value)}
                  />
                  <input
                    type="text"
                    value={gameState.colorScheme?.warningColor || '#FFA94D'}
                    onChange={(e) => updateColor('warningColor', e.target.value)}
                    placeholder="#FFA94D"
                  />
                </div>
              </div>

              <div className="color-picker-group">
                <label>Background Dark:</label>
                <div className="color-input-wrapper">
                  <input
                    type="color"
                    value={gameState.colorScheme?.bgDark || '#1A1A2E'}
                    onChange={(e) => updateColor('bgDark', e.target.value)}
                  />
                  <input
                    type="text"
                    value={gameState.colorScheme?.bgDark || '#1A1A2E'}
                    onChange={(e) => updateColor('bgDark', e.target.value)}
                    placeholder="#1A1A2E"
                  />
                </div>
              </div>

              <div className="color-picker-group">
                <label>Background Medium:</label>
                <div className="color-input-wrapper">
                  <input
                    type="color"
                    value={gameState.colorScheme?.bgMedium || '#16213E'}
                    onChange={(e) => updateColor('bgMedium', e.target.value)}
                  />
                  <input
                    type="text"
                    value={gameState.colorScheme?.bgMedium || '#16213E'}
                    onChange={(e) => updateColor('bgMedium', e.target.value)}
                    placeholder="#16213E"
                  />
                </div>
              </div>

              <div className="color-picker-group">
                <label>Background Light:</label>
                <div className="color-input-wrapper">
                  <input
                    type="color"
                    value={gameState.colorScheme?.bgLight || '#0F3460'}
                    onChange={(e) => updateColor('bgLight', e.target.value)}
                  />
                  <input
                    type="text"
                    value={gameState.colorScheme?.bgLight || '#0F3460'}
                    onChange={(e) => updateColor('bgLight', e.target.value)}
                    placeholder="#0F3460"
                  />
                </div>
              </div>

              <div className="color-picker-group">
                <label>Text Primary:</label>
                <div className="color-input-wrapper">
                  <input
                    type="color"
                    value={gameState.colorScheme?.textPrimary || '#FFFFFF'}
                    onChange={(e) => updateColor('textPrimary', e.target.value)}
                  />
                  <input
                    type="text"
                    value={gameState.colorScheme?.textPrimary || '#FFFFFF'}
                    onChange={(e) => updateColor('textPrimary', e.target.value)}
                    placeholder="#FFFFFF"
                  />
                </div>
              </div>
            </div>
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

            <div className="shop-quick-actions">
              <button
                className="secondary-button"
                onClick={addStandardShopItems}
                title="Add 20 pre-made items with unique icons"
              >
                ✨ Add Standard Items
              </button>
              <button
                className="danger-button small"
                onClick={clearShop}
              >
                🗑️ Clear All
              </button>
            </div>

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
                <div key={item.id} className="shop-item-chip" title={item.description || ''}>
                  <span className="shop-item-content">
                    <span className="shop-item-name-price">{item.name} - 💰{item.price}</span>
                    {item.description && <span className="shop-item-desc">{item.description}</span>}
                  </span>
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
            <div className="input-group">
              <label className="file-upload-label">
                📁 Upload Image from Device
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageSceneUpload}
                  style={{ display: 'none' }}
                />
              </label>
            </div>
            {imageUrl && (
              <div className="image-preview">
                <img src={imageUrl} alt="Preview" style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px' }} />
              </div>
            )}
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

          {/* Battle Wheel Scene */}
          <div className="scene-editor battle-wheel-editor">
            <h3>⚔️ Create Battle Wheel</h3>
            <p className="scene-description">Create a wheel that compares two players' power levels</p>
            <div className="input-group">
              <label>Scene Name:</label>
              <input
                type="text"
                value={battleSceneName}
                onChange={(e) => setBattleSceneName(e.target.value)}
                placeholder="e.g., 'Alex vs Jordan Battle'"
              />
            </div>

            <div className="battle-players-section">
              <h4>Select Players</h4>
              <div className="battle-player-selects">
                <div className="input-group">
                  <label>Player 1:</label>
                  <select
                    value={battlePlayer1}
                    onChange={(e) => setBattlePlayer1(e.target.value)}
                  >
                    <option value="">Select player...</option>
                    {gameState.players?.map(player => (
                      <option key={player.id} value={player.id}>
                        {player.name} (⚡ {player.stats?.power || 50})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="input-group">
                  <label>Player 2:</label>
                  <select
                    value={battlePlayer2}
                    onChange={(e) => setBattlePlayer2(e.target.value)}
                  >
                    <option value="">Select player...</option>
                    {gameState.players?.filter(p => p.id !== battlePlayer1).map(player => (
                      <option key={player.id} value={player.id}>
                        {player.name} (⚡ {player.stats?.power || 50})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {battlePlayer1 && battlePlayer2 && (() => {
                const p1 = gameState.players.find(p => p.id === battlePlayer1)
                const p2 = gameState.players.find(p => p.id === battlePlayer2)
                const power1 = p1?.stats?.power || 50
                const power2 = p2?.stats?.power || 50
                const total = power1 + power2
                const p1Chance = Math.round((power1 / total) * 100)
                const p2Chance = 100 - p1Chance
                return (
                  <div className="battle-preview">
                    <p className="battle-stats">
                      <strong>{p1?.name}</strong>: {p1Chance}% chance |
                      <strong> {p2?.name}</strong>: {p2Chance}% chance
                    </p>
                  </div>
                )
              })()}
            </div>

            <button
              className="save-scene-button"
              onClick={saveBattleWheelScene}
              disabled={!battleSceneName.trim() || !battlePlayer1 || !battlePlayer2 || battlePlayer1 === battlePlayer2}
            >
              💾 Create Battle Wheel
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

                  {/* Example Templates */}
                  <div className="sidebar-section">
                    <h4 className="sidebar-title">✨ Example Maps</h4>
                    <div className="template-list-compact">
                      {exampleMapTemplates.map(template => (
                        <div key={template.id} className="template-item-compact example-template">
                          <div className="template-info">
                            <span className="template-name">{template.name}</span>
                            <span className="template-desc">{template.description}</span>
                          </div>
                          <button onClick={() => loadExampleTemplate(template.id)} className="icon-btn" title="Load">📂</button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Saved Templates */}
                  <div className="sidebar-section">
                    <h4 className="sidebar-title">📚 Saved Templates</h4>
                    <div className="template-list-compact">
                      {JSON.parse(localStorage.getItem('mapTemplates') || '[]').map(template => (
                        <div key={template.id} className="template-item-compact">
                          <span className="template-name">{template.name}</span>
                          <button onClick={() => loadTemplate(template.id)} className="icon-btn" title="Load">📂</button>
                          <button onClick={() => deleteTemplate(template.id)} className="icon-btn danger" title="Delete">×</button>
                        </div>
                      ))}
                      {JSON.parse(localStorage.getItem('mapTemplates') || '[]').length === 0 && (
                        <p className="sidebar-hint">No saved templates</p>
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
            <input
              type="text"
              value={newPlayerAvatar}
              onChange={(e) => setNewPlayerAvatar(e.target.value)}
              placeholder="Avatar image URL (optional)"
              onKeyPress={(e) => e.key === 'Enter' && addPlayer()}
            />
            <button onClick={addPlayer}>Add Player</button>
          </div>

          <div className="players-list">
            {gameState.players.map(player => (
              <div key={player.id} className="player-card" style={{ borderColor: player.color }}>
                {player.avatar && (
                  <div className="player-avatar-container">
                    <img
                      src={player.avatar}
                      alt={player.name}
                      className="player-avatar"
                      onClick={() => setEditingPlayerAvatar(player.id)}
                      title="Click to edit avatar"
                    />
                  </div>
                )}

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

                {editingPlayerAvatar === player.id && (
                  <div className="avatar-edit">
                    <input
                      type="text"
                      defaultValue={player.avatar || ''}
                      placeholder="Avatar URL"
                      onBlur={(e) => updatePlayerAvatar(player.id, e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && updatePlayerAvatar(player.id, e.target.value)}
                      autoFocus
                    />
                  </div>
                )}

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
                      <select
                        value={newItemName}
                        onChange={(e) => setNewItemName(e.target.value)}
                        style={{ flex: 1, padding: '0.5rem', borderRadius: '6px', border: '2px solid var(--bg-light)', background: 'var(--bg-medium)', color: 'var(--text-primary)' }}
                      >
                        <option value="">Select item from shop...</option>
                        {gameState.shopItems?.map(item => (
                          <option key={item.id} value={item.name}>
                            {item.name} (💰{item.price})
                          </option>
                        ))}
                      </select>
                      <button onClick={() => addItemToPlayer(selectedPlayer)} disabled={!newItemName}>Give Item</button>
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

        <section className="section scene-switcher">
          <h2>🎬 Scene Control</h2>
          <p className="scene-current">Current Scene: <strong>{gameState.currentScene?.type || 'game'}</strong></p>

          <div className="scene-grid">
            <button
              className={`scene-card ${gameState.currentScene?.type === 'game' ? 'active' : ''}`}
              onClick={() => activateScene('game')}
            >
              <span className="scene-icon">🎮</span>
              <span className="scene-name">Game View</span>
            </button>

            <button
              className={`scene-card ${gameState.currentScene?.type === 'shop' && !gameState.currentScene?.id ? 'active' : ''}`}
              onClick={showShop}
            >
              <span className="scene-icon">🛒</span>
              <span className="scene-name">Shop</span>
            </button>

            {gameState.customScenes?.filter(s => s.type === 'shop').map(scene => (
              <button
                key={scene.id}
                className={`scene-card ${gameState.currentScene?.id === scene.id ? 'active' : ''}`}
                onClick={() => activateSceneById(scene.id)}
              >
                <span className="scene-icon">🛒</span>
                <span className="scene-name">{scene.name || 'Shop'}</span>
              </button>
            ))}

            {gameState.customScenes?.filter(s => s.type === 'image').map(scene => (
              <button
                key={scene.id}
                className={`scene-card ${gameState.currentScene?.id === scene.id ? 'active' : ''}`}
                onClick={() => activateSceneById(scene.id)}
              >
                <span className="scene-icon">🖼️</span>
                <span className="scene-name">{scene.name || 'Image'}</span>
              </button>
            ))}

            {gameState.customScenes?.filter(s => s.type === 'text').map(scene => (
              <button
                key={scene.id}
                className={`scene-card ${gameState.currentScene?.id === scene.id ? 'active' : ''}`}
                onClick={() => activateSceneById(scene.id)}
              >
                <span className="scene-icon">📝</span>
                <span className="scene-name">{scene.name || 'Text'}</span>
              </button>
            ))}
          </div>

          {!gameState.customScenes || gameState.customScenes.length === 0 && (
            <p className="hint">No custom scenes yet. Create scenes in Setup Mode.</p>
          )}
        </section>

        <section className="section wheel-selector">
          <h2>🎡 Spinning Wheels</h2>

          <div className="wheel-grid">
            {gameState.customScenes?.filter(s => s.type === 'wheel').map(scene => (
              <div key={scene.id} className="wheel-card">
                <div className="wheel-info">
                  <h3>{scene.name || 'Wheel'}</h3>
                  <p className="wheel-outcomes">{scene.data?.outcomes?.length || 0} outcomes</p>
                </div>
                <div className="wheel-actions">
                  <button
                    className={`primary-button ${gameState.currentScene?.id === scene.id ? 'active' : ''}`}
                    onClick={() => activateSceneById(scene.id)}
                  >
                    {gameState.currentScene?.id === scene.id ? '✓ Active' : 'Activate'}
                  </button>
                  {gameState.currentScene?.id === scene.id && (
                    <button
                      className="spin-trigger-button"
                      onClick={() => triggerWheelSpin()}
                    >
                      🎡 Spin!
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {(!gameState.customScenes?.filter(s => s.type === 'wheel').length) && (
            <p className="hint">No spinning wheels yet. Create wheels in Setup Mode.</p>
          )}
        </section>
          </>
        )}
      </div>
    </div>
  )
}

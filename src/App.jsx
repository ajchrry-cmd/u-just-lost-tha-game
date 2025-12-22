import { useState, useEffect } from 'react'
import './App.css'
import GameMaster from './components/GameMaster'
import DisplayView from './components/DisplayView'
import { db } from './firebase'
import { doc, setDoc, getDoc, onSnapshot } from 'firebase/firestore'

function App() {
  const [view, setView] = useState('home')
  const [sessionId, setSessionId] = useState(localStorage.getItem('sessionId') || '')
  const [sessionInput, setSessionInput] = useState('')
  const [isConnected, setIsConnected] = useState(false)
  const [gameState, setGameState] = useState({
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
      type: 'game',
      data: {}
    },
    shopItems: [],
    customScenes: [],
    wheelSpinTrigger: null,
    mapMode: 'custom',
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
      tiles: [],
      backgroundImage: ''
    }
  })

  // Create new session
  const createSession = async () => {
    const newSessionId = Math.random().toString(36).substring(2, 8).toUpperCase()
    const sessionRef = doc(db, 'sessions', newSessionId)

    try {
      await setDoc(sessionRef, gameState)
      setSessionId(newSessionId)
      localStorage.setItem('sessionId', newSessionId)
      setIsConnected(true)
      alert(`Session created! Share this code: ${newSessionId}`)
    } catch (error) {
      console.error('Error creating session:', error)
      alert('Failed to create session. Please try again.')
    }
  }

  // Join existing session
  const joinSession = async () => {
    if (!sessionInput.trim()) {
      alert('Please enter a session code')
      return
    }

    const sessionRef = doc(db, 'sessions', sessionInput.toUpperCase())

    try {
      const sessionDoc = await getDoc(sessionRef)
      if (sessionDoc.exists()) {
        setSessionId(sessionInput.toUpperCase())
        localStorage.setItem('sessionId', sessionInput.toUpperCase())
        setIsConnected(true)
      } else {
        alert('Session not found. Please check the code and try again.')
      }
    } catch (error) {
      console.error('Error joining session:', error)
      alert('Failed to join session. Please try again.')
    }
  }

  // Sync gameState to Firebase (from Game Master)
  useEffect(() => {
    if (!sessionId || !isConnected || view !== 'master') return

    const sessionRef = doc(db, 'sessions', sessionId)
    setDoc(sessionRef, gameState, { merge: true }).catch(error => {
      console.error('Error syncing to Firebase:', error)
    })
  }, [gameState, sessionId, isConnected, view])

  // Listen to Firebase updates (for Display View)
  useEffect(() => {
    if (!sessionId || !isConnected) return

    const sessionRef = doc(db, 'sessions', sessionId)
    const unsubscribe = onSnapshot(sessionRef, (doc) => {
      if (doc.exists()) {
        setGameState(doc.data())
      }
    }, (error) => {
      console.error('Error listening to session:', error)
    })

    return () => unsubscribe()
  }, [sessionId, isConnected])

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

  // Auto-connect to saved session on mount
  useEffect(() => {
    if (sessionId && !isConnected) {
      const sessionRef = doc(db, 'sessions', sessionId)
      getDoc(sessionRef).then(docSnap => {
        if (docSnap.exists()) {
          setIsConnected(true)
        } else {
          localStorage.removeItem('sessionId')
          setSessionId('')
        }
      }).catch(error => {
        console.error('Error auto-connecting:', error)
      })
    }
  }, [])

  if (view === 'home') {
    return (
      <div className="home-screen">
        <h1>🎮 Game Master App</h1>
        <p className="subtitle">Interactive party game controller</p>

        {!isConnected ? (
          <div className="session-manager">
            <h2>Session Setup</h2>
            <p className="session-info">Create a new session or join an existing one</p>

            <div className="session-actions">
              <div className="session-create">
                <h3>Create New Session</h3>
                <button
                  className="primary-button"
                  onClick={createSession}
                >
                  🎲 Create Session
                </button>
                <p className="hint">Start a new game and share the code with others</p>
              </div>

              <div className="session-divider">OR</div>

              <div className="session-join">
                <h3>Join Existing Session</h3>
                <input
                  type="text"
                  value={sessionInput}
                  onChange={(e) => setSessionInput(e.target.value.toUpperCase())}
                  placeholder="Enter session code"
                  maxLength={6}
                  style={{
                    textTransform: 'uppercase',
                    fontSize: '1.2rem',
                    padding: '0.75rem',
                    textAlign: 'center',
                    letterSpacing: '0.1em'
                  }}
                  onKeyPress={(e) => e.key === 'Enter' && joinSession()}
                />
                <button
                  className="primary-button"
                  onClick={joinSession}
                  disabled={!sessionInput.trim()}
                >
                  🔗 Join Session
                </button>
                <p className="hint">Enter the code shared by the game master</p>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="session-connected">
              <h2>Connected to Session</h2>
              <div className="session-code-display">
                <span className="session-code">{sessionId}</span>
                <button
                  className="copy-button"
                  onClick={() => {
                    navigator.clipboard.writeText(sessionId)
                    alert('Session code copied!')
                  }}
                  title="Copy session code"
                >
                  📋
                </button>
              </div>
              <button
                className="disconnect-button"
                onClick={() => {
                  setIsConnected(false)
                  setSessionId('')
                  localStorage.removeItem('sessionId')
                }}
              >
                Disconnect
              </button>
            </div>

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
                <li>On another device, join session <strong>{sessionId}</strong></li>
                <li>Open <strong>TV Display View</strong> and mirror it to your TV</li>
                <li>Control everything from the Game Master interface!</li>
              </ol>
            </div>
          </>
        )}
      </div>
    )
  }

  if (view === 'master') {
    return <GameMaster gameState={gameState} setGameState={setGameState} onBack={() => setView('home')} />
  }

  if (view === 'display') {
    return <DisplayView gameState={gameState} onBack={() => setView('home')} />
  }
}

export default App

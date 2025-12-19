# 🎮 Game Master App

An interactive party game application inspired by "Magic the Noah" style games, designed for a game master to control the game from their phone while displaying the action on a TV screen for all players to see.

## 🌟 Features

- **Dual Interface System**
  - 🎯 **Game Master Control Panel**: Full control interface for the game master
  - 📺 **TV Display View**: Clean, animated display for players to watch

- **Player Management**
  - Add/remove players on the fly
  - Edit player names during the game
  - Assign unique colors to each player
  - Set player statuses (Active, Eliminated, Safe, In Danger)

- **Scoring System**
  - Adjust scores with +1, -1, or +5 buttons
  - Live scoreboard with ranking (🥇🥈🥉)
  - Reset all scores option
  - Real-time updates across all screens

- **Event System**
  - Create custom events and challenges
  - Display events prominently on the TV
  - Quick action buttons for common scenarios
  - Random player selector

- **Fully Editable**
  - Change game title anytime
  - Edit player names by clicking on them
  - Update scores and statuses on the fly
  - Clear or update events during gameplay

- **Real-Time Sync**
  - Changes made on the game master panel instantly appear on the TV display
  - Uses localStorage for synchronization
  - Works across multiple browser tabs/windows

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Navigate to the game-master-app directory:
```bash
cd game-master-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and go to the URL shown (usually `http://localhost:5173`)

## 📱 How to Use

### Setup

1. **On your phone/tablet**:
   - Open the app in your browser
   - Click "🎯 Game Master Control"
   - This is your control panel

2. **On your TV/Computer**:
   - Open the app in a new browser tab
   - Click "📺 TV Display View"
   - Mirror this tab to your TV (use Chrome Cast, AirPlay, HDMI cable, etc.)
   - Optionally fullscreen the display (F11 on most browsers)

### During the Game

**Game Master Actions:**

- **Add Players**: Type a player's name and click "Add Player"
- **Adjust Scores**: Use +1, -1, or +5 buttons
- **Change Player Status**: Use the dropdown (Active/Eliminated/Safe/Danger)
- **Edit Names**: Click on any player name to edit it
- **Create Events**: Enter an event title and description, then click "Set Event"
- **Quick Actions**:
  - Random Player: Highlights a random player for their turn
  - Pause Game: Shows a pause screen
- **Reset Scores**: Reset all players to 0 (asks for confirmation)

**What Players See:**

- Current event/challenge in large text
- Scoreboard with all players ranked by score
- Player statuses and colors
- Animated effects for different states

### Game Flow Example

1. Add all players at the start
2. Set an event: "Round 1: Truth or Dare!"
3. Use "Random Player" to select who goes first
4. Award points based on player actions
5. Change player status to "In Danger" for dramatic effect
6. Clear event when done, set a new one for the next round
7. Watch the scoreboard update in real-time on the TV!

## 🎨 Customization

### Game Title
Click on the "Game Title" field in Game Settings to change the displayed game name.

### Player Colors
Colors are automatically assigned randomly when adding players. Each player gets a unique vibrant color.

### Player Statuses
- **Active** (Green): Normal gameplay
- **Eliminated** (Red): Player is out
- **Safe** (Cyan): Player is protected
- **In Danger** (Orange): Player is at risk

## 🎯 Use Cases

Perfect for:
- Interactive party games
- Trivia nights
- Storytelling games
- Competition-based games
- Team challenges
- Educational games
- Custom game shows

## 🛠️ Technical Details

- Built with React and Vite
- Uses localStorage for state persistence and sync
- Responsive design for mobile and desktop
- No backend required - runs entirely in the browser
- Real-time updates using storage events

## 📝 Tips for Game Masters

1. **Pre-game**: Add all players before starting
2. **Keep it moving**: Use quick actions for common scenarios
3. **Be creative**: Edit anything on the fly to adapt to the game
4. **Dramatic effect**: Use player statuses and events to build tension
5. **Fair play**: Use the Random Player button for unbiased selection
6. **Score variety**: Mix +1 and +5 bonuses to keep things interesting

## 🎭 Game Ideas

### Truth or Dare Tournament
- Award points for completing challenges
- Eliminate players who refuse
- Final round with highest scorers

### Story Builder
- Random player tells part of a story
- Other players vote on quality (+1 or +5)
- Best storyteller wins

### Quiz Night
- Set events as questions
- Award points for correct answers
- Use "In Danger" status for players on losing streaks

### Survival Challenge
- Everyone starts at 10 points
- Lose points for failed challenges
- Last player standing wins

## 🤝 Contributing

Feel free to fork this project and add your own features! Some ideas:
- Sound effects
- Timers
- Teams support
- Game templates
- Statistics tracking

## 📄 License

MIT License - feel free to use this for your game nights!

## 🎉 Have Fun!

Remember: The best games are the ones where everyone has fun. Use this tool to create memorable experiences with your friends!

---

Made with ❤️ for epic game nights

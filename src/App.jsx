import { useState } from 'react'
import './App.css'

function App() {
  const [gameStarted, setGameStarted] = useState(false)
  const [dialogueIndex, setDialogueIndex] = useState(0)

  const handleStartGame = () => {
    setGameStarted(true)
  }

  const handleNextDialogue = () => {
    setDialogueIndex(dialogueIndex + 1)
  }

  const handleChoice = (choice) => {
    console.log('User chose:', choice)
    // Handle the choice here
  }

  const dialogues = [
    "Yeey! Finally i got my first pokie!",
    "I can be a Pokie trainer now!!",
    "Who should i tell good news first??"
  ]

  if (!gameStarted) {
    return (
      <div className="entry-screen">
        <div className="game-title">Pokeween</div>
        <button className="start-button" onClick={handleStartGame}>
          Let's start the journey!
        </button>
      </div>
    )
  }

  return (
    <div className="game-screen">
      <div className="scene-content">
        <div className="character-container">
          <img src="/c1-happy.png" alt="Character" className="character" />
        </div>
        
        <div className="dialogue-box">
          <p className="dialogue-text">{dialogues[dialogueIndex]}</p>
          
          {dialogueIndex < 2 ? (
            <button className="next-button" onClick={handleNextDialogue}>
              →
            </button>
          ) : (
            <div className="choices-container">
              <button className="choice-button" onClick={() => handleChoice('ema')}>
                Tell Ema First!
              </button>
              <button className="choice-button" onClick={() => handleChoice('jone')}>
                Tell Jone First!
              </button>
              <button className="choice-button" onClick={() => handleChoice('adventure')}>
                Go directly on adventure!
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App

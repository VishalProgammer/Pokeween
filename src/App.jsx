import { useState } from 'react'
import './App.css'

function App() {
  const [gameStarted, setGameStarted] = useState(false)
  const [dialogueIndex, setDialogueIndex] = useState(0)
  const [scene, setScene] = useState('intro')
  const [emaDialogueIndex, setEmaDialogueIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const handleStartGame = () => {
    setGameStarted(true)
  }

  const handleNextDialogue = () => {
    setDialogueIndex(dialogueIndex + 1)
  }

  const handleEmaNextDialogue = () => {
    if (emaDialogueIndex === 7) {
      // Trigger transition to screen3
      setIsTransitioning(true)
      setTimeout(() => {
        setScene('screen3')
        setIsTransitioning(false)
      }, 2000)
    } else {
      setEmaDialogueIndex(emaDialogueIndex + 1)
    }
  }

  const handleChoice = (choice) => {
    console.log('User chose:', choice)
    if (choice === 'ema') {
      setScene('ema')
      setEmaDialogueIndex(0)
    }
    // Handle other choices here
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

  const characterImage = dialogueIndex === 2 ? "/c1-think.png" : "/c1-happy.png"

  // Screen 3 - Night scene
  if (scene === 'screen3') {
    return (
      <div className="game-screen screen3-scene">
        <div className="center-dialogue-container">
          <div className="dialogue-box">
            <p className="character-name red">Me</p>
            <p className="dialogue-text">I love night time... so peaceful. Night shifts are better than day ones after all!!</p>
            <button className="next-button">
              →
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Ema scene after choosing option 1
  if (scene === 'ema') {
    let leftCharacter = "/c1-smile.png"
    let rightCharacter = "/c2-think.png"
    let speakerName = "You"
    let nameColor = ""
    let dialogueText = "Hey Ema!! You there?"
    let showItemReceived = false

    if (emaDialogueIndex === 1) {
      rightCharacter = "/c2-shock.png"
      speakerName = "Ema"
      nameColor = "pink"
      dialogueText = "Hey!! Alex!! When did you get here?"
    } else if (emaDialogueIndex === 2) {
      leftCharacter = "/c1-talk1.png"
      rightCharacter = "/c2-shock.png"
      speakerName = "Me"
      nameColor = "red"
      dialogueText = "Just now, you know, today I got my first Pokie from Dr.Wattson!!"
    } else if (emaDialogueIndex === 3) {
      leftCharacter = "/c1-talk1.png"
      rightCharacter = "/c2-confident.png"
      speakerName = "Ema"
      nameColor = "pink"
      dialogueText = "Hey, Congratulations Alex! I am happy for you!"
    } else if (emaDialogueIndex === 4) {
      leftCharacter = "/c1-talk1.png"
      rightCharacter = "/c2-confident.png"
      speakerName = "Ema"
      nameColor = "pink"
      dialogueText = "So, ready to be a Pokie Protector?"
    } else if (emaDialogueIndex === 5) {
      leftCharacter = "/c1-exited.png"
      rightCharacter = "/c2-confident.png"
      speakerName = "Me"
      nameColor = "red"
      dialogueText = "Yes! I can't wait to start my new life!"
    } else if (emaDialogueIndex === 6) {
      leftCharacter = "/c1-exited.png"
      rightCharacter = "/c2-smile.png"
      speakerName = "Ema"
      nameColor = "pink"
      dialogueText = "Calm down, it won't be easy, so take this. It will help you!"
    } else if (emaDialogueIndex === 7) {
      leftCharacter = "/c1-exited.png"
      rightCharacter = "/c2-smile.png"
      speakerName = ""
      nameColor = ""
      dialogueText = "Ema gave you a Heart crystal..."
      showItemReceived = true
    }

    return (
      <div className="game-screen ema-scene">
        <div className="two-character-scene">
          <div className="character-container left">
            <img src={leftCharacter} alt="Character 1" className="character" />
          </div>
          
          <div className="dialogue-box-wrapper">
            {showItemReceived && (
              <div className="item-received">
                <img src="/heart.png" alt="Heart Crystal" className="item-image" />
              </div>
            )}
            <div className="dialogue-box">
              {speakerName && <p className={`character-name ${nameColor}`}>{speakerName}</p>}
              <p className="dialogue-text">{dialogueText}</p>
              <button className="next-button" onClick={handleEmaNextDialogue}>
                →
              </button>
            </div>
          </div>

          <div className="character-container right">
            <img src={rightCharacter} alt="Character 2" className="character" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="game-screen">
        <div className="scene-content">
          <div className="character-container">
            <img src={characterImage} alt="Character" className="character" />
          </div>
          
          <div className="dialogue-box">
            <p className="character-name">You</p>
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
      {isTransitioning && <div className="dark-transition"></div>}
    </>
  )
}

export default App

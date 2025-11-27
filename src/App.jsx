import { useState, useEffect, useRef } from 'react'
import './App.css'

function App() {
  const [gameStarted, setGameStarted] = useState(false)
  const [dialogueIndex, setDialogueIndex] = useState(0)
  const [scene, setScene] = useState('intro')
  const [emaDialogueIndex, setEmaDialogueIndex] = useState(0)
  const [joneDialogueIndex, setJoneDialogueIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [screen3ClickCount, setScreen3ClickCount] = useState(0)
  const [screen4ClickCount, setScreen4ClickCount] = useState(0)
  const [choseEma, setChoseEma] = useState(false)
  const [choseJone, setChoseJone] = useState(false)

  // Battle states
  const [playerHP, setPlayerHP] = useState(100)
  const [enemyHP, setEnemyHP] = useState(100)
  const [battleLog, setBattleLog] = useState('')
  const [isPlayerTurn, setIsPlayerTurn] = useState(true)
  const [heartUsed, setHeartUsed] = useState(false)
  const [showItemAnimation, setShowItemAnimation] = useState(false)
  const [itemAnimationType, setItemAnimationType] = useState('')
  const [itemMessage, setItemMessage] = useState('')
  const [swordShown, setSwordShown] = useState(false)

  // Audio refs
  const bgMusicRef = useRef(null)
  const currentBgTrack = useRef('')
  const [audioStarted, setAudioStarted] = useState(false)

  // Function to play/change background music
  const playBgMusic = (trackName) => {
    if (trackName === currentBgTrack.current) return

    // Stop current track
    if (bgMusicRef.current) {
      bgMusicRef.current.pause()
      bgMusicRef.current.currentTime = 0
    }

    // Play new track
    if (trackName) {
      bgMusicRef.current = new Audio(`/${trackName}`)
      bgMusicRef.current.loop = true
      bgMusicRef.current.volume = 0.5
      bgMusicRef.current.play().catch(e => console.log('Audio play failed:', e))
      currentBgTrack.current = trackName
    } else {
      currentBgTrack.current = ''
    }
  }

  // Background music management - changes based on scene
  useEffect(() => {
    if (!audioStarted) return // Don't play until user has interacted

    let trackToPlay = 'regular bg.mp3' // Default to regular bg

    // Keep regular bg for intro, ema, and jone scenes
    if (scene === 'intro' || scene === 'ema' || scene === 'jone') {
      trackToPlay = 'regular bg.mp3'
    } else if (scene === 'screen3' && screen3ClickCount === 0) {
      trackToPlay = 'forest normal.mp3'
    } else if (scene === 'screen3' && screen3ClickCount >= 1) {
      trackToPlay = 'forest intense.mp3'
    } else if (scene === 'screen4') {
      // Keep forest intense until battle starts (screen4c)
      if (screen4ClickCount >= 2) {
        trackToPlay = 'fight bg.mp3'
      } else {
        trackToPlay = 'forest intense.mp3'
      }
    } else if (scene === 'screen5') {
      trackToPlay = '' // Stop music on victory
    }

    playBgMusic(trackToPlay)
  }, [audioStarted, scene, screen3ClickCount, screen4ClickCount])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (bgMusicRef.current) {
        bgMusicRef.current.pause()
      }
    }
  }, [])

  // Play click sound effect
  const playClickSound = () => {
    const clickSound = new Audio('/click.mp3')
    clickSound.volume = 0.5
    clickSound.play().catch(e => console.log('Audio play failed:', e))
  }

  // Play item taken sound effect
  const playItemTakenSound = () => {
    const itemSound = new Audio('/item given.mp3')
    itemSound.volume = 0.7
    itemSound.play().catch(e => console.log('Audio play failed:', e))
  }

  // Play item used sound effect
  const playItemUsedSound = () => {
    const itemSound = new Audio('/item used.mp3')
    itemSound.volume = 0.7
    itemSound.play().catch(e => console.log('Audio play failed:', e))
  }

  const handleStartGame = () => {
    playClickSound()
    setAudioStarted(true) // Start audio on first user interaction
    setGameStarted(true)
  }

  const handleNextDialogue = () => {
    playClickSound()
    setDialogueIndex(dialogueIndex + 1)
  }

  const handleEmaNextDialogue = () => {
    playClickSound()
    if (emaDialogueIndex === 7) {
      // Play item taken sound
      playItemTakenSound()
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

  const handleJoneNextDialogue = () => {
    playClickSound()
    if (joneDialogueIndex === 7) {
      // Play item taken sound
      playItemTakenSound()
      // Trigger transition to screen3
      setIsTransitioning(true)
      setTimeout(() => {
        setScene('screen3')
        setIsTransitioning(false)
      }, 2000)
    } else {
      setJoneDialogueIndex(joneDialogueIndex + 1)
    }
  }

  const handleChoice = (choice) => {
    playClickSound()
    console.log('User chose:', choice)
    if (choice === 'ema') {
      setChoseEma(true)
      setScene('ema')
      setEmaDialogueIndex(0)
    } else if (choice === 'jone') {
      setChoseJone(true)
      setScene('jone')
      setJoneDialogueIndex(0)
    } else if (choice === 'adventure') {
      setScene('screen3')
      setScreen3ClickCount(0)
    }
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

  // Screen 5 - Victory screen
  if (scene === 'screen5') {
    return (
      <div className="game-screen screen5-scene">
        <div className="victory-container">
          <h1 className="victory-text">Victory!</h1>
          <p className="victory-message">You defeated the villain and saved the day!</p>
        </div>
      </div>
    )
  }

  // Screen 4
  if (scene === 'screen4') {
    const handleScreen4Next = () => {
      playClickSound()
      if (screen4ClickCount < 2) {
        setScreen4ClickCount(screen4ClickCount + 1)
      }
    }

    const handleAttack = (attackType) => {
      if (!isPlayerTurn || playerHP <= 0 || enemyHP <= 0) return

      // Play damage given sound
      const damageGivenSound = new Audio('/damage given.mp3')
      damageGivenSound.play().catch(e => console.log('Audio play failed:', e))

      // Player attacks - Jon's sword increases damage by 1.5x, Ema path reduces by 0.5x (but 2x after heart used)
      const baseDamages = {
        tackle: Math.floor(Math.random() * 15) + 10,
        bite: Math.floor(Math.random() * 20) + 15,
        thunder: Math.floor(Math.random() * 25) + 20
      }

      let damageMultiplier = 1
      if (choseJone) {
        damageMultiplier = 1.5
      } else if (choseEma && !heartUsed) {
        damageMultiplier = 0.5
      } else if (choseEma && heartUsed) {
        damageMultiplier = 2
      }

      const attacks = {
        tackle: { name: 'Tackle', damage: Math.floor(baseDamages.tackle * damageMultiplier) },
        bite: { name: 'Bite', damage: Math.floor(baseDamages.bite * damageMultiplier) },
        thunder: { name: 'Thunder', damage: Math.floor(baseDamages.thunder * damageMultiplier) }
      }

      const playerAttack = attacks[attackType]
      const newEnemyHP = Math.max(0, enemyHP - playerAttack.damage)
      setEnemyHP(newEnemyHP)
      setBattleLog(`Rat used ${playerAttack.name}! Dealt ${playerAttack.damage} damage!`)
      setIsPlayerTurn(false)

      // Check if enemy is defeated
      if (newEnemyHP <= 0) {
        setTimeout(() => {
          setBattleLog('Victory! Snake fainted!')
          // Play won sound
          const wonSound = new Audio('/won.mp3')
          wonSound.play().catch(e => console.log('Audio play failed:', e))
          // Transition to screen5 after 2 seconds
          setTimeout(() => {
            setScene('screen5')
          }, 2000)
        }, 1000)
        return
      }

      // Enemy attacks after delay - Ema path has higher enemy damage
      setTimeout(() => {
        // Play damage taken sound
        const damageTakenSound = new Audio('/damage taken.mp3')
        damageTakenSound.play().catch(e => console.log('Audio play failed:', e))

        const enemyDamageMultiplier = (choseEma && !heartUsed) ? 2 : 1
        const enemyAttacks = [
          { name: 'Poison Fang', damage: Math.floor((Math.floor(Math.random() * 15) + 10) * enemyDamageMultiplier) },
          { name: 'Wrap', damage: Math.floor((Math.floor(Math.random() * 20) + 15) * enemyDamageMultiplier) },
          { name: 'Venom Strike', damage: Math.floor((Math.floor(Math.random() * 25) + 20) * enemyDamageMultiplier) }
        ]
        const enemyAttack = enemyAttacks[Math.floor(Math.random() * 3)]
        const newPlayerHP = Math.max(0, playerHP - enemyAttack.damage)
        setPlayerHP(newPlayerHP)
        setBattleLog(`Snake used ${enemyAttack.name}! Dealt ${enemyAttack.damage} damage!`)

        if (newPlayerHP <= 0 && choseEma && !heartUsed) {
          // Use heart crystal to revive
          setTimeout(() => {
            // Play item used sound
            playItemUsedSound()
            setShowItemAnimation(true)
            setItemAnimationType('heart')
            setItemMessage('Crystal Heart had healed your Pokie!')
            setPlayerHP(100)
            setHeartUsed(true)
            setTimeout(() => {
              setShowItemAnimation(false)
              setBattleLog('Your Pokie is back at full health!')
              setTimeout(() => setIsPlayerTurn(true), 1500)
            }, 3000)
          }, 1000)
        } else if (newPlayerHP <= 0) {
          setTimeout(() => {
            setBattleLog('Defeat! Rat fainted!')
          }, 1000)
        } else {
          setTimeout(() => setIsPlayerTurn(true), 1500)
        }
      }, 1500)
    }

    // Battle scene (screen4c)
    if (screen4ClickCount >= 2) {
      // Show Jon's sword animation at start - only once
      if (choseJone && !swordShown && !showItemAnimation) {
        setSwordShown(true)
        setTimeout(() => {
          // Play item used sound
          playItemUsedSound()
          setShowItemAnimation(true)
          setItemAnimationType('sword')
          setItemMessage("Jon's crystal sword has increased your Pokie's damage greatly!")
          setTimeout(() => {
            setShowItemAnimation(false)
          }, 3000)
        }, 500)
      }

      return (
        <div className="game-screen screen4c-scene">
          {showItemAnimation && (
            <div className="item-animation-overlay">
              <div className="item-animation-content">
                <img
                  src={itemAnimationType === 'heart' ? '/heart.png' : '/sword.png'}
                  alt="Item"
                  className="animated-item"
                />
                <p className="item-animation-text">{itemMessage}</p>
              </div>
            </div>
          )}
          <div className="battle-container">
            <div className="battle-field">
              {/* Enemy side */}
              <div className="enemy-side">
                <div className="trainer-info">
                  <img src="/v-angry.png" alt="Enemy Trainer" className="trainer-sprite" />
                  <span className="trainer-name">Villain</span>
                </div>
                <div className="pokemon-container enemy">
                  <div className="hp-bar-container">
                    <div className="pokemon-name">Snake</div>
                    <div className="hp-bar">
                      <div className="hp-fill enemy-hp" style={{ width: `${enemyHP}%` }}></div>
                    </div>
                    <div className="hp-text">{enemyHP}/100 HP</div>
                  </div>
                  <img src="/snake.png" alt="Snake" className="pokemon-sprite enemy-pokemon" />
                </div>
              </div>

              {/* Player side */}
              <div className="player-side">
                <div className="pokemon-container player">
                  <img src="/rat.png" alt="Rat" className="pokemon-sprite player-pokemon" />
                  <div className="hp-bar-container">
                    <div className="pokemon-name">Rat</div>
                    <div className="hp-bar">
                      <div className="hp-fill player-hp" style={{ width: `${playerHP}%` }}></div>
                    </div>
                    <div className="hp-text">{playerHP}/100 HP</div>
                  </div>
                </div>
                <div className="trainer-info">
                  <img src="/h-angry.png" alt="Player Trainer" className="trainer-sprite" />
                  <span className="trainer-name">You</span>
                </div>
              </div>
            </div>

            {/* Battle log and controls */}
            <div className="battle-ui">
              <div className="battle-log">
                {battleLog || 'What will Rat do?'}
              </div>
              {isPlayerTurn && playerHP > 0 && enemyHP > 0 && (
                <div className="attack-buttons">
                  <button className="attack-btn" onClick={() => handleAttack('tackle')}>
                    Tackle
                  </button>
                  <button className="attack-btn" onClick={() => handleAttack('bite')}>
                    Bite
                  </button>
                  <button className="attack-btn" onClick={() => handleAttack('thunder')}>
                    Thunder
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )
    }

    let sceneClass = 'screen4-scene'
    if (screen4ClickCount === 1) {
      sceneClass = 'screen4b-scene'
    }

    return (
      <div className={`game-screen ${sceneClass}`}>
        <button className="top-right-next-button" onClick={handleScreen4Next}>
          →
        </button>
      </div>
    )
  }

  // Screen 3 - Night scene
  if (scene === 'screen3') {
    const handleScreen3Next = () => {
      playClickSound()
      if (screen3ClickCount < 2) {
        setScreen3ClickCount(screen3ClickCount + 1)
      } else {
        // Move to screen4 after third click
        setScene('screen4')
      }
    }

    let sceneClass = 'screen3-scene'
    let dialogueText = "I love night time... so peaceful. Night shifts are better than day ones after all!!"

    if (screen3ClickCount === 1) {
      sceneClass = 'screen3b-scene'
      dialogueText = "What was that?!"
    } else if (screen3ClickCount >= 2) {
      sceneClass = 'screen3c-scene'
      dialogueText = "Even Pokies got scared of that sound, I need to check it out!"
    }

    return (
      <div className={`game-screen ${sceneClass}`}>
        <div className="center-dialogue-container">
          <div className="dialogue-box">
            <p className="character-name red">Me</p>
            <p className="dialogue-text">{dialogueText}</p>
            <button className="next-button" onClick={handleScreen3Next}>
              →
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Jone scene after choosing option 2
  if (scene === 'jone') {
    let leftCharacter = "/c1-smile.png"
    let rightCharacter = "/c3-think.png"
    let speakerName = "You"
    let nameColor = ""
    let dialogueText = "Hey Jone!! You there?"
    let showItemReceived = false

    if (joneDialogueIndex === 1) {
      rightCharacter = "/c3-shock.png"
      speakerName = "Jone"
      nameColor = "green"
      dialogueText = "Hey!! Alex!! When did you get here?"
    } else if (joneDialogueIndex === 2) {
      leftCharacter = "/c1-talk1.png"
      rightCharacter = "/c3-shock.png"
      speakerName = "Me"
      nameColor = "red"
      dialogueText = "Just now, you know, today I got my first Pokie from Dr.Wattson!!"
    } else if (joneDialogueIndex === 3) {
      leftCharacter = "/c1-talk1.png"
      rightCharacter = "/c3-confident.png"
      speakerName = "Jone"
      nameColor = "green"
      dialogueText = "Hey, Congratulations Alex! I am happy for you!"
    } else if (joneDialogueIndex === 4) {
      leftCharacter = "/c1-talk1.png"
      rightCharacter = "/c3-confident.png"
      speakerName = "Jone"
      nameColor = "green"
      dialogueText = "So, ready to be a Pokie Protector?"
    } else if (joneDialogueIndex === 5) {
      leftCharacter = "/c1-exited.png"
      rightCharacter = "/c3-confident.png"
      speakerName = "Me"
      nameColor = "red"
      dialogueText = "Yes! I can't wait to start my new life!"
    } else if (joneDialogueIndex === 6) {
      leftCharacter = "/c1-exited.png"
      rightCharacter = "/c3-smile.png"
      speakerName = "Jone"
      nameColor = "green"
      dialogueText = "Calm down, it won't be easy, so take this. It will help you!"
    } else if (joneDialogueIndex === 7) {
      leftCharacter = "/c1-exited.png"
      rightCharacter = "/c3-smile.png"
      speakerName = ""
      nameColor = ""
      dialogueText = "Jone gave you a Sword..."
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
                <img src="/sword.png" alt="Sword" className="item-image" />
              </div>
            )}
            <div className="dialogue-box">
              {speakerName && <p className={`character-name ${nameColor}`}>{speakerName}</p>}
              <p className="dialogue-text">{dialogueText}</p>
              <button className="next-button" onClick={handleJoneNextDialogue}>
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

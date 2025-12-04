import { useState, useEffect, useRef } from 'react'
import './App.css'

// Element system: Fire > Air > Water > Fire
const ELEMENTS = {
  fire: { strong: 'air', weak: 'water', color: '#ff6b35' },
  air: { strong: 'water', weak: 'fire', color: '#87ceeb' },
  water: { strong: 'fire', weak: 'air', color: '#4a90d9' }
}

const POKIES = {
  fire: [
    {
      id: 'fire1', name: 'Flamey', image: '/fire1.png', attacks: [
        { name: 'Ember', baseDamage: 12 }, { name: 'Fire Blast', baseDamage: 18 }, { name: 'Inferno', baseDamage: 25 }
      ]
    },
    {
      id: 'fire2', name: 'Blazer', image: '/fire2.png', attacks: [
        { name: 'Flame Wheel', baseDamage: 14 }, { name: 'Heat Wave', baseDamage: 20 }, { name: 'Eruption', baseDamage: 28 }
      ]
    },
    {
      id: 'fire3', name: 'Pyro', image: '/fire3.png', attacks: [
        { name: 'Fire Punch', baseDamage: 13 }, { name: 'Flamethrower', baseDamage: 19 }, { name: 'Blast Burn', baseDamage: 26 }
      ]
    },
    {
      id: 'fire4', name: 'Scorch', image: '/fire4.png', attacks: [
        { name: 'Lava Plume', baseDamage: 15 }, { name: 'Magma Storm', baseDamage: 21 }, { name: 'Fire Spin', baseDamage: 24 }
      ]
    },
    {
      id: 'fire5', name: 'Infernix', image: '/fire5.png', attacks: [
        { name: 'Burn Up', baseDamage: 16 }, { name: 'Overheat', baseDamage: 22 }, { name: 'Sacred Fire', baseDamage: 30 }
      ]
    }
  ],
  air: [
    {
      id: 'air1', name: 'Breeze', image: '/air1.png', attacks: [
        { name: 'Gust', baseDamage: 12 }, { name: 'Air Slash', baseDamage: 18 }, { name: 'Hurricane', baseDamage: 25 }
      ]
    },
    {
      id: 'air2', name: 'Zephyr', image: '/air2.png', attacks: [
        { name: 'Wing Attack', baseDamage: 14 }, { name: 'Aerial Ace', baseDamage: 20 }, { name: 'Sky Attack', baseDamage: 28 }
      ]
    },
    {
      id: 'air3', name: 'Cyclone', image: '/air3.png', attacks: [
        { name: 'Twister', baseDamage: 13 }, { name: 'Whirlwind', baseDamage: 19 }, { name: 'Tornado', baseDamage: 26 }
      ]
    },
    {
      id: 'air4', name: 'Tempest', image: '/air4.png', attacks: [
        { name: 'Air Cutter', baseDamage: 15 }, { name: 'Razor Wind', baseDamage: 21 }, { name: 'Aeroblast', baseDamage: 24 }
      ]
    },
    {
      id: 'air5', name: 'Stormix', image: '/air5.png', attacks: [
        { name: 'Brave Bird', baseDamage: 16 }, { name: 'Oblivion Wing', baseDamage: 22 }, { name: 'Dragon Ascent', baseDamage: 30 }
      ]
    }
  ],
  water: [
    {
      id: 'water1', name: 'Splash', image: '/water1.png', attacks: [
        { name: 'Water Gun', baseDamage: 12 }, { name: 'Hydro Pump', baseDamage: 18 }, { name: 'Tsunami', baseDamage: 25 }
      ]
    },
    {
      id: 'water2', name: 'Aqua', image: '/water2.png', attacks: [
        { name: 'Bubble Beam', baseDamage: 14 }, { name: 'Surf', baseDamage: 20 }, { name: 'Origin Pulse', baseDamage: 28 }
      ]
    },
    {
      id: 'water3', name: 'Torrent', image: '/water3.png', attacks: [
        { name: 'Aqua Jet', baseDamage: 13 }, { name: 'Waterfall', baseDamage: 19 }, { name: 'Hydro Cannon', baseDamage: 26 }
      ]
    },
    {
      id: 'water4', name: 'Tidal', image: '/water4.png', attacks: [
        { name: 'Scald', baseDamage: 15 }, { name: 'Muddy Water', baseDamage: 21 }, { name: 'Water Spout', baseDamage: 24 }
      ]
    },
    {
      id: 'water5', name: 'Oceanus', image: '/water5.png', attacks: [
        { name: 'Aqua Tail', baseDamage: 16 }, { name: 'Crabhammer', baseDamage: 22 }, { name: 'Steam Eruption', baseDamage: 30 }
      ]
    }
  ]
}

function App() {
  const [gameStarted, setGameStarted] = useState(false)
  const [gameMode, setGameMode] = useState(null) // 'story' or 'arena'
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

  // Arena states
  const [arenaCharacter, setArenaCharacter] = useState(null)
  const [selectedElement, setSelectedElement] = useState('fire')
  const [selectedPokie, setSelectedPokie] = useState(null)
  const [selectedBooster, setSelectedBooster] = useState(null)
  const [difficulty, setDifficulty] = useState(null)
  const [arenaStep, setArenaStep] = useState('character') // character, pokie, booster, difficulty, battle
  const [enemyPokie, setEnemyPokie] = useState(null)
  const [arenaBoosterUsed, setArenaBoosterUsed] = useState(false)
  const [arenaSwordShown, setArenaSwordShown] = useState(false)

  // Audio refs
  const bgMusicRef = useRef(null)
  const loseSoundRef = useRef(null)
  const currentBgTrack = useRef('')
  const [audioStarted, setAudioStarted] = useState(false)


  const playBgMusic = (trackName) => {
    if (trackName === currentBgTrack.current) return
    if (bgMusicRef.current) {
      bgMusicRef.current.pause()
      bgMusicRef.current.currentTime = 0
    }
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

  useEffect(() => {
    // Stop all sounds on entrance screen
    if (!gameStarted) {
      if (bgMusicRef.current) {
        bgMusicRef.current.pause()
        bgMusicRef.current.currentTime = 0
        currentBgTrack.current = ''
      }
      if (loseSoundRef.current) {
        loseSoundRef.current.pause()
        loseSoundRef.current.currentTime = 0
      }
      return
    }
    if (!audioStarted) return
    let trackToPlay = 'regular bg.mp3'
    if (scene === 'intro' || scene === 'ema' || scene === 'jone') {
      trackToPlay = 'regular bg.mp3'
    } else if (scene === 'screen3' && screen3ClickCount === 0) {
      trackToPlay = 'forest normal.mp3'
    } else if (scene === 'screen3' && screen3ClickCount >= 1) {
      trackToPlay = 'forest intense.mp3'
    } else if (scene === 'screen4') {
      trackToPlay = screen4ClickCount >= 2 ? 'fight bg.mp3' : 'forest intense.mp3'
    } else if (scene === 'screen5' || scene === 'defeat') {
      trackToPlay = ''
    } else if (scene === 'arena') {
      trackToPlay = arenaStep === 'battle' ? 'fight bg.mp3' : 'forest intense.mp3'
    }
    playBgMusic(trackToPlay)
  }, [gameStarted, audioStarted, scene, screen3ClickCount, screen4ClickCount, arenaStep])

  useEffect(() => {
    return () => { if (bgMusicRef.current) bgMusicRef.current.pause() }
  }, [])

  const playClickSound = () => {
    const clickSound = new Audio('/click.mp3')
    clickSound.volume = 0.5
    clickSound.play().catch(e => console.log('Audio play failed:', e))
  }

  const playItemTakenSound = () => {
    const itemSound = new Audio('/item given.mp3')
    itemSound.volume = 0.7
    itemSound.play().catch(e => console.log('Audio play failed:', e))
  }

  const playItemUsedSound = () => {
    const itemSound = new Audio('/item used.mp3')
    itemSound.volume = 0.7
    itemSound.play().catch(e => console.log('Audio play failed:', e))
  }

  const handleStartGame = (mode) => {
    playClickSound()
    setAudioStarted(true)
    setGameStarted(true)
    setGameMode(mode)
    if (mode === 'arena') {
      setScene('arena')
      setArenaStep('character')
    }
  }

  const resetArena = () => {
    if (loseSoundRef.current) {
      loseSoundRef.current.pause()
      loseSoundRef.current.currentTime = 0
    }
    setArenaCharacter(null)
    setSelectedElement('fire')
    setSelectedPokie(null)
    setSelectedBooster(null)
    setDifficulty(null)
    setArenaStep('character')
    setEnemyPokie(null)
    setPlayerHP(100)
    setEnemyHP(100)
    setBattleLog('')
    setIsPlayerTurn(true)
    setArenaBoosterUsed(false)
    setArenaSwordShown(false)
    setShowItemAnimation(false)
  }

  const handleNextDialogue = () => {
    playClickSound()
    setDialogueIndex(dialogueIndex + 1)
  }

  const handleEmaNextDialogue = () => {
    playClickSound()
    if (emaDialogueIndex === 7) {
      playItemTakenSound()
      setIsTransitioning(true)
      setTimeout(() => { setScene('screen3'); setIsTransitioning(false) }, 2000)
    } else {
      setEmaDialogueIndex(emaDialogueIndex + 1)
    }
  }

  const handleJoneNextDialogue = () => {
    playClickSound()
    if (joneDialogueIndex === 7) {
      playItemTakenSound()
      setIsTransitioning(true)
      setTimeout(() => { setScene('screen3'); setIsTransitioning(false) }, 2000)
    } else {
      setJoneDialogueIndex(joneDialogueIndex + 1)
    }
  }

  const goToHome = () => {
    playClickSound()
    if (bgMusicRef.current) { bgMusicRef.current.pause(); bgMusicRef.current.currentTime = 0; currentBgTrack.current = '' }
    if (loseSoundRef.current) { loseSoundRef.current.pause(); loseSoundRef.current.currentTime = 0 }
    setGameStarted(false)
    setGameMode(null)
    setScene('intro')
    setDialogueIndex(0)
    setEmaDialogueIndex(0)
    setJoneDialogueIndex(0)
    setScreen3ClickCount(0)
    setScreen4ClickCount(0)
    setChoseEma(false)
    setChoseJone(false)
    setPlayerHP(100)
    setEnemyHP(100)
    setHeartUsed(false)
    setSwordShown(false)
  }

  const handleChoice = (choice) => {
    playClickSound()
    if (choice === 'ema') { setChoseEma(true); setScene('ema'); setEmaDialogueIndex(0) }
    else if (choice === 'jone') { setChoseJone(true); setScene('jone'); setJoneDialogueIndex(0) }
    else if (choice === 'adventure') { setScene('screen3'); setScreen3ClickCount(0) }
  }


  // Arena character selection
  const handleArenaCharacterSelect = (char) => {
    playClickSound()
    setArenaCharacter(char)
    setArenaStep('pokie')
  }

  // Arena pokie selection
  const handlePokieSelect = (pokie) => {
    playClickSound()
    setSelectedPokie(pokie)
    setArenaStep('booster')
  }

  // Arena booster selection
  const handleBoosterSelect = (booster) => {
    playClickSound()
    setSelectedBooster(booster)
    setArenaStep('difficulty')
  }

  // Arena difficulty selection and start battle
  const handleDifficultySelect = (diff) => {
    playClickSound()
    setDifficulty(diff)

    // Determine enemy element based on difficulty
    const playerElement = selectedElement
    let enemyElement
    if (diff === 'easy') {
      enemyElement = ELEMENTS[playerElement].strong // Enemy is weak to player
    } else if (diff === 'hard') {
      enemyElement = playerElement // Same element
    } else {
      enemyElement = ELEMENTS[playerElement].weak // Enemy is strong against player
    }

    // Pick random enemy pokie from that element
    const enemyOptions = POKIES[enemyElement]
    const randomEnemy = enemyOptions[Math.floor(Math.random() * enemyOptions.length)]
    setEnemyPokie({ ...randomEnemy, element: enemyElement })

    setPlayerHP(100)
    setEnemyHP(100)
    setBattleLog('')
    setIsPlayerTurn(true)
    setArenaBoosterUsed(false)
    setArenaSwordShown(false)
    setArenaStep('battle')
  }

  // Calculate damage with element effectiveness
  const calculateDamage = (baseDamage, attackerElement, defenderElement, isPlayer) => {
    let damage = baseDamage + Math.floor(Math.random() * 10)

    // Element effectiveness
    if (ELEMENTS[attackerElement].strong === defenderElement) {
      damage = Math.floor(damage * 1.5) // Super effective
    } else if (ELEMENTS[attackerElement].weak === defenderElement) {
      damage = Math.floor(damage * 0.7) // Not very effective
    }

    // Booster effects for player
    if (isPlayer && selectedBooster === 'sword') {
      damage = Math.floor(damage * 1.5)
    }

    // Hard difficulty: enemy does 1x more damage (2x total)
    if (!isPlayer && difficulty === 'hard') {
      damage = Math.floor(damage * 2)
    }

    return damage
  }

  const dialogues = [
    "Yeey! Finally i got my first pokie!",
    "I can be a Pokie trainer now!!",
    "Who should i tell good news first??"
  ]

  // Entry screen
  if (!gameStarted) {
    return (
      <div className="entry-screen">
        <div className="game-title">Pokeween</div>
        <div className="entry-buttons">
          <button className="start-button" onClick={() => handleStartGame('story')}>
            Story Mode
          </button>
          <button className="start-button arena-button" onClick={() => handleStartGame('arena')}>
            Arena Battle
          </button>
        </div>
      </div>
    )
  }


  // Arena Mode
  if (scene === 'arena') {
    const goBack = (step) => {
      playClickSound()
      setArenaStep(step)
    }

    // Character Selection
    if (arenaStep === 'character') {
      return (
        <div className="game-screen arena-select-screen">
          <button className="back-button" onClick={() => { playClickSound(); if (bgMusicRef.current) { bgMusicRef.current.pause(); bgMusicRef.current.currentTime = 0; currentBgTrack.current = '' } if (loseSoundRef.current) { loseSoundRef.current.pause(); loseSoundRef.current.currentTime = 0 } setGameStarted(false); setGameMode(null); setScene('intro') }}>←</button>
          <div className="arena-container">
            <h2 className="arena-title">Choose Your Fighter</h2>
            <div className="character-options">
              <div className="char-option" onClick={() => handleArenaCharacterSelect('/h-angry-min.png')}>
                <img src="/h-angry-min.png" alt="Fighter 1" />
                <span>Hero</span>
              </div>
              <div className="char-option" onClick={() => handleArenaCharacterSelect('/c2-confident-min.png')}>
                <img src="/c2-confident-min.png" alt="Fighter 2" />
                <span>Ema</span>
              </div>
              <div className="char-option" onClick={() => handleArenaCharacterSelect('/c3-confident-min.png')}>
                <img src="/c3-confident-min.png" alt="Fighter 3" />
                <span>Jone</span>
              </div>
            </div>
          </div>
        </div>
      )
    }

    // Pokie Selection
    if (arenaStep === 'pokie') {
      const currentPokies = POKIES[selectedElement]
      return (
        <div className="game-screen arena-select-screen">
          <button className="back-button" onClick={() => goBack('character')}>←</button>
          <div className="arena-container">
            <h2 className="arena-title">Choose Your Pokie</h2>
            <div className="element-toggle">
              <button className={`element-btn fire ${selectedElement === 'fire' ? 'active' : ''}`}
                onClick={() => { playClickSound(); setSelectedElement('fire') }}>🔥 Fire</button>
              <button className={`element-btn air ${selectedElement === 'air' ? 'active' : ''}`}
                onClick={() => { playClickSound(); setSelectedElement('air') }}>💨 Air</button>
              <button className={`element-btn water ${selectedElement === 'water' ? 'active' : ''}`}
                onClick={() => { playClickSound(); setSelectedElement('water') }}>💧 Water</button>
            </div>
            <div className="element-info">
              {selectedElement === 'fire' && <p>🔥 Fire is strong against Air, weak to Water</p>}
              {selectedElement === 'air' && <p>💨 Air is strong against Water, weak to Fire</p>}
              {selectedElement === 'water' && <p>💧 Water is strong against Fire, weak to Air</p>}
            </div>
            <div className="pokie-options">
              {currentPokies.map(pokie => (
                <div key={pokie.id} className="pokie-option" onClick={() => handlePokieSelect({ ...pokie, element: selectedElement })}>
                  <img src={pokie.image} alt={pokie.name} />
                  <span>{pokie.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )
    }

    // Booster Selection
    if (arenaStep === 'booster') {
      return (
        <div className="game-screen arena-select-screen">
          <button className="back-button" onClick={() => goBack('pokie')}>←</button>
          <div className="arena-container">
            <h2 className="arena-title">Choose Your Booster</h2>
            <div className="booster-options">
              <div className="booster-option" onClick={() => handleBoosterSelect('heart')}>
                <img src="/heart-min.png" alt="Heart Crystal" />
                <span>Crystal Heart</span>
                <p className="booster-desc">Revives your Pokie once when HP reaches 0, restoring full health!</p>
              </div>
              <div className="booster-option" onClick={() => handleBoosterSelect('sword')}>
                <img src="/sword-min.png" alt="Crystal Sword" />
                <span>Crystal Sword</span>
                <p className="booster-desc">Increases all your attack damage by 50% throughout the battle!</p>
              </div>
            </div>
          </div>
        </div>
      )
    }

    // Difficulty Selection
    if (arenaStep === 'difficulty') {
      return (
        <div className="game-screen arena-select-screen">
          <button className="back-button" onClick={() => goBack('booster')}>←</button>
          <div className="arena-container">
            <h2 className="arena-title">Select Difficulty</h2>
            <div className="difficulty-options">
              <div className="difficulty-option easy" onClick={() => handleDifficultySelect('easy')}>
                <span className="diff-name">Easy</span>
                <p className="diff-desc">Enemy Pokie is weak against your element type</p>
              </div>
              <div className="difficulty-option hard" onClick={() => handleDifficultySelect('hard')}>
                <span className="diff-name">Hard</span>
                <p className="diff-desc">Same element type, but enemy deals 2x damage</p>
              </div>
              <div className="difficulty-option veryhard" onClick={() => handleDifficultySelect('veryhard')}>
                <span className="diff-name">Very Hard</span>
                <p className="diff-desc">Enemy Pokie is strong against your element type</p>
              </div>
            </div>
          </div>
        </div>
      )
    }


    // Arena Battle
    if (arenaStep === 'battle') {
      // Show sword animation at start
      if (selectedBooster === 'sword' && !arenaSwordShown && !showItemAnimation) {
        setArenaSwordShown(true)
        setTimeout(() => {
          playItemUsedSound()
          setShowItemAnimation(true)
          setItemAnimationType('sword')
          setItemMessage("Crystal Sword activated! Your damage increased by 50%!")
          setTimeout(() => setShowItemAnimation(false), 3000)
        }, 500)
      }

      const handleArenaAttack = (attackIndex) => {
        if (!isPlayerTurn || playerHP <= 0 || enemyHP <= 0) return

        const damageGivenSound = new Audio('/damage given.mp3')
        damageGivenSound.play().catch(e => console.log('Audio play failed:', e))

        const attack = selectedPokie.attacks[attackIndex]
        const damage = calculateDamage(attack.baseDamage, selectedPokie.element, enemyPokie.element, true)
        const newEnemyHP = Math.max(0, enemyHP - damage)
        setEnemyHP(newEnemyHP)

        let effectiveness = ''
        if (ELEMENTS[selectedPokie.element].strong === enemyPokie.element) {
          effectiveness = " It's super effective!"
        } else if (ELEMENTS[selectedPokie.element].weak === enemyPokie.element) {
          effectiveness = " It's not very effective..."
        }
        setBattleLog(`${selectedPokie.name} used ${attack.name}! Dealt ${damage} damage!${effectiveness}`)
        setIsPlayerTurn(false)

        if (newEnemyHP <= 0) {
          setTimeout(() => {
            setBattleLog(`Victory! ${enemyPokie.name} fainted!`)
            const wonSound = new Audio('/won.mp3')
            wonSound.play().catch(e => console.log('Audio play failed:', e))
            setTimeout(() => setScene('screen5'), 2000)
          }, 1000)
          return
        }

        // Enemy turn
        setTimeout(() => {
          const damageTakenSound = new Audio('/damage taken.mp3')
          damageTakenSound.play().catch(e => console.log('Audio play failed:', e))

          const enemyAttack = enemyPokie.attacks[Math.floor(Math.random() * 3)]
          const enemyDamage = calculateDamage(enemyAttack.baseDamage, enemyPokie.element, selectedPokie.element, false)
          const newPlayerHP = Math.max(0, playerHP - enemyDamage)
          setPlayerHP(newPlayerHP)

          let enemyEffectiveness = ''
          if (ELEMENTS[enemyPokie.element].strong === selectedPokie.element) {
            enemyEffectiveness = " It's super effective!"
          } else if (ELEMENTS[enemyPokie.element].weak === selectedPokie.element) {
            enemyEffectiveness = " It's not very effective..."
          }
          setBattleLog(`${enemyPokie.name} used ${enemyAttack.name}! Dealt ${enemyDamage} damage!${enemyEffectiveness}`)

          if (newPlayerHP <= 0 && selectedBooster === 'heart' && !arenaBoosterUsed) {
            setTimeout(() => {
              playItemUsedSound()
              setShowItemAnimation(true)
              setItemAnimationType('heart')
              setItemMessage('Crystal Heart revived your Pokie!')
              setPlayerHP(100)
              setArenaBoosterUsed(true)
              setTimeout(() => {
                setShowItemAnimation(false)
                setBattleLog('Your Pokie is back at full health!')
                setTimeout(() => setIsPlayerTurn(true), 1500)
              }, 3000)
            }, 1000)
          } else if (newPlayerHP <= 0) {
            setTimeout(() => {
              setBattleLog(`Defeat! ${selectedPokie.name} fainted!`)
              loseSoundRef.current = new Audio('/lose.mp3')
              loseSoundRef.current.play().catch(e => console.log('Audio play failed:', e))
              setTimeout(() => setScene('defeat'), 2000)
            }, 1000)
          } else {
            setTimeout(() => setIsPlayerTurn(true), 1500)
          }
        }, 1500)
      }

      return (
        <div className="game-screen arena-battle-scene">
          {showItemAnimation && (
            <div className="item-animation-overlay">
              <div className="item-animation-content">
                <img src={itemAnimationType === 'heart' ? '/heart-min.png' : '/sword-min.png'} alt="Item" className="animated-item" />
                <p className="item-animation-text">{itemMessage}</p>
              </div>
            </div>
          )}
          <div className="battle-container">
            <div className="battle-field">
              <div className="enemy-side">
                <div className="trainer-info">
                  <img src="/v-angry-min.png" alt="Enemy" className="trainer-sprite" />
                  <span className="trainer-name">Villain</span>
                </div>
                <div className="pokie-container enemy">
                  <div className="hp-bar-container">
                    <div className="pokie-name">{enemyPokie.name} <span className="element-badge" style={{ background: ELEMENTS[enemyPokie.element].color }}>{enemyPokie.element}</span></div>
                    <div className="hp-bar"><div className="hp-fill enemy-hp" style={{ width: `${enemyHP}%` }}></div></div>
                    <div className="hp-text">{enemyHP}/100 HP</div>
                  </div>
                  <img src={enemyPokie.image} alt={enemyPokie.name} className="pokie-sprite enemy-pokie" />
                </div>
              </div>
              <div className="player-side">
                <div className="pokie-container player">
                  <img src={selectedPokie.image} alt={selectedPokie.name} className="pokie-sprite player-pokie" />
                  <div className="hp-bar-container">
                    <div className="pokie-name">{selectedPokie.name} <span className="element-badge" style={{ background: ELEMENTS[selectedPokie.element].color }}>{selectedPokie.element}</span></div>
                    <div className="hp-bar"><div className="hp-fill player-hp" style={{ width: `${playerHP}%` }}></div></div>
                    <div className="hp-text">{playerHP}/100 HP</div>
                  </div>
                </div>
                <div className="trainer-info">
                  <img src={arenaCharacter} alt="Player" className="trainer-sprite" />
                  <span className="trainer-name">You</span>
                </div>
              </div>
            </div>
            <div className="battle-ui">
              <div className="battle-log">{battleLog || `What will ${selectedPokie.name} do?`}</div>
              {isPlayerTurn && playerHP > 0 && enemyHP > 0 && (
                <div className="attack-buttons">
                  {selectedPokie.attacks.map((attack, idx) => (
                    <button key={idx} className="attack-btn" onClick={() => handleArenaAttack(idx)}>{attack.name}</button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )
    }
  }


  // Defeat screen
  if (scene === 'defeat') {
    return (
      <div className="game-screen defeat-scene">
        <button className="back-button" onClick={goToHome}>←</button>
        <div className="defeat-container">
          <h1 className="defeat-text">You Lost...</h1>
          <p className="defeat-message">Your Pokie was defeated. Better luck next time!</p>
          <button className="replay-button" onClick={() => { playClickSound(); resetArena(); setScene('arena') }}>
            Try Again
          </button>
        </div>
      </div>
    )
  }

  const characterImage = dialogueIndex === 2 ? "/c1-think-min.png" : "/c1-happy-min.png"

  // Victory screen (shared)
  if (scene === 'screen5') {
    return (
      <div className="game-screen screen5-scene">
        <button className="back-button" onClick={goToHome}>←</button>
        <div className="victory-container">
          <h1 className="victory-text">Victory!</h1>
          <p className="victory-message">{gameMode === 'arena' ? 'You won the arena battle!' : 'You defeated the villain and saved the day!'}</p>
          {gameMode === 'arena' && (
            <button className="replay-button" onClick={() => { playClickSound(); resetArena(); setScene('arena') }}>
              Play Again
            </button>
          )}
        </div>
      </div>
    )
  }

  // Screen 4 - Story battle
  if (scene === 'screen4') {
    const handleScreen4Next = () => {
      playClickSound()
      if (screen4ClickCount < 2) setScreen4ClickCount(screen4ClickCount + 1)
    }

    const handleAttack = (attackType) => {
      if (!isPlayerTurn || playerHP <= 0 || enemyHP <= 0) return
      const damageGivenSound = new Audio('/damage given.mp3')
      damageGivenSound.play().catch(e => console.log('Audio play failed:', e))

      const baseDamages = { tackle: Math.floor(Math.random() * 15) + 10, bite: Math.floor(Math.random() * 20) + 15, thunder: Math.floor(Math.random() * 25) + 20 }
      let damageMultiplier = 1
      if (choseJone) damageMultiplier = 1.5
      else if (choseEma && !heartUsed) damageMultiplier = 0.5
      else if (choseEma && heartUsed) damageMultiplier = 2

      const attacks = {
        tackle: { name: 'Tackle', damage: Math.floor(baseDamages.tackle * damageMultiplier) },
        bite: { name: 'Bite', damage: Math.floor(baseDamages.bite * damageMultiplier) },
        thunder: { name: 'Thunder', damage: Math.floor(baseDamages.thunder * damageMultiplier) }
      }

      const playerAttack = attacks[attackType]
      const newEnemyHP = Math.max(0, enemyHP - playerAttack.damage)
      setEnemyHP(newEnemyHP)
      setBattleLog(`Zephyr used ${playerAttack.name}! Dealt ${playerAttack.damage} damage!`)
      setIsPlayerTurn(false)

      if (newEnemyHP <= 0) {
        setTimeout(() => {
          setBattleLog('Victory! Blazer fainted!')
          const wonSound = new Audio('/won.mp3')
          wonSound.play().catch(e => console.log('Audio play failed:', e))
          setTimeout(() => setScene('screen5'), 2000)
        }, 1000)
        return
      }

      setTimeout(() => {
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
        setBattleLog(`Blazer used ${enemyAttack.name}! Dealt ${enemyAttack.damage} damage!`)

        if (newPlayerHP <= 0 && choseEma && !heartUsed) {
          setTimeout(() => {
            playItemUsedSound()
            setShowItemAnimation(true)
            setItemAnimationType('heart')
            setItemMessage('Crystal Heart had healed your Pokie!')
            setPlayerHP(100)
            setHeartUsed(true)
            setTimeout(() => { setShowItemAnimation(false); setBattleLog('Your Pokie is back at full health!'); setTimeout(() => setIsPlayerTurn(true), 1500) }, 3000)
          }, 1000)
        } else if (newPlayerHP <= 0) {
          setTimeout(() => setBattleLog('Defeat! Zephyr fainted!'), 1000)
        } else {
          setTimeout(() => setIsPlayerTurn(true), 1500)
        }
      }, 1500)
    }

    if (screen4ClickCount >= 2) {
      if (choseJone && !swordShown && !showItemAnimation) {
        setSwordShown(true)
        setTimeout(() => {
          playItemUsedSound()
          setShowItemAnimation(true)
          setItemAnimationType('sword')
          setItemMessage("Jon's crystal sword has increased your Pokie's damage greatly!")
          setTimeout(() => setShowItemAnimation(false), 3000)
        }, 500)
      }

      return (
        <div className="game-screen screen4c-scene">
          {showItemAnimation && (
            <div className="item-animation-overlay">
              <div className="item-animation-content">
                <img src={itemAnimationType === 'heart' ? '/heart-min.png' : '/sword-min.png'} alt="Item" className="animated-item" />
                <p className="item-animation-text">{itemMessage}</p>
              </div>
            </div>
          )}
          <div className="battle-container">
            <div className="battle-field">
              <div className="enemy-side">
                <div className="trainer-info"><img src="/v-angry-min.png" alt="Enemy Trainer" className="trainer-sprite" /><span className="trainer-name">Villain</span></div>
                <div className="pokie-container enemy">
                  <div className="hp-bar-container">
                    <div className="pokie-name">Blazer</div>
                    <div className="hp-bar"><div className="hp-fill enemy-hp" style={{ width: `${enemyHP}%` }}></div></div>
                    <div className="hp-text">{enemyHP}/100 HP</div>
                  </div>
                  <img src="/fire2.png" alt="Blazer" className="pokie-sprite enemy-pokie" />
                </div>
              </div>
              <div className="player-side">
                <div className="pokie-container player">
                  <img src="/air2.png" alt="Zephyr" className="pokie-sprite player-pokie" />
                  <div className="hp-bar-container">
                    <div className="pokie-name">Zephyr</div>
                    <div className="hp-bar"><div className="hp-fill player-hp" style={{ width: `${playerHP}%` }}></div></div>
                    <div className="hp-text">{playerHP}/100 HP</div>
                  </div>
                </div>
                <div className="trainer-info"><img src="/h-angry-min.png" alt="Player Trainer" className="trainer-sprite" /><span className="trainer-name">You</span></div>
              </div>
            </div>
            <div className="battle-ui">
              <div className="battle-log">{battleLog || 'What will Zephyr do?'}</div>
              {isPlayerTurn && playerHP > 0 && enemyHP > 0 && (
                <div className="attack-buttons">
                  <button className="attack-btn" onClick={() => handleAttack('tackle')}>Tackle</button>
                  <button className="attack-btn" onClick={() => handleAttack('bite')}>Bite</button>
                  <button className="attack-btn" onClick={() => handleAttack('thunder')}>Thunder</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )
    }

    const handleScreen4Back = () => {
      playClickSound()
      if (screen4ClickCount > 0) {
        setScreen4ClickCount(screen4ClickCount - 1)
      } else {
        setScene('screen3')
        setScreen3ClickCount(2)
      }
    }

    return (
      <div className={`game-screen ${screen4ClickCount === 1 ? 'screen4b-scene' : 'screen4-scene'}`}>
        <button className="back-button" onClick={handleScreen4Back}>←</button>
        <button className="top-right-next-button" onClick={handleScreen4Next}>→</button>
      </div>
    )
  }


  // Screen 3 - Night scene
  if (scene === 'screen3') {
    const handleScreen3Next = () => {
      playClickSound()
      if (screen3ClickCount < 2) setScreen3ClickCount(screen3ClickCount + 1)
      else setScene('screen4')
    }
    let sceneClass = 'screen3-scene'
    let dialogueText = "I love night time... so peaceful. Night shifts are better than day ones after all!!"
    if (screen3ClickCount === 1) { sceneClass = 'screen3b-scene'; dialogueText = "What was that?!" }
    else if (screen3ClickCount >= 2) { sceneClass = 'screen3c-scene'; dialogueText = "Even Pokies got scared of that sound, I need to check it out!" }

    const handleScreen3Back = () => {
      playClickSound()
      if (screen3ClickCount > 0) {
        setScreen3ClickCount(screen3ClickCount - 1)
      } else {
        // Go back to the path user chose (ema, jone, or adventure)
        if (choseEma) { setScene('ema'); setEmaDialogueIndex(7) }
        else if (choseJone) { setScene('jone'); setJoneDialogueIndex(7) }
        else { setScene('intro'); setDialogueIndex(2) }
      }
    }

    return (
      <div className={`game-screen ${sceneClass}`}>
        <button className="back-button" onClick={handleScreen3Back}>←</button>
        <div className="center-dialogue-container">
          <div className="dialogue-box">
            <p className="character-name red">Me</p>
            <p className="dialogue-text">{dialogueText}</p>
            <button className="next-button" onClick={handleScreen3Next}>→</button>
          </div>
        </div>
      </div>
    )
  }

  // Jone scene
  if (scene === 'jone') {
    let leftCharacter = "/c1-smile-min.png", rightCharacter = "/c3-think-min.png", speakerName = "You", nameColor = "", dialogueText = "Hey Jone!! You there?", showItemReceived = false
    if (joneDialogueIndex === 1) { rightCharacter = "/c3-shock-min.png"; speakerName = "Jone"; nameColor = "green"; dialogueText = "Hey!! Alex!! When did you get here?" }
    else if (joneDialogueIndex === 2) { leftCharacter = "/c1-talk1-min.png"; rightCharacter = "/c3-shock-min.png"; speakerName = "Me"; nameColor = "red"; dialogueText = "Just now, you know, today I got my first Pokie from Dr.Wattson!!" }
    else if (joneDialogueIndex === 3) { leftCharacter = "/c1-talk1-min.png"; rightCharacter = "/c3-confident-min.png"; speakerName = "Jone"; nameColor = "green"; dialogueText = "Hey, Congratulations Alex! I am happy for you!" }
    else if (joneDialogueIndex === 4) { leftCharacter = "/c1-talk1-min.png"; rightCharacter = "/c3-confident-min.png"; speakerName = "Jone"; nameColor = "green"; dialogueText = "So, ready to be a Pokie Protector?" }
    else if (joneDialogueIndex === 5) { leftCharacter = "/c1-exited-min.png"; rightCharacter = "/c3-confident-min.png"; speakerName = "Me"; nameColor = "red"; dialogueText = "Yes! I can't wait to start my new life!" }
    else if (joneDialogueIndex === 6) { leftCharacter = "/c1-exited-min.png"; rightCharacter = "/c3-smile-min.png"; speakerName = "Jone"; nameColor = "green"; dialogueText = "Calm down, it won't be easy, so take this. It will help you!" }
    else if (joneDialogueIndex === 7) { leftCharacter = "/c1-exited-min.png"; rightCharacter = "/c3-smile-min.png"; speakerName = ""; dialogueText = "Jone gave you a Sword..."; showItemReceived = true }

    return (
      <div className="game-screen ema-scene">
        <button className="back-button" onClick={() => { playClickSound(); setScene('intro'); setJoneDialogueIndex(0) }}>←</button>
        <div className="two-character-scene">
          <div className="character-container left"><img src={leftCharacter} alt="Character 1" className="character" /></div>
          <div className="dialogue-box-wrapper">
            {showItemReceived && <div className="item-received"><img src="/sword-min.png" alt="Sword" className="item-image" /></div>}
            <div className="dialogue-box">
              {speakerName && <p className={`character-name ${nameColor}`}>{speakerName}</p>}
              <p className="dialogue-text">{dialogueText}</p>
              <button className="next-button" onClick={handleJoneNextDialogue}>→</button>
            </div>
          </div>
          <div className="character-container right"><img src={rightCharacter} alt="Character 2" className="character" /></div>
        </div>
      </div>
    )
  }

  // Ema scene
  if (scene === 'ema') {
    let leftCharacter = "/c1-smile-min.png", rightCharacter = "/c2-think-min.png", speakerName = "You", nameColor = "", dialogueText = "Hey Ema!! You there?", showItemReceived = false
    if (emaDialogueIndex === 1) { rightCharacter = "/c2-shock-min.png"; speakerName = "Ema"; nameColor = "pink"; dialogueText = "Hey!! Alex!! When did you get here?" }
    else if (emaDialogueIndex === 2) { leftCharacter = "/c1-talk1-min.png"; rightCharacter = "/c2-shock-min.png"; speakerName = "Me"; nameColor = "red"; dialogueText = "Just now, you know, today I got my first Pokie from Dr.Wattson!!" }
    else if (emaDialogueIndex === 3) { leftCharacter = "/c1-talk1-min.png"; rightCharacter = "/c2-confident-min.png"; speakerName = "Ema"; nameColor = "pink"; dialogueText = "Hey, Congratulations Alex! I am happy for you!" }
    else if (emaDialogueIndex === 4) { leftCharacter = "/c1-talk1-min.png"; rightCharacter = "/c2-confident-min.png"; speakerName = "Ema"; nameColor = "pink"; dialogueText = "So, ready to be a Pokie Protector?" }
    else if (emaDialogueIndex === 5) { leftCharacter = "/c1-exited-min.png"; rightCharacter = "/c2-confident-min.png"; speakerName = "Me"; nameColor = "red"; dialogueText = "Yes! I can't wait to start my new life!" }
    else if (emaDialogueIndex === 6) { leftCharacter = "/c1-exited-min.png"; rightCharacter = "/c2-smile-min.png"; speakerName = "Ema"; nameColor = "pink"; dialogueText = "Calm down, it won't be easy, so take this. It will help you!" }
    else if (emaDialogueIndex === 7) { leftCharacter = "/c1-exited-min.png"; rightCharacter = "/c2-smile-min.png"; speakerName = ""; dialogueText = "Ema gave you a Heart crystal..."; showItemReceived = true }

    return (
      <div className="game-screen ema-scene">
        <button className="back-button" onClick={() => { playClickSound(); setScene('intro'); setEmaDialogueIndex(0) }}>←</button>
        <div className="two-character-scene">
          <div className="character-container left"><img src={leftCharacter} alt="Character 1" className="character" /></div>
          <div className="dialogue-box-wrapper">
            {showItemReceived && <div className="item-received"><img src="/heart-min.png" alt="Heart Crystal" className="item-image" /></div>}
            <div className="dialogue-box">
              {speakerName && <p className={`character-name ${nameColor}`}>{speakerName}</p>}
              <p className="dialogue-text">{dialogueText}</p>
              <button className="next-button" onClick={handleEmaNextDialogue}>→</button>
            </div>
          </div>
          <div className="character-container right"><img src={rightCharacter} alt="Character 2" className="character" /></div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="game-screen">
        <button className="back-button" onClick={goToHome}>←</button>
        <div className="scene-content">
          <div className="character-container"><img src={characterImage} alt="Character" className="character" /></div>
          <div className="dialogue-box">
            <p className="character-name">You</p>
            <p className="dialogue-text">{dialogues[dialogueIndex]}</p>
            {dialogueIndex < 2 ? (
              <button className="next-button" onClick={handleNextDialogue}>→</button>
            ) : (
              <div className="choices-container">
                <button className="choice-button" onClick={() => handleChoice('ema')}>Tell Ema First!</button>
                <button className="choice-button" onClick={() => handleChoice('jone')}>Tell Jone First!</button>
                <button className="choice-button" onClick={() => handleChoice('adventure')}>Go directly on adventure!</button>
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

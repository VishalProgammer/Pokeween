# Implementation Plan

- [ ] 1. Set up game data structures and constants

  - Create data models file with Scene, Creature, and Attack TypeScript/JSDoc definitions
  - Define sample story scenes with backgrounds, characters, and dialogue
  - Define creature data with stats, sprites, and level-based attacks
  - Create constants for animation timings and game configuration
  - _Requirements: 1.1, 2.1, 3.2, 5.1, 5.2_

- [ ] 2. Implement Game State Manager

  - Create custom hook or context for managing global game state (mode, scene index, player progress)
  - Implement startGame() function to transition from entry to first story scene
  - Implement advanceStory() function to move between scenes and detect battle triggers
  - Implement startBattle() and endBattle() functions for battle mode transitions
  - _Requirements: 1.2, 3.1_

- [ ] 3. Build Entry Screen Component

  - Create EntryScreen component with background image
  - Add "Let's start the journey!" button with click handler
  - Implement transition effect when starting game
  - Style component with CSS for centered layout
  - _Requirements: 1.1_

- [ ] 4. Create Story Screen Component

  - Build StoryScreen component that receives scene data as props
  - Implement background image rendering with transition effects
  - Add character sprite positioning (left/right/center)
  - Integrate DialogueBubble component into story screen
  - Handle scene advancement through onAdvance callback
  - _Requirements: 1.2, 1.3, 2.4_

- [ ] 5. Implement Dialogue Bubble with Text Animation

  - Create DialogueBubble component with text and speaker props
  - Implement typewriter animation using useEffect and setInterval (50ms per character)
  - Track animation state to control when text reveal is complete
  - Show navigation arrow only after text animation finishes
  - Add click handler for navigation arrow to advance to next scene
  - Style dialogue bubble with CSS (positioning, background, arrow indicator)
  - _Requirements: 1.4, 1.5, 2.1, 2.2, 2.3_

- [ ] 6. Build Battle Arena Component

  - Create BattleArena component with battle state management
  - Initialize battle with player and opponent creature data
  - Implement turn-based flow logic (player turn → opponent turn → repeat)
  - Add battle log display for showing attack messages
  - Implement battle end detection when creature HP reaches zero
  - Handle battle result and transition back to story mode
  - _Requirements: 3.1, 4.4, 4.5_

- [ ] 7. Create Creature Display Component

  - Build CreatureDisplay component showing sprite, name, level, and HP
  - Implement HP bar visualization with percentage-based width
  - Add positioning logic for left vs right side placement
  - Style creature display with CSS for proper battle layout
  - Update HP bar dynamically when creature takes damage
  - _Requirements: 3.2, 4.5_

- [ ] 8. Implement Attack System and UI

  - Create AttackPanel component displaying available attack buttons
  - Filter attacks based on creature's current level
  - Implement attack selection handler for player input
  - Disable attack buttons during opponent turn or animations
  - Display attack name and damage value on each button
  - Style attack panel with CSS for grid/flex layout
  - _Requirements: 3.3, 3.4, 4.1, 5.1, 5.2, 5.4_

- [ ] 9. Implement Battle Combat Logic

  - Create damage calculation function that reduces target HP by attack damage
  - Implement player attack execution with HP update and animation
  - Implement opponent AI that randomly selects from available attacks
  - Execute opponent attack with HP update and animation
  - Add attack animation delays for better visual feedback
  - Clamp HP values to minimum of 0 and maximum of maxHP
  - _Requirements: 4.1, 4.2, 4.3, 5.3_

- [ ] 10. Integrate all components in App.jsx

  - Update App component to use Game State Manager
  - Conditionally render EntryScreen, StoryScreen, or BattleArena based on game mode
  - Wire up all component callbacks and state updates
  - Test complete flow from entry → story → battle → story
  - _Requirements: 1.1, 1.2, 3.1_

- [ ] 11. Add error handling and edge cases

  - Implement error boundary component for React errors
  - Add error handling for missing scene data or invalid indices
  - Handle image loading failures with placeholder assets
  - Add validation for attack selection and HP calculations
  - Display user-friendly error messages
  - _Requirements: All requirements (error handling)_

- [ ] 12. Style and polish the game

  - Create comprehensive CSS for all components with consistent theme
  - Add transition effects for scene changes and battle start/end
  - Implement responsive design for mobile and desktop viewports
  - Add hover and active states for interactive elements
  - Optimize images and test performance
  - _Requirements: All requirements (visual polish)_

- [ ]\* 13. Write unit tests for core game logic
  - Write tests for damage calculation and HP updates
  - Write tests for attack filtering by creature level
  - Write tests for battle end condition detection
  - Write tests for scene advancement logic
  - _Requirements: 4.1, 4.3, 4.4, 5.1_

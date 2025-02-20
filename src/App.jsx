import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import WelcomeScreen from './components/WelcomeScreen';
import GameScreen from './components/GameScreen';
import styled from 'styled-components';

const AppContainer = styled.div`
  width: 100vw;
  min-height: 100vh;
  overflow-x: hidden;
`;

function App() {
  const [gameState, setGameState] = useState({
    isPlaying: false,
    level: 'easy'
  });

  const handleStartGame = (level) => {
    setGameState({
      isPlaying: true,
      level
    });
  };

  const handleBackToMenu = () => {
    setGameState({
      isPlaying: false,
      level: 'easy'
    });
  };

  return (
    <AppContainer>
      <AnimatePresence mode="wait">
        {!gameState.isPlaying ? (
          <WelcomeScreen key="welcome" onStartGame={handleStartGame} />
        ) : (
          <GameScreen 
            key="game"
            level={gameState.level}
            onBackToMenu={handleBackToMenu}
          />
        )}
      </AnimatePresence>
    </AppContainer>
  );
}

export default App; 
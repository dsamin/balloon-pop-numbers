import { useState, useEffect, lazy, Suspense } from 'react';
import Balloon from './Balloon';
import useSound from 'use-sound';
import Background from './Background';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';

// Lazy load Confetti
// const Confetti = lazy(() => import('react-confetti'));

// Import your sound files
import popSoundUrl from '../assets/sounds/pop.mp3';
import successSoundUrl from '../assets/sounds/success.mp3';
import errorSoundUrl from '../assets/sounds/error.mp3';

const GameWrapper = styled.div`
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
`;

const Score = styled(motion.div)`
  position: fixed;
  top: 20px;
  right: 20px;
  font-size: 32px;
  color: white;
  background: rgba(255,255,255,0.2);
  padding: 15px 30px;
  border-radius: 25px;
  backdrop-filter: blur(8px);
  box-shadow: 
    0 4px 15px rgba(0,0,0,0.1),
    inset 0 0 0 1px rgba(255,255,255,0.2);
  z-index: 100;
`;

const BackButton = styled(motion.button)`
  position: fixed;
  top: 20px;
  left: 20px;
  padding: 15px 30px;
  font-size: 24px;
  border: none;
  border-radius: 25px;
  background: linear-gradient(145deg, #FF6B6B, #ff8585);
  color: white;
  cursor: pointer;
  font-family: 'Comic Sans MS', cursive, sans-serif;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
  box-shadow: 
    0 8px 0 #FF4F4F,
    0 15px 20px rgba(0,0,0,0.15);
  transition: all 0.2s;
  z-index: 100;

  &:active {
    transform: translateY(4px);
    box-shadow: 
      0 4px 0 #FF4F4F,
      0 8px 10px rgba(0,0,0,0.15);
  }
`;

const Timer = styled(motion.div)`
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 36px;
  color: white;
  background: rgba(255,255,255,0.2);
  padding: 15px 40px;
  border-radius: 25px;
  backdrop-filter: blur(8px);
  box-shadow: 
    0 4px 15px rgba(0,0,0,0.1),
    inset 0 0 0 1px rgba(255,255,255,0.2);
  font-family: 'Comic Sans MS', cursive, sans-serif;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
  z-index: 100;

  ${props => props.isLow && `
    color: #FF6B6B;
    animation: pulse 1s infinite;
  `}

  @keyframes pulse {
    0%, 100% { transform: translateX(-50%) scale(1); }
    50% { transform: translateX(-50%) scale(1.05); }
  }
`;

const TargetNumber = styled(motion.div)`
  position: fixed;
  top: 90px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 32px;
  color: white;
  background: rgba(255,255,255,0.2);
  padding: 15px 40px;
  border-radius: 25px;
  backdrop-filter: blur(8px);
  box-shadow: 
    0 4px 15px rgba(0,0,0,0.1),
    inset 0 0 0 1px rgba(255,255,255,0.2);
`;

const CelebrationEffect = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 100;
  
  &::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle at center, transparent 30%, rgba(255,255,255,0.1) 70%);
    animation: pulse 2s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% { transform: scale(1); opacity: 0; }
    50% { transform: scale(1.5); opacity: 1; }
  }
`;

const GameOverModal = styled(motion.div)`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(255,255,255,0.95);
  padding: 40px 60px;
  border-radius: 30px;
  text-align: center;
  z-index: 1000;
  box-shadow: 0 15px 40px rgba(0,0,0,0.2);

  h2 {
    font-size: 36px;
    color: #FF6B6B;
    margin-bottom: 20px;
    font-family: 'Comic Sans MS', cursive, sans-serif;
  }

  p {
    font-size: 24px;
    color: #666;
    font-family: 'Comic Sans MS', cursive, sans-serif;
  }
`;

const GameScreen = ({ level = 'easy', onBackToMenu }) => {
  const [targetNumber, setTargetNumber] = useState(null);
  const [balloons, setBalloons] = useState([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameOver, setGameOver] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  const [playPop] = useSound(popSoundUrl);
  const [playSuccess] = useSound(successSoundUrl);
  const [playError] = useSound(errorSoundUrl);

  const generateBalloons = () => {
    const count = level === 'easy' ? 5 : level === 'medium' ? 8 : 10;
    const maxNumber = level === 'easy' ? 5 : level === 'medium' ? 10 : 20;
    
    const numbers = new Set();
    while (numbers.size < count) {
      numbers.add(Math.floor(Math.random() * maxNumber) + 1);
    }
    
    return Array.from(numbers);
  };

  const startNewRound = () => {
    const newBalloons = generateBalloons();
    setBalloons(newBalloons);
    setTargetNumber(newBalloons[Math.floor(Math.random() * newBalloons.length)]);
  };

  const handlePop = (number) => {
    if (number === targetNumber) {
      playPop();
      playSuccess();
      setScore(score + 1);
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 2000);
      startNewRound();
    } else {
      playError();
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setGameOver(true);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (gameOver) {
      setTimeout(() => {
        onBackToMenu();
      }, 3000);
    }
  }, [gameOver]);

  useEffect(() => {
    startNewRound();
  }, [level]);

  return (
    <GameWrapper>
      <Background />
      
      <BackButton
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onBackToMenu}
      >
        ← Back
      </BackButton>

      <Timer 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        isLow={timeLeft <= 10}
      >
        {timeLeft}s
      </Timer>

      <TargetNumber
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        Find: {targetNumber}
      </TargetNumber>

      <Score
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
      >
        Score: {score}
      </Score>
      
      {balloons.map((number, index) => (
        <Balloon
          key={`${number}-${index}`}
          number={number}
          onPop={handlePop}
          isTarget={number === targetNumber}
        />
      ))}

      {showCelebration && (
        <CelebrationEffect
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />
      )}

      <AnimatePresence>
        {gameOver && (
          <GameOverModal
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
          >
            <h2>Time's Up! 🎈</h2>
            <p>Final Score: {score}</p>
          </GameOverModal>
        )}
      </AnimatePresence>
    </GameWrapper>
  );
};

export default GameScreen; 
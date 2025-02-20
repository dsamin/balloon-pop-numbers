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
`;

const TargetNumber = styled(motion.div)`
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 40px;
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

const GameScreen = ({ level = 'easy', onBackToMenu }) => {
  const [targetNumber, setTargetNumber] = useState(null);
  const [balloons, setBalloons] = useState([]);
  const [score, setScore] = useState(0);
  const [stars, setStars] = useState(0);
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
      setStars(prev => {
        const newStars = prev + 1;
        if (newStars % 5 === 0) {
          setShowCelebration(true);
          setTimeout(() => setShowCelebration(false), 2000);
        }
        return newStars;
      });
      startNewRound();
    } else {
      playError();
    }
  };

  useEffect(() => {
    startNewRound();
  }, [level]);

  return (
    <GameWrapper>
      <Background />
      <Score
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
      >
        Score: {score}
      </Score>
      <TargetNumber
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        Find: {targetNumber}
      </TargetNumber>
      
      <motion.button
        className="back-button"
        onClick={onBackToMenu}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        ← Back
      </motion.button>

      <div className="stars">
        {Array.from({ length: Math.min(5, stars % 5 + 1) }).map((_, i) => (
          <motion.span
            key={i}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="star"
          >
            ⭐
          </motion.span>
        ))}
      </div>
      
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
    </GameWrapper>
  );
};

export default GameScreen; 
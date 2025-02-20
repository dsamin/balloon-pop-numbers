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
  display: flex;
  flex-direction: column;
  align-items: center;
  background: linear-gradient(135deg, #7B68EE, #00BFFF);
`;

const Score = styled(motion.div)`
  position: fixed;
  top: 20px;
  right: 20px;
  font-size: clamp(18px, 4vw, 32px);
  color: white;
  background: linear-gradient(145deg, #FFD93D, #FFE869);
  padding: clamp(10px, 2vw, 15px) clamp(15px, 3vw, 30px);
  border-radius: 25px;
  backdrop-filter: blur(8px);
  box-shadow: 
    0 8px 0 #FFC91F,
    0 15px 20px rgba(0,0,0,0.15);
  font-family: 'Comic Sans MS', cursive, sans-serif;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
  z-index: 100;
  display: flex;
  align-items: center;
  gap: 10px;

  &::before {
    content: '🏆';
    font-size: clamp(16px, 3vw, 24px);
  }

  @media (max-width: 768px) {
    top: auto;
    bottom: 20px;
    right: 20px;
  }
`;

const BackButton = styled(motion.button)`
  position: fixed;
  top: 20px;
  left: 20px;
  padding: clamp(10px, 2vw, 15px) clamp(15px, 3vw, 30px);
  font-size: clamp(16px, 3vw, 24px);
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

  @media (max-width: 768px) {
    padding: 10px 20px;
    font-size: 18px;
  }

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
  right: 250px;
  font-size: clamp(18px, 4vw, 36px);
  color: white;
  background: linear-gradient(145deg, #FF6B6B, #FF9A8B);
  padding: clamp(10px, 2vw, 15px) clamp(15px, 3vw, 40px);
  border-radius: 25px;
  backdrop-filter: blur(8px);
  box-shadow: 
    0 8px 0 #FF4F4F,
    0 15px 20px rgba(0,0,0,0.15);
  font-family: 'Comic Sans MS', cursive, sans-serif;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
  z-index: 100;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.3s ease;

  &::before {
    content: '⏰';
    font-size: clamp(16px, 3vw, 24px);
  }

  @media (max-width: 768px) {
    top: auto;
    bottom: 20px;
    right: auto;
    left: 20px;
  }

  ${props => props.isLow && `
    color: #FFD93D;
    animation: timerPulse 1s infinite;
    background: linear-gradient(145deg, #FF4F4F, #FF6B6B);
    transform: scale(1.1);
  `}

  @keyframes timerPulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1); }
  }
`;

const TargetNumber = styled(motion.div)`
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  font-size: clamp(18px, 4vw, 36px);
  color: white;
  background: linear-gradient(145deg, #4ECDC4, #45E3FF);
  padding: clamp(10px, 2vw, 20px) clamp(15px, 3vw, 40px);
  border-radius: 25px;
  backdrop-filter: blur(8px);
  box-shadow: 
    0 8px 0 #3AA7A0,
    0 15px 20px rgba(0,0,0,0.15);
  font-family: 'Comic Sans MS', cursive, sans-serif;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
  z-index: 100;
  display: flex;
  align-items: center;
  gap: 10px;

  &::before {
    content: '🎯';
    font-size: clamp(20px, 4vw, 30px);
  }

  @media (max-width: 768px) {
    width: fit-content;
    padding: 10px 20px;
  }

  &:hover {
    transform: translateX(-50%) scale(1.05);
  }
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
  padding: clamp(20px, 4vw, 40px) clamp(30px, 6vw, 60px);
  border-radius: 30px;
  text-align: center;
  z-index: 1000;
  box-shadow: 0 15px 40px rgba(0,0,0,0.2);
  width: 90%;
  max-width: 400px;

  h2 {
    font-size: clamp(24px, 5vw, 36px);
    color: #FF6B6B;
    margin-bottom: 20px;
    font-family: 'Comic Sans MS', cursive, sans-serif;
  }

  p {
    font-size: clamp(18px, 4vw, 24px);
    color: #666;
    font-family: 'Comic Sans MS', cursive, sans-serif;
  }
`;

// Add some fun floating elements
const FloatingEmoji = styled(motion.div)`
  position: fixed;
  font-size: clamp(24px, 5vw, 40px);
  pointer-events: none;
  user-select: none;
  z-index: 1;
  opacity: 0.3;
  filter: drop-shadow(2px 2px 4px rgba(0,0,0,0.2));

  @media (max-width: 768px) {
    display: none;
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

  // Add floating emojis
  const emojis = ["🎈", "⭐", "✨", "🎯", "🎨", "🌈", "🎪", "🎭", "🎡"];

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
      
      {/* Floating emojis in background */}
      {emojis.map((emoji, index) => (
        <FloatingEmoji
          key={index}
          initial={{
            x: Math.random() * window.innerWidth,
            y: window.innerHeight + 100,
            rotate: 0,
            scale: 1,
          }}
          animate={{
            x: [
              Math.random() * window.innerWidth,
              Math.random() * window.innerWidth,
            ],
            y: [-100, window.innerHeight + 100],
            rotate: [0, 360],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: Math.random() * 10 + 15,
            repeat: Infinity,
            ease: "linear",
            times: [0, 1],
          }}
        >
          {emoji}
        </FloatingEmoji>
      ))}

      {/* UI Elements */}
      <BackButton
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onBackToMenu}
      >
        ← Back
      </BackButton>
      
      <div style={{ 
        display: 'flex', 
        gap: '30px', 
        position: 'fixed', 
        top: '20px', 
        right: '20px',
        alignItems: 'center'
      }}>
        <Timer 
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          isLow={timeLeft <= 10}
        >
          {timeLeft}s
        </Timer>

        <Score
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
        >
          Score: {score}
        </Score>
      </div>

      <TargetNumber
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        Find: {targetNumber}
      </TargetNumber>
      
      {/* Balloons */}
      {balloons.map((number, index) => (
        <Balloon
          key={`${number}-${index}`}
          number={number}
          onPop={handlePop}
          isTarget={number === targetNumber}
        />
      ))}

      {/* Celebration Effects */}
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
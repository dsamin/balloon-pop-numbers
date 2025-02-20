import { motion } from 'framer-motion';
import styled from 'styled-components';

const WelcomeContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  width: 100vw;
  background: linear-gradient(135deg, #FF61D8, #7A5CFF);
  padding: 20px;
  position: relative;
  overflow: hidden;
  margin: 0;
  box-sizing: border-box;
`;

const Title = styled(motion.h1)`
  color: white;
  font-size: clamp(2.5rem, 5vw, 4rem);
  text-align: center;
  margin-bottom: 40px;
  text-shadow: 3px 3px 0px rgba(0,0,0,0.2);
  font-family: 'Comic Sans MS', cursive, sans-serif;
  z-index: 1;
  padding: 0 20px;
`;

const BalloonContainer = styled(motion.div)`
  font-size: 150px;
  margin-bottom: 30px;
  filter: drop-shadow(0 4px 8px rgba(0,0,0,0.2));
  z-index: 1;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 90%;
  max-width: 400px;
  z-index: 1;
  padding: 0 20px;
`;

const LevelButton = styled(motion.button)`
  padding: 25px 40px;
  font-size: 28px;
  border: none;
  border-radius: 30px;
  background: ${props => props.color};
  color: white;
  cursor: pointer;
  font-family: 'Comic Sans MS', cursive, sans-serif;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
  box-shadow: 
    0 8px 0 ${props => props.shadowColor},
    0 15px 20px rgba(0,0,0,0.15);
  transition: transform 0.2s, box-shadow 0.2s;
  position: relative;
  overflow: hidden;

  &:before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 60%);
    transform: rotate(45deg);
    transition: 0.3s;
  }

  &:hover:before {
    transform: rotate(45deg) translateY(50%);
  }

  &:active {
    transform: translateY(4px);
    box-shadow: 
      0 4px 0 ${props => props.shadowColor},
      0 8px 10px rgba(0,0,0,0.15);
  }
`;

const FloatingElement = styled(motion.div)`
  position: absolute;
  font-size: ${props => props.size}px;
  user-select: none;
  z-index: 0;
  pointer-events: none;
`;

const WelcomeScreen = ({ onStartGame }) => {
  const floatingElements = [
    { emoji: "🌟", size: 40 },
    { emoji: "🎈", size: 50 },
    { emoji: "✨", size: 30 },
    { emoji: "🎯", size: 45 },
    { emoji: "🎨", size: 40 },
    { emoji: "🌈", size: 50 }
  ];

  return (
    <WelcomeContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {floatingElements.map((element, index) => (
        <FloatingElement
          key={index}
          size={element.size}
          initial={{
            x: `${Math.random() * 80 + 10}%`,
            y: `${Math.random() * 80 + 10}%`,
          }}
          animate={{
            x: [`${Math.random() * 80 + 10}%`, `${Math.random() * 80 + 10}%`],
            y: [`${Math.random() * 80 + 10}%`, `${Math.random() * 80 + 10}%`],
            rotate: 360,
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            ease: "linear",
            times: [0, 1]
          }}
        >
          {element.emoji}
        </FloatingElement>
      ))}

      <BalloonContainer
        animate={{
          y: [0, -20, 0],
          rotate: [-5, 5, -5],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <span role="img" aria-label="balloon">🎈</span>
      </BalloonContainer>

      <Title
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        Balloon Pop Numbers!
      </Title>

      <ButtonContainer>
        <LevelButton
          color="#FF6B6B"
          shadowColor="#FF4F4F"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onStartGame('easy')}
        >
          Easy (1-5) 🌟
        </LevelButton>
        <LevelButton
          color="#4ECDC4"
          shadowColor="#45B7AF"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onStartGame('medium')}
        >
          Medium (1-10) ⭐
        </LevelButton>
        <LevelButton
          color="#FFD93D"
          shadowColor="#FFC91F"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onStartGame('hard')}
        >
          Hard (1-20) 🌈
        </LevelButton>
      </ButtonContainer>
    </WelcomeContainer>
  );
};

export default WelcomeScreen; 
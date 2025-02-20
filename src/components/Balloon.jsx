import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import styled from 'styled-components';

const colors = [
  '#FF6B6B', // bright red
  '#4ECDC4', // turquoise
  '#FFD93D', // bright yellow
  '#FF9A00', // orange
  '#B693FE', // purple
  '#FF5F7E', // pink
  '#45E3FF', // bright blue
  '#7BF1A8', // mint
];

const BalloonWrapper = styled(motion.div)`
  position: absolute;
  width: clamp(50px, 10vw, 85px);
  height: clamp(60px, 12vw, 100px);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  user-select: none;
  touch-action: none;
  z-index: 2;

  &::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    background: ${props => `radial-gradient(circle at 30% 30%, ${props.balloonColor}, ${props.balloonColor}DD)`};
    border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
    box-shadow: 
      inset -8px -8px 15px rgba(0,0,0,0.1),
      inset 8px 8px 15px rgba(255,255,255,0.3),
      0 4px 8px rgba(0,0,0,0.1);
    filter: brightness(1.1);
  }

  .number {
    position: relative;
    color: white;
    font-size: clamp(1.5rem, 3vw, 2.2rem);
    font-weight: bold;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
  }

  .string {
    position: absolute;
    bottom: -30px;
    left: 50%;
    width: 2px;
    height: clamp(20px, 4vw, 30px);
    background: linear-gradient(to bottom, white, #ddd);
    transform: translateX(-50%) rotate(${props => props.stringRotation}deg);
    transform-origin: top;
    filter: drop-shadow(1px 1px 1px rgba(0,0,0,0.1));
  }

  .knot {
    position: absolute;
    bottom: -35px;
    left: 50%;
    width: 8px;
    height: 8px;
    background: #f0f0f0;
    border-radius: 50%;
    transform: translateX(-50%);
    box-shadow: 1px 1px 2px rgba(0,0,0,0.1);
  }

  .shine {
    position: absolute;
    top: 20%;
    left: 20%;
    width: 15px;
    height: 15px;
    background: rgba(255,255,255,0.4);
    border-radius: 50%;
    filter: blur(2px);
  }

  @media (max-width: 768px) {
    width: 50px;
    height: 65px;

    .number {
      font-size: 1.5rem;
    }

    .string {
      height: 12px;
      bottom: -12px;
    }

    .knot {
      bottom: -15px;
      width: 4px;
      height: 4px;
    }

    .shine {
      width: 8px;
      height: 8px;
    }
  }
`;

const Balloon = ({ number, onPop, isTarget, index, totalBalloons }) => {
  const [isPopped, setIsPopped] = useState(false);
  
  // Improved positioning logic with better spacing
  const getRandomPosition = () => {
    const isMobile = window.innerWidth <= 768;
    const balloonSize = isMobile ? 50 : 85;
    const padding = balloonSize;
    
    // Calculate available space
    const availableWidth = window.innerWidth - (padding * 2);
    const safeHeight = window.innerHeight - balloonSize;
    
    // Calculate section width based on total balloons
    const sectionWidth = availableWidth / totalBalloons;
    
    // Position balloon within its section with some randomness
    const minX = (sectionWidth * index) + padding;
    const maxX = minX + sectionWidth - balloonSize;
    
    // Add some controlled randomness within the section
    const randomOffset = (Math.random() - 0.5) * (sectionWidth * 0.5);
    let x = minX + (sectionWidth / 2) + randomOffset;
    
    // Ensure x stays within screen bounds
    x = Math.max(padding, Math.min(x, window.innerWidth - padding));
    
    // Stagger vertical positions
    const staggeredY = safeHeight + (index % 2 === 0 ? 0 : balloonSize);
    
    return { 
      x,
      y: staggeredY,
      sectionWidth // Pass this for animation boundaries
    };
  };

  const [position] = useState(getRandomPosition());
  const [stringRotation] = useState(Math.random() * 10 - 5);
  
  const randomColor = colors[Math.floor(Math.random() * colors.length)];

  const handleInteraction = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isPopped) {
      setIsPopped(true);
      setTimeout(() => onPop(number), 300);
    }
  };

  return (
    <AnimatePresence>
      {!isPopped && (
        <BalloonWrapper
          balloonColor={randomColor}
          stringRotation={stringRotation}
          initial={{ y: position.y, x: position.x, rotate: 0 }}
          animate={{ 
            y: window.innerWidth <= 768 ? 100 : -200,
            // Constrain horizontal movement within balloon's section
            x: position.x + Math.sin(Date.now() / 1000 + index) * (position.sectionWidth * 0.2),
            rotate: Math.sin(Date.now() / 1000 + index) * (window.innerWidth <= 768 ? 5 : 15),
            transition: { 
              duration: window.innerWidth <= 768 ? 5 : 8,
              ease: "linear",
            }
          }}
          exit={{ 
            scale: [1, 1.2, 0],
            opacity: [1, 1, 0],
            transition: { duration: 0.3 }
          }}
          onClick={handleInteraction}
          onTouchStart={handleInteraction}
          onTouchEnd={(e) => e.preventDefault()}
          style={{ touchAction: 'none' }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <div className="shine" />
          <div className="number">{number}</div>
          <div className="string" />
          <div className="knot" />
        </BalloonWrapper>
      )}
    </AnimatePresence>
  );
};

export default Balloon; 
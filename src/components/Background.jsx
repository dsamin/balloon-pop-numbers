import styled from 'styled-components';

const BackgroundWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: -1;
  background: linear-gradient(135deg, #7B68EE, #00BFFF);
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle at center, transparent 30%, rgba(255,255,255,0.05) 100%);
    animation: rotate 20s linear infinite;
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='50' cy='50' r='1' fill='rgba(255,255,255,0.3)'/%3E%3C/svg%3E") repeat;
    opacity: 0.5;
  }

  @keyframes rotate {
    from {
      transform: translate(-50%, -50%) rotate(0deg);
    }
    to {
      transform: translate(-50%, -50%) rotate(360deg);
    }
  }
`;

const FloatingBubbles = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  
  ${[...Array(20)].map((_, i) => `
    &::before:nth-child(${i}) {
      content: '';
      position: absolute;
      width: ${Math.random() * 20 + 10}px;
      height: ${Math.random() * 20 + 10}px;
      background: rgba(255,255,255,0.1);
      border-radius: 50%;
      left: ${Math.random() * 100}%;
      animation: float-${i} ${Math.random() * 10 + 5}s linear infinite;
    }

    @keyframes float-${i} {
      0% { transform: translateY(100vh); }
      100% { transform: translateY(-100px); }
    }
  `)}
`;

const Background = () => {
  return (
    <BackgroundWrapper>
      <FloatingBubbles />
    </BackgroundWrapper>
  );
};

export default Background; 
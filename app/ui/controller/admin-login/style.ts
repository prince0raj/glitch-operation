import styled from "styled-components";

export const AdminLoginContainer = styled.section`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 6rem 1.5rem 3rem;
  overflow: hidden;
  background: radial-gradient(
      circle at top,
      rgba(16, 185, 129, 0.08),
      transparent 45%
    ),
    radial-gradient(circle at bottom, rgba(59, 130, 246, 0.08), transparent 55%),
    #020617;

  @keyframes gridDrift {
    0% {
      transform: translate3d(-12px, -8px, 0) rotate(1deg) scale(1.08);
    }
    50% {
      transform: translate3d(12px, 8px, 0) rotate(0deg) scale(1.12);
    }
    100% {
      transform: translate3d(-12px, -8px, 0) rotate(1deg) scale(1.08);
    }
  }

  @keyframes auroraPulse {
    0% {
      transform: scale(1) translateY(0);
      opacity: 0.35;
    }
    50% {
      transform: scale(1.08) translateY(-12px);
      opacity: 0.5;
    }
    100% {
      transform: scale(1) translateY(0);
      opacity: 0.35;
    }
  }

  &::before,
  &::after {
    content: "";
    position: absolute;
    inset: -20vh;
    background: repeating-linear-gradient(
        90deg,
        transparent,
        transparent 48px,
        rgba(16, 185, 129, 0.08) 48px,
        rgba(16, 185, 129, 0.08) 50px
      ),
      repeating-linear-gradient(
        0deg,
        transparent,
        transparent 48px,
        rgba(16, 185, 129, 0.05) 48px,
        rgba(16, 185, 129, 0.05) 50px
      );
    opacity: 0.3;
    z-index: 0;
  }

  &::before {
    animation: gridDrift 24s linear infinite;
  }

  &::after {
    background: radial-gradient(
      circle,
      rgba(16, 185, 129, 0.05),
      transparent 65%
    );
    filter: blur(60px);
    opacity: 0.4;
    animation: auroraPulse 18s ease-in-out infinite;
  }
`;

export const AdminLoginWrapper = styled.div`
  position: relative;
  z-index: 1;
  width: min(100%, 480px);
  display: flex;
  justify-content: center;
`;

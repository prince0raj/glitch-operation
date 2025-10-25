import Link from "next/link";
import styled, { keyframes } from "styled-components";

const glowPulse = keyframes`
  0%, 100% {
    opacity: 0.55;
    transform: scale(1);
  }
  50% {
    opacity: 0.85;
    transform: scale(1.12);
  }
`;

const blink = keyframes`
  0%, 100% {
    opacity: 0.7;
  }
  50% {
    opacity: 0.2;
  }
`;

export const NavActions = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;

  @media (max-width: 640px) {
    width: 100%;
    justify-content: flex-start;
    flex-wrap: wrap;
    gap: 0.75rem;
  }
`;

const borderSweep = keyframes`
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
`;

export const ChallangetContainer = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: radial-gradient(
      circle at top,
      rgba(0, 212, 146, 0.08),
      transparent 65%
    ),
    #05060a;
  color: #f8fafc;
`;

export const NavBar = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1.5rem;
  row-gap: 0.85rem;
  padding: 1rem 1.75rem;
  border-bottom: 2px solid rgba(16, 185, 129, 0.5);
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(18px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.35);
  position: sticky;
  top: 0;
  z-index: 20;
  min-height: 4.25rem;

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: flex-start;
    padding: 0.85rem 1.25rem 1rem;
  }
`;

export const BrandLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.85rem;
  color: inherit;
  text-decoration: none;

  &:hover .brand-title {
    text-shadow: 0 0 18px rgba(0, 212, 146, 0.65);
  }
`;

export const BrandLogo = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 0.65rem;
  border: 1px solid rgba(16, 185, 129, 0.45);
  background: linear-gradient(
    135deg,
    rgba(0, 212, 146, 0.12),
    rgba(5, 12, 20, 0.9)
  );
  overflow: hidden;
  box-shadow: 0 0 18px rgba(0, 212, 146, 0.28);

  &::after {
    content: "";
    position: absolute;
    inset: -1px;
    border-radius: inherit;
    background: linear-gradient(
      120deg,
      transparent,
      rgba(0, 212, 146, 0.35),
      transparent
    );
    transform: translateX(-100%);
    animation: ${borderSweep} 4s linear infinite;
  }
`;

export const IconGlow = styled.span`
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: radial-gradient(circle, rgba(0, 212, 146, 0.7), transparent 70%);
  filter: blur(12px);
  opacity: 0.7;
  animation: ${glowPulse} 3.5s ease-in-out infinite;
`;

export const BrandText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;

  .brand-title {
    display: inline-flex;
    align-items: center;
    font-size: 1.25rem;
    font-weight: 800;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    font-family: var(--font-orbitron), "Chivo Mono", ui-monospace,
      SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New",
      monospace;
    color: #f8fafc;
  }

  .brand-subtitle {
    font-size: 0.68rem;
    letter-spacing: 0.35em;
    text-transform: uppercase;
    color: rgba(148, 163, 184, 0.85);
    font-family: "Chivo Mono", ui-monospace, SFMono-Regular, Menlo, Monaco,
      Consolas, "Liberation Mono", "Courier New", monospace;
  }

  @media (max-width: 640px) {
    .brand-title {
      font-size: 1.1rem;
    }
    .brand-subtitle {
      letter-spacing: 0.25em;
    }
  }
`;

export const BackButton = styled.button`
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.55rem 1.35rem;
  border-radius: 999px;
  border: 1px solid rgba(148, 163, 184, 0.4);
  background: rgba(15, 23, 42, 0.6);
  color: #e2e8f0;
  font-size: 0.75rem;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  font-family: "Chivo Mono", ui-monospace, SFMono-Regular, Menlo, Monaco,
    Consolas, "Liberation Mono", "Courier New", monospace;
  transition: transform 0.2s ease, border-color 0.2s ease, color 0.2s ease,
    box-shadow 0.2s ease;
  cursor: pointer;

  &:hover {
    border-color: rgba(0, 212, 146, 0.6);
    color: #00d492;
    /* box-shadow: 0 0 22px rgba(0, 212, 146, 0.25); */
  }

  &:active {
    transform: scale(0.98);
  }

  svg {
    width: 16px;
    height: 16px;
    color: inherit;
  }
`;

export const ChallengeTitle = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  padding: 0.35rem 0.75rem;
  border-left: 3px solid rgba(0, 212, 146, 0.6);
  background: linear-gradient(120deg, rgba(0, 212, 146, 0.12), transparent 65%);
  border-radius: 0 0.75rem 0.75rem 0;

  .label {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    font-size: 0.72rem;
    letter-spacing: 0.4em;
    text-transform: uppercase;
    color: rgba(244, 244, 245, 0.85);
    font-family: var(--font-orbitron), "Chivo Mono", ui-monospace,
      SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New",
      monospace;

    &::before {
      content: "//";
      font-size: 0.65rem;
      letter-spacing: 0.4em;
      color: rgba(0, 212, 146, 0.85);
    }
  }

  .name {
    display: inline-flex;
    align-items: center;
    gap: 0.6rem;
    font-size: 1.42rem;
    font-weight: 900;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #f8fafc;
    font-family: var(--font-orbitron), "Chivo Mono", ui-monospace,
      SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New",
      monospace;

    svg {
      color: #00d492;
      filter: drop-shadow(0 0 6px rgba(0, 212, 146, 0.45));
    }
  }

  @media (max-width: 640px) {
    width: 100%;
    .name {
      font-size: 1.05rem;
    }
  }
`;

export const ChallengeBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.45rem 0.95rem;
  border-radius: 999px;
  border: 1px solid rgba(16, 185, 129, 0.45);
  background: rgba(0, 212, 146, 0.12);
  color: #c8fff0;
  font-size: 0.78rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  font-family: "Chivo Mono", ui-monospace, SFMono-Regular, Menlo, Monaco,
    Consolas, "Liberation Mono", "Courier New", monospace;
  box-shadow: 0 0 16px rgba(0, 212, 146, 0.22);

  span {
    opacity: 0.85;
  }

  .online-indicator {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 0.45rem;
    height: 0.45rem;
    border-radius: 999px;
    background: rgba(16, 185, 129, 0.95);
    box-shadow: 0 0 10px rgba(16, 185, 129, 0.6);
    animation: ${blink} 1.5s infinite ease-in-out;

    &::after {
      content: "";
      position: absolute;
      inset: -0.2rem;
      border-radius: inherit;
      border: 1px solid rgba(16, 185, 129, 0.35);
      animation: ${glowPulse} 2.2s infinite ease-in-out;
    }
  }

  @media (max-width: 640px) {
    width: 100%;
    justify-content: center;
    text-align: center;
    font-size: 0.8rem;
  }
`;

export const IframeWrapper = styled.div`
  flex: 1 1 auto;
  min-height: 0;
  background: #020409;
  border-top: 1px solid rgba(15, 23, 42, 0.55);
  box-shadow: inset 0 18px 40px rgba(2, 4, 9, 0.7);
  position: relative;
  overflow: hidden;
`;

export const StyledIframe = styled.iframe`
  width: 100%;
  height: 100%;
  border: none;
  display: block;
  background: #020409;
`;

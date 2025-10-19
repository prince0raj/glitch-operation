import styled, { keyframes } from "styled-components";

export const LoginContainer = styled.div`
  min-height: 100vh;
  background: #000000;
  position: relative;
  display: flex;
  font-family: 'Fira Code', 'JetBrains Mono', 'Consolas', monospace;
  color: #00d492;
`;

export const LeftSection = styled.div`
  flex: 0 0 45%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  position: relative;
  height: 100vh;
  overflow-y: auto;
  background: linear-gradient(135deg, #000000 0%, #0a0a0a 100%);
`;

export const RightSection = styled.div`
  flex: 0 0 55%;
  background: linear-gradient(135deg, #000000 0%, #001100 50%, #002200 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  position: relative;
  overflow: hidden;
`;

export const Separator = styled.div`
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 1px;
  height: 100%;
  background: linear-gradient(180deg, transparent 0%, #00d492 20%, #00d492 80%, transparent 100%);
`;

export const FormContainer = styled.div`
  width: 100%;
  max-width: 400px;
`;

export const Logo = styled.div`
  color: #f4f4f5;
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 3rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  
  &::before {
    content: '> ';
    color: #00d492;
  }
`;

export const FormTitle = styled.h1`
  color: #e4e4e7;
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  line-height: 1.2;
`;

export const FormSubtitle = styled.p`
  color: #a1a1aa;
  font-size: 0.775rem;
  margin-bottom: 2rem;
  line-height: 1.4;
  opacity: 0.9;
`;

export const TabSwitcher = styled.div`
  display: flex;
  background: rgba(10, 10, 10, 0.9);
  border: 1px solid #27272a;
  border-radius: 10px;
  padding: 0.25rem;
  margin-bottom: 2rem;
  gap: 0.5rem;
  width: 50%;
`;

export const TabButton = styled.button<{ $active: boolean }>`
  flex: 1;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 8px;
  font-family: 'Fira Code', monospace;
  font-size: 0.875rem;
  font-weight: 600;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  cursor: pointer;
  transition: all 0.2s ease;
  color: ${props => (props.$active ? '#0c0a09' : '#a1a1aa')};
  background: ${props =>
    props.$active
      ? 'linear-gradient(135deg,rgb(235, 237, 236) 0%,rgb(210, 212, 211) 100%)'
      : 'transparent'};

  &:hover {
    color: ${props => (props.$active ? '#000' : '#f4f4f5')};
  }
`;

export const SocialButtons = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
`;

export const SocialButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
  border: 1px solid #3f3f46;
  border-radius: 8px;
  color: #e4e4e7;
  font-size: 0.775rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: 'Fira Code', monospace;
  text-transform: uppercase;
  letter-spacing: 0.05em;

  &:hover {
    background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
    border-color: #52525b;
    color: #f4f4f5;
  }

  svg {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
  }
`;

export const Divider = styled.div`
  display: flex;
  align-items: center;
  margin: 1.5rem 0;
  color: #71717a;
  font-size: 0.875rem;
  font-weight: 500;
  text-align: center;

  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: #3f3f46;
  }

  &::before {
    margin-right: 1rem;
  }

  &::after {
    margin-left: 1rem;
  }
`;

export const FormGroup = styled.div`
  margin-bottom: 1rem;
`;

export const Label = styled.label`
  display: block;
  color: #e4e4e7;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
`;

export const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  background: rgba(0, 0, 0, 0.8);
  border: 1px solid #3f3f46;
  border-radius: 8px;
  color: #f4f4f5;
  font-size: 0.875rem;
  font-family: 'Fira Code', monospace;
  transition: all 0.2s ease;
  box-sizing: border-box;

  &::placeholder {
    color: rgba(161, 161, 170, 0.6);
  }

  &:focus {
    outline: none;
    border-color: #00d492;
    background: rgba(0, 0, 0, 0.9);
  }
`;

export const SignUpButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  background: linear-gradient(135deg, #00d492 0%, #00d492 100%);
  border: none;
  border-radius: 8px;
  color: #0c0a09;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  margin: 1.5rem 0;
  transition: all 0.2s ease;
  font-family: 'Fira Code', monospace;
  text-transform: uppercase;
  letter-spacing: 0.05em;

  &:hover {
    opacity: 0.8;
  }

  &:active {
    transform: scale(0.98);
  }
`;

export const SSOButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  background: transparent;
  border: 1px solid #333333;
  border-radius: 6px;
  color: #888888;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  margin-bottom: 1rem;
  transition: all 0.2s ease;

  &:hover {
    border-color: #444444;
    color: #aaaaaa;
    background: #1a1a1a;
  }
`;

export const SignInLink = styled.div`
  text-align: center;
  color: #a1a1aa;
  font-size: 0.875rem;

  a {
    color: #f4f4f5;
    text-decoration: none;
    font-weight: 500;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

export const TestimonialContainer = styled.div`
  max-width: 500px;
  color: #f4f4f5;
  z-index: 1;
  position: relative;
`;

export const TestimonialText = styled.p`
  font-size: 1.125rem;
  line-height: 1.6;
  margin-bottom: 1.5rem;
  color: #d4d4d8;
  font-weight: 400;

  &:last-of-type {
    margin-bottom: 2rem;
  }
`;

export const TestimonialAuthor = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

export const AuthorAvatar = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
`;

export const AuthorInfo = styled.div``;

export const AuthorName = styled.div`
  font-weight: 600;
  margin-bottom: 0.25rem;
  font-size: 0.875rem;
`;

export const AuthorTitle = styled.div`
  color: #a1a1aa;
  font-size: 0.875rem;
  font-weight: 400;
`;

export const Footer = styled.div`
  position: absolute;
  bottom: 1.5rem;
  left: 2rem;
  right: 2rem;
  text-align: center;
  color: #71717a;
  font-size: 0.75rem;
  line-height: 1.4;
  z-index: 1;

  a {
    color: #a1a1aa;
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
      color: #f4f4f5;
    }
  }
`;

export const Terminal = styled.div`
  background: rgba(0, 0, 0, 0.9);
  border: 1px solid #00d492;
  border-radius: 12px;
  padding: 1.5rem;
  width: 100%;
  max-width: 600px;
  font-family: 'Fira Code', monospace;
  z-index: 1;
  position: relative;
  backdrop-filter: blur(10px);
`;

export const TerminalHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid rgba(0, 255, 0, 0.3);
`;

export const TerminalDot = styled.div<{ color: string }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${props => props.color};
  box-shadow: 0 0 5px ${props => props.color};
`;

export const TerminalTitle = styled.div`
  color: #00d492;
  font-size: 0.875rem;
  margin-left: auto;
`;

export const TerminalContent = styled.div`
  color: #00d492;
  font-size: 0.875rem;
  line-height: 1.6;
  min-height: 300px;
`;

export const TerminalLine = styled.div`
  margin-bottom: 0.5rem;
  
  &::before {
    content: '$ ';
    color: #00d492;
  }
`;

export const TypewriterText = styled.span`
  border-right: 2px solid #00d492;
  animation: blink 1s infinite;
  
  @keyframes blink {
    0%, 50% { border-color: #00d492; }
    51%, 100% { border-color: transparent; }
  }
`;

export const FloatingIcon = styled.div<{ top: string; left: string }>`
  position: absolute;
  top: ${props => props.top};
  left: ${props => props.left};
  color: rgba(0, 255, 0, 0.4);
  z-index: 0;
  transition: all 0.3s ease;
  
  &:hover {
    color: rgba(0, 255, 0, 0.8);
    transform: scale(1.1);
  }
`;

export const BinaryPattern = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  z-index: 0;
  background: radial-gradient(circle at top left, rgba(255, 255, 255, 0.06) 0%, transparent 45%),
              radial-gradient(circle at bottom right, rgba(0, 212, 146, 0.08) 0%, transparent 55%);
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    pointer-events: none;
    background-image: url('data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120"%3E%3Crect width="1" height="1" fill="rgba(255,255,255,0.04)"/%3E%3C/svg%3E');
    opacity: 0.3;
  }
`;

const rainFall = keyframes`
  0% {
    transform: translateY(-100%);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  100% {
    transform: translateY(100%);
    opacity: 0;
  }
`;

export const BinaryColumn = styled.div<{ left: string; delay: number; duration: number }>`
  position: absolute;
  top: 0;
  left: ${props => props.left};
  width: 20px;
  height: 100vh;
  color: rgba(0, 212, 146, 0.3);
  font-family: 'Fira Code', monospace;
  font-size: 14px;
  line-height: 1.4;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding-top: 0rem;
  opacity: 1;
  animation: ${rainFall} linear infinite;
  animation-duration: ${props => props.duration}s;
  animation-delay: ${props => props.delay}s;
`;
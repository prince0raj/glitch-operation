"use client";

import React, { useState, useEffect, useMemo } from "react";
import {Orbitron} from "next/font/google";
import {
  Shield,
  Lock,
  Terminal as TerminalIcon,
  Wifi,
  Database,
  Code2,
  Chrome,
} from "lucide-react";
import {
  LoginContainer,
  LeftSection,
  RightSection,
  Separator,
  FormContainer,
  Logo,
  FormTitle,
  FormSubtitle,
  SocialButtons,
  SocialButton,
  FormGroup,
  Label,
  Input,
  SignUpButton,
  TabSwitcher,
  TabButton,
  Terminal,
  TerminalHeader,
  TerminalDot,
  TerminalTitle,
  TerminalContent,
  TerminalLine,
  TypewriterText,
  FloatingIcon,
  BinaryPattern,
  BinaryColumn,
} from "./style";

const orbitron = Orbitron({   variable: "--font-geist-mono",subsets: ["latin"] });

const Page = () => {
  const [currentText, setCurrentText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  const [binaryColumns, setBinaryColumns] = useState<any[]>([]);
  const [isClient, setIsClient] = useState(false);

  const hackingCommands = useMemo(
    () => [
      "Initializing OPS GLITCH system...",
      "Scanning for vulnerabilities...",
      "Found 127 potential targets",
      "Establishing secure connection...",
      "Connection established: 192.168.1.100",
      "Bypassing firewall protocols...",
      "Access granted to mainframe",
      "Downloading classified files...",
      "File transfer complete: 2.4GB",
      "Covering digital tracks...",
      "Mission accomplished. Welcome, hacker.",
      "Ready for next operation...",
    ],
    []
  );

  useEffect(() => {
    setIsClient(true);
    const generated = Array.from({ length: 25 }, (_, i) => ({
      left: `${i * 4}%`,
      delay: Math.random() * 5,
      duration: 6 + Math.random() * 4,
    }));
    setBinaryColumns(generated);
  }, []);

  useEffect(() => {
    const typeWriter = () => {
      const currentCommand = hackingCommands[currentIndex];
      if (currentText.length < currentCommand.length) {
        setCurrentText(currentCommand.slice(0, currentText.length + 1));
      } else {
        setTimeout(() => {
          setCurrentText("");
          setCurrentIndex((prev) => (prev + 1) % hackingCommands.length);
        }, 2000);
      }
    };

    const timer = setTimeout(typeWriter, 100);
    return () => clearTimeout(timer);
  }, [currentText, currentIndex, hackingCommands]);

  if (!isClient) {
    // Avoid rendering random parts on server to prevent hydration mismatch
    return null;
  }

  return (
    <LoginContainer>
      <LeftSection>
        <Separator />
        <FormContainer>
          <Logo className={orbitron.className}>OPS. GLITCH</Logo>

          <TabSwitcher>
            <TabButton
              type="button"
              $active={activeTab === "login"}
              onClick={() => setActiveTab("login")}
            >
              Login
            </TabButton>
            <TabButton
              type="button"
              $active={activeTab === "signup"}
              onClick={() => setActiveTab("signup")}
            >
              Sign Up
            </TabButton>
          </TabSwitcher>

          <FormTitle>
            {activeTab === "login" ? "Access Terminal" : "Request Access"}
          </FormTitle>
          <FormSubtitle>
            {activeTab === "login"
              ? "Enter credentials to access the hacker playground"
              : "Create your OPS GLITCH identity to begin the mission"}
          </FormSubtitle>
          <div className="h-[50vh]">
            <SocialButtons>
              <SocialButton type="button">
                <Chrome size={16} />
                Google Auth
              </SocialButton>
            </SocialButtons>

            {activeTab === "login" ? (
              <>
                <FormGroup>
                  <Label>Username</Label>
                  <Input type="text" placeholder="hacker@opsglitch.com" />
                </FormGroup>

                <FormGroup>
                  <Label>Password</Label>
                  <Input type="password" placeholder="••••••••••••" />
                </FormGroup>

                <SignUpButton>HACK IN</SignUpButton>
              </>
            ) : (
              <>
                <FormGroup>
                  <Label>Email</Label>
                  <Input type="email" placeholder="agent@opsglitch.com" />
                </FormGroup>

                <FormGroup>
                  <Label>Password</Label>
                  <Input type="password" placeholder="Create a secure key" />
                </FormGroup>

                <FormGroup>
                  <Label>Confirm Password</Label>
                  <Input type="password" placeholder="Repeat secure key" />
                </FormGroup>

                <SignUpButton>INITIATE SIGNUP</SignUpButton>
              </>
            )}
          </div>
        </FormContainer>
      </LeftSection>

      <RightSection>
        <BinaryPattern>
          {binaryColumns.map(({ left, delay, duration }, i) => (
            <BinaryColumn key={i} left={left} delay={delay} duration={duration}>
              {Array.from({ length: 60 }, (_, j) => (
                <div key={j}>{Math.random() > 0.5 ? "1" : "0"}</div>
              ))}
            </BinaryColumn>
          ))}
        </BinaryPattern>

        {/* Static Floating Icons */}
        <FloatingIcon top="15%" left="15%">
          <Lock size={20} />
        </FloatingIcon>
        <FloatingIcon top="25%" left="85%">
          <TerminalIcon size={20} />
        </FloatingIcon>
        <FloatingIcon top="45%" left="10%">
          <Shield size={20} />
        </FloatingIcon>
        <FloatingIcon top="65%" left="80%">
          <Database size={20} />
        </FloatingIcon>
        <FloatingIcon top="75%" left="20%">
          <Wifi size={20} />
        </FloatingIcon>
        <FloatingIcon top="35%" left="90%">
          <Code2 size={20} />
        </FloatingIcon>

        {/* Terminal */}
        <Terminal>
          <TerminalHeader>
            <TerminalDot color="#ff5f56" />
            <TerminalDot color="#ffbd2e" />
            <TerminalDot color="#27ca3f" />
            <TerminalTitle>ops-glitch-terminal</TerminalTitle>
          </TerminalHeader>

          <TerminalContent>
            <TerminalLine>Welcome to OPS GLITCH v2.1.0</TerminalLine>
            <TerminalLine>System Status: ONLINE</TerminalLine>
            <TerminalLine>Security Level: MAXIMUM</TerminalLine>
            <TerminalLine>Active Users: 1337</TerminalLine>
            <TerminalLine>─────────────────────────────</TerminalLine>
            <TerminalLine>
              <TypewriterText>{currentText}</TypewriterText>
            </TerminalLine>
          </TerminalContent>
        </Terminal>
      </RightSection>
    </LoginContainer>
  );
};

export default Page;

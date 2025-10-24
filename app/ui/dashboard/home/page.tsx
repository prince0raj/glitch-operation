"use client";
import React from "react";
import Hero from "./components/Hero";
import BreachProposal from "./components/BreachProposal";
import HowItWorks from "./components/HowItWorks";
import Testimonials from "./components/Testimonials";

const page = () => {
  return (
    <>
      <Hero />
      <HowItWorks />
      <BreachProposal />
      <Testimonials />
    </>
  );
};

export default page;

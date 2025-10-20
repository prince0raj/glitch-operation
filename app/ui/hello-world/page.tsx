"use client";
import React from "react";
import { signout } from "@/lib/auth-actions";

const page = () => {
  return (
    <div>
      <p>Hello world</p>
      <button onClick={() => signout()}>sign up</button>
    </div>
  );
};

export default page;

"use client";
import React from "react";
import { signout } from "@/lib/auth-actions";

const page = () => {
  return (
    <div className="flex items-center h-[100vh] mt-3 justify-center gap-2.5">
      <p>Hello world</p>
      <button
        className="border-zinc-500 border-2 p-2 cursor-pointer"
        onClick={() => signout()}
      >
        sign up
      </button>
    </div>
  );
};

export default page;

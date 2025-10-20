import React from "react";

const GridPattern = () => {
  return (
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#0a0f1c_0%,_#000_100%)] overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(#00d49240_1px,transparent_1px),linear-gradient(90deg,#00d49240_1px,transparent_1px)] bg-[size:50px_50px] opacity-10 animate-[pulseGrid_4s_ease-in-out_infinite]" />
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-mosaic.png')] opacity-20 animate-[matrixFlow_15s_linear_infinite]" />
    </div>
  );
};

export default GridPattern;

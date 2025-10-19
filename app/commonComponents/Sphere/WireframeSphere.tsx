"use client";

const WireframeSpheres = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10 z-0">
      {/* Large sphere - bottom right */}
      <svg 
        className="sphere-animate absolute -bottom- -right-80 w-[500px] h-[500px]" 
        viewBox="0 0 200 200"
        fill="none"
        stroke="#00ffae"
        strokeWidth="0.5"
      >
        {/* Longitude lines */}
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i * 30 * Math.PI) / 180;
          return (
            <ellipse
              key={`long-${i}`}
              cx="100"
              cy="100"
              rx={Math.abs(Math.cos(angle)) * 80}
              ry="80"
              transform={`rotate(${i * 15} 100 100)`}
            />
          );
        })}
        {/* Latitude lines */}
        {Array.from({ length: 8 }).map((_, i) => {
          const scale = Math.sin(((i + 1) * Math.PI) / 9);
          return (
            <ellipse
              key={`lat-${i}`}
              cx="100"
              cy="100"
              rx={80 * scale}
              ry={80 * scale * 0.3}
              transform={`translate(0 ${(i - 3.5) * 20})`}
            />
          );
        })}
      </svg>

      {/* Medium sphere - middle left */}
      <svg 
        className="sphere-animate absolute top-1/3 -left-10 w-[350px] h-[350px] [animation-duration:25s]" 
        viewBox="0 0 200 200"
        fill="none"
stroke="#00ffae"        strokeWidth="0.5"
      >
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i * 30 * Math.PI) / 180;
          return (
            <ellipse
              key={`long-${i}`}
              cx="100"
              cy="100"
              rx={Math.abs(Math.cos(angle)) * 80}
              ry="80"
              transform={`rotate(${i * 15} 100 100)`}
            />
          );
        })}
        {Array.from({ length: 8 }).map((_, i) => {
          const scale = Math.sin(((i + 1) * Math.PI) / 9);
          return (
            <ellipse
              key={`lat-${i}`}
              cx="100"
              cy="100"
              rx={80 * scale}
              ry={80 * scale * 0.3}
              transform={`translate(0 ${(i - 3.5) * 20})`}
            />
          );
        })}
      </svg>

      {/* Small sphere - top left */}
      <svg 
        className="sphere-animate absolute top-10 left-1/4 w-[200px] h-[200px] [animation-duration:15s]" 
        viewBox="0 0 200 200"
        fill="none"
        stroke="#00ffae"
        strokeWidth="0.5"
      >
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i * 30 * Math.PI) / 180;
          return (
            <ellipse
              key={`long-${i}`}
              cx="100"
              cy="100"
              rx={Math.abs(Math.cos(angle)) * 80}
              ry="80"
              transform={`rotate(${i * 15} 100 100)`}
            />
          );
        })}
        {Array.from({ length: 8 }).map((_, i) => {
          const scale = Math.sin(((i + 1) * Math.PI) / 9);
          return (
            <ellipse
              key={`lat-${i}`}
              cx="100"
              cy="100"
              rx={80 * scale}
              ry={80 * scale * 0.3}
              transform={`translate(0 ${(i - 3.5) * 20})`}
            />
          );
        })}
      </svg>

      {/* Small sphere - bottom center */}
     <svg 
  className="sphere-animate absolute -bottom-10 left-1/2 -translate-x-1/2 w-[300px] h-[300px] "
  viewBox="0 0 200 200"
  fill="none"
  stroke="#00ffae"
  strokeWidth="0.7"
>
  {/* Longitude lines */}
  {Array.from({ length: 12 }).map((_, i) => {
    const angle = (i * 30 * Math.PI) / 180;
    return (
      <ellipse
        key={`long-${i}`}
        cx="100"
        cy="100"
        rx={Math.abs(Math.cos(angle)) * 80}
        ry="80"
        transform={`rotate(${i * 15} 100 100)`}
      />
    );
  })}

  {/* Latitude lines */}
  {Array.from({ length: 8 }).map((_, i) => {
    const scale = Math.sin(((i + 1) * Math.PI) / 9);
    return (
      <ellipse
        key={`lat-${i}`}
        cx="100"
        cy="100"
        rx={80 * scale}
        ry={80 * scale * 0.35}
        transform={`translate(0 ${(i - 3.5) * 18})`}
      />
    );
  })}


</svg>

<style jsx>{`
  .sphere-animate {
    animation: rotateSphere 18s linear infinite;
  }

  @keyframes rotateSphere {
    0% {
      transform: translateX(-50%) rotate(0deg);
    }
    100% {
      transform: translateX(-50%) rotate(360deg);
    }
  }
`}</style>
    </div>
  );
};

export default WireframeSpheres;

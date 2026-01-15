import React from 'react';

const CubeGridAnimation: React.FC = () => {
  const n = 4;
  const m = Math.pow(n, 2);
  const cubes = Array.from({ length: m }, (_, index) => index);

  const getCubeStyle = (index: number) => {
    const i = index % n;
    const j = Math.floor(index / n);
    
    return {
      '--i': i,
      '--j': j,
    } as React.CSSProperties;
  };

  return (
    <div className="html-container">
      <div className="grid" style={{ '--n': n } as React.CSSProperties}>
        {cubes.map((_, index) => (
          <div
            key={index}
            className="cube"
            style={getCubeStyle(index)}
          />
        ))}
      </div>

      <style>{`
        .html-container {
          display: grid;
          width: 100%;
          height: 100vh;
          background: transparent;
        }

        .html-container > div {
          display: grid;
          transform-style: preserve-3d;
        }

        .grid {
          grid-template-columns: repeat(var(--n), 2.75em);
          grid-gap: 0.5em;
          place-self: center;
          transform: rotateX(55deg) rotate(45deg);
        }

        .cube {
          aspect-ratio: 1;
          transform-origin: 50% 50% -2.75em;
          background: rgb(4, 120, 87);
          animation: ani 1.5s ease-in-out infinite;
          animation-delay: calc((var(--n) - 1 - var(--j) + var(--i)) * 0.075s);
          position: relative;
        }

        .cube::before,
        .cube::after {
          content: '';
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
        }

        .cube::before {
          --i: 0;
          --j: calc(1 - var(--i));
          transform-origin: calc(var(--j) * 50%) calc(var(--i) * 50%);
          translate: calc(var(--i) * 100%) calc(var(--j) * 100%);
          rotate: var(--j) var(--i) 0 calc((2 * var(--i) - 1) * 90deg);
          background: rgb(5, 150, 105);
        }

        .cube::after {
          --i: 1;
          --j: calc(1 - var(--i));
          transform-origin: calc(var(--j) * 50%) calc(var(--i) * 50%);
          translate: calc(var(--i) * 100%) calc(var(--j) * 100%);
          rotate: var(--j) var(--i) 0 calc((2 * var(--i) - 1) * 90deg);
          background: rgb(6, 95, 70);
        }

        @keyframes ani {
          0%, 50%, 100% {
            scale: 1 1 0;
          }
          25% {
            scale: 1 1 0.5;
          }
        }
      `}</style>
    </div>
  );
};

export default CubeGridAnimation;
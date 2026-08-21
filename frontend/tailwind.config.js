import daisyui from 'daisyui';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Green-phosphor terminal palette — see the direction contract in index.html.
        // up/down are reserved for price direction only.
        ink: {
          DEFAULT: '#050A07',
          panel: '#0A130D',
          raised: '#101B14',
        },
        phosphor: {
          DEFAULT: '#31D96A',
          bright: '#A8E6BF',
          mid: '#4FAE79',
          dim: '#1C5C38',
        },
        signal: {
          cyan: '#22D3EE',
          cyanDim: '#1FA8C4',
          up: '#5BFF8F',
          down: '#FF4136',
        },
        paper: '#DCF3E4',
      },
      fontFamily: {
        board: ['"Doto Variable"', '"Doto"', 'ui-monospace', 'monospace'],
        term: ['"Commit Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      letterSpacing: {
        cell: '0.08em',
        label: '0.18em',
      },
      keyframes: {
        'cell-flip': {
          '0%': { transform: 'rotateX(0deg)', opacity: '1' },
          '45%': { transform: 'rotateX(-90deg)', opacity: '0.25' },
          '100%': { transform: 'rotateX(0deg)', opacity: '1' },
        },
        'lamp': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.35' },
        },
        'board-drift': {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(-50%)' },
        },
        'scan-sweep': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
      },
      animation: {
        'cell-flip': 'cell-flip 260ms ease-in-out',
        'lamp': 'lamp 1.6s steps(2, end) infinite',
        'board-drift': 'board-drift 90s linear infinite',
        'scan-sweep': 'scan-sweep 7s linear infinite',
      },
    },
  },
  plugins: [
    daisyui,
  ],
  daisyui: {
    themes: ["forest"]
  }
};

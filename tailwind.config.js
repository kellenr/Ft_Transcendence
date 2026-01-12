/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],

  theme: {
    extend: {
      colors: {
        'pong': {
          'pink': '#ff6b9d',      // Primary accent (buttons, highlights)
          'purple': '#c77dff',    // Secondary accent
          'dark': '#1a1a2e',      // Background
          'darker': '#16213e',    // Darker background (cards)
          'accent': '#e94560'     // Error/warning color
        }
      },
      fontFamily: {
        'game': ['"Press Start 2P"', 'cursive'],  // Retro game font
        'sans': ['Inter', 'system-ui', 'sans-serif']  // Clean modern font
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'bounce-slow': 'bounce 2s infinite'
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': {
            boxShadow: '0 0 5px currentColor, 0 0 10px currentColor'
          },
          '50%': {
            boxShadow: '0 0 20px currentColor, 0 0 30px currentColor'
          }
        }
      }
    }
  },
  plugins: []
};

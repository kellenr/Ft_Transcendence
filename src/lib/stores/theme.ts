import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export interface ThemeColors {
  accentColor: string;
  backgroundColor: string;
  cardColor: string;
  textColor: string;
}

export const defaultTheme: ThemeColors = {
  accentColor: '#ff6b9d',
  backgroundColor: '#1a1a2e',
  cardColor: '#16213e',
  textColor: '#e5e5e5'
};

export const presetThemes: Record<string, ThemeColors> = {
  classic: {
    accentColor: '#ff6b9d',
    backgroundColor: '#1a1a2e',
    cardColor: '#16213e',
    textColor: '#e5e5e5'
  },
  ocean: {
    accentColor: '#00d9ff',
    backgroundColor: '#0a1628',
    cardColor: '#0f2942',
    textColor: '#e0f4ff'
  },
  forest: {
    accentColor: '#4ade80',
    backgroundColor: '#0f1f0f',
    cardColor: '#1a331a',
    textColor: '#e0ffe0'
  },
  sunset: {
    accentColor: '#ff9f43',
    backgroundColor: '#1f1510',
    cardColor: '#332218',
    textColor: '#fff5e6'
  },
  monochrome: {
    accentColor: '#ffffff',
    backgroundColor: '#0a0a0a',
    cardColor: '#1a1a1a',
    textColor: '#e5e5e5'
  }
};

function createThemeStore() {
  const { subscribe, set, update } = writable<ThemeColors>(defaultTheme);

  return {
    subscribe,
    set: (theme: ThemeColors) => {
      set(theme);
      if (browser) {
        localStorage.setItem('pong-theme', JSON.stringify(theme));
        applyTheme(theme);
      }
    },
    init: (theme: ThemeColors) => {
      set(theme);
      if (browser) {
        applyTheme(theme);
      }
    },
    setPreset: (presetName: string) => {
      const preset = presetThemes[presetName];
      if (preset) {
        set(preset);
        if (browser) {
          localStorage.setItem('pong-theme', JSON.stringify(preset));
          applyTheme(preset);
        }
      }
    },
    reset: () => {
      set(defaultTheme);
      if (browser) {
        localStorage.setItem('pong-theme', JSON.stringify(defaultTheme));
        applyTheme(defaultTheme);
      }
    }
  };
}

export function applyTheme(theme: ThemeColors) {
  if (!browser) return;

  const root = document.documentElement;
  root.style.setProperty('--accent', theme.accentColor);
  root.style.setProperty('--bg', theme.backgroundColor);
  root.style.setProperty('--card', theme.cardColor);
  root.style.setProperty('--text', theme.textColor);

  // Calculate accent hover color (slightly lighter/darker)
  root.style.setProperty('--accent-hover', adjustColor(theme.accentColor, 20));
  root.style.setProperty('--accent-muted', theme.accentColor + '33'); // 20% opacity
}

function adjustColor(hex: string, amount: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.min(255, Math.max(0, (num >> 16) + amount));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + amount));
  const b = Math.min(255, Math.max(0, (num & 0x0000FF) + amount));
  return '#' + (0x1000000 + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

export const theme = createThemeStore();

// Available predefined avatars
export const predefinedAvatars = [
  { name: 'Robot', path: '/avatars/robot.svg' },
  { name: 'Alien', path: '/avatars/alien.svg' },
  { name: 'Astronaut', path: '/avatars/astronaut.svg' },
  { name: 'Ninja', path: '/avatars/ninja.svg' },
  { name: 'Wizard', path: '/avatars/wizard.svg' },
  { name: 'Ghost', path: '/avatars/ghost.svg' },
  { name: 'Cat', path: '/avatars/cat.svg' },
  { name: 'Panda', path: '/avatars/panda.svg' }
];

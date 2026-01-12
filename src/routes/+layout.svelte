
<script lang="ts">
  import '../app.css';
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import { theme, applyTheme, type ThemeColors } from '$lib/stores/theme';
  import type { LayoutData } from './$types';

  export let data: LayoutData;

  // Initialize theme from server data
  $: if (data.theme) {
    theme.init(data.theme as ThemeColors);
  }

  onMount(() => {
    // Apply theme immediately on mount
    if (data.theme) {
      applyTheme(data.theme as ThemeColors);
    }
  });

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };
</script>

<div class="min-h-screen flex flex-col">

  <nav class="bg-card border-b border-accent/20">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">

        <a href="/" class="flex items-center gap-2">
          <span class="game-title text-xl">PONG</span>
        </a>
        <div class="hidden md:flex items-center gap-6">
          <a
            href="/"
            class="text-gray-300 hover:text-accent transition-colors"
            class:text-accent={$page.url.pathname === '/'}
          >
            Home
          </a>

          <a
            href="/game"
            class="text-gray-300 hover:text-accent transition-colors"
            class:text-accent={$page.url.pathname.startsWith('/game')}
          >
            Play
          </a>

          <a
            href="/profile"
            class="text-gray-300 hover:text-accent transition-colors"
            class:text-accent={$page.url.pathname.startsWith('/profile')}
          >
            Profile
          </a>
        </div>
        <div class="flex items-center gap-3">
          {#if data.user}
            <a href="/profile" class="flex items-center gap-3 hover:opacity-80 transition-opacity">
              {#if data.user.avatar}
                <img
                  src={data.user.avatar}
                  alt={data.user.username}
                  class="w-9 h-9 rounded-full border-2 border-accent object-cover"
                />
              {:else}
                <div class="w-9 h-9 rounded-full border-2 border-accent bg-page flex items-center justify-center">
                  <span class="text-sm font-bold text-accent">
                    {getInitials(data.user.displayName || data.user.username)}
                  </span>
                </div>
              {/if}
              <span class="text-gray-300 font-medium hidden sm:block">
                {data.user.displayName || data.user.username}
              </span>
            </a>
          {:else}
            <a href="/auth/login" class="btn-secondary text-sm">Login</a>
            <a href="/auth/register" class="btn-primary text-sm">Sign Up</a>
          {/if}
        </div>
      </div>
    </div>
  </nav>
  <main class="flex-1">
    <slot />
  </main>
  <footer class="bg-card border-t border-accent/20 py-6">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col md:flex-row items-center justify-between gap-4">

        <!-- Copyright -->
        <p class="text-gray-400 text-sm">
          © 2024 ft_transcendence - 42 School Project
        </p>
        <div class="flex items-center gap-6 text-sm">
          <a href="/privacy" class="text-gray-400 hover:text-accent transition-colors">
            Privacy Policy
          </a>
          <a href="/terms" class="text-gray-400 hover:text-accent transition-colors">
            Terms of Service
          </a>
        </div>
      </div>
    </div>
  </footer>
</div>

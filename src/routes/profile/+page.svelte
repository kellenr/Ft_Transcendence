<script lang="ts">
  import type { PageData } from './$types';

  export let data: PageData;

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  async function handleLogout() {
    const response = await fetch('/auth/logout', { method: 'POST' });
    if (response.ok) {
      window.location.href = '/';
    }
  }
</script>

<svelte:head>
  <title>Profile - {data.user.displayName || data.user.username}</title>
  <meta name="description" content="Your PONG profile" />
</svelte:head>

<div class="max-w-6xl mx-auto px-4 py-8">

  <!-- Profile Header -->
  <div class="card mb-8">
    <div class="flex flex-col md:flex-row items-center md:items-start gap-6">

      <!-- Avatar -->
      <div class="relative">
        {#if data.user.avatar}
          <img
            src={data.user.avatar}
            alt={data.user.username}
            class="w-32 h-32 rounded-full border-4 border-pong-purple object-cover"
          />
        {:else}
          <div class="w-32 h-32 rounded-full border-4 border-pong-purple bg-pong-dark flex items-center justify-center">
            <span class="text-4xl font-bold text-pong-pink">
              {getInitials(data.user.displayName || data.user.username)}
            </span>
          </div>
        {/if}

        <!-- Online Status Indicator -->
        {#if data.user.isOnline}
          <div class="absolute bottom-2 right-2 w-6 h-6 bg-green-500 rounded-full border-4 border-pong-darker"></div>
        {/if}
      </div>

      <!-- User Info -->
      <div class="flex-1 text-center md:text-left">
        <h1 class="game-title text-3xl mb-2">
          {data.user.displayName || data.user.username}
        </h1>
        {#if data.user.displayName}
          <p class="text-gray-400 mb-2">@{data.user.username}</p>
        {/if}
        {#if data.user.bio}
          <p class="text-gray-300 mb-4 max-w-md">{data.user.bio}</p>
        {/if}
        <p class="text-gray-400 text-sm mb-4">
          Member since {formatDate(data.user.createdAt)}
        </p>

        <div class="flex flex-wrap gap-3 justify-center md:justify-start">
          <a href="/profile/edit" class="btn-secondary text-sm">
            Edit Profile
          </a>
          <a href="/settings" class="btn-secondary text-sm">
            Settings
          </a>
          <button on:click={handleLogout} class="btn-secondary text-sm">
            Logout
          </button>
        </div>
      </div>

      <!-- Rank Badge -->
      <div class="text-center">
        <div class="card bg-gradient-to-br from-pong-purple/20 to-pong-pink/20 px-6 py-4">
          <p class="text-gray-400 text-sm mb-1">Rank</p>
          <p class="game-title text-2xl">{data.stats.rank}</p>
        </div>
      </div>
    </div>
  </div>

  <!-- Stats Grid -->
  <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">

    <div class="card text-center">
      <p class="text-gray-400 text-sm mb-1">Total Games</p>
      <p class="text-3xl font-bold text-pong-pink">{data.stats.totalGames}</p>
    </div>

    <div class="card text-center">
      <p class="text-gray-400 text-sm mb-1">Wins</p>
      <p class="text-3xl font-bold text-green-500">{data.stats.wins}</p>
    </div>

    <div class="card text-center">
      <p class="text-gray-400 text-sm mb-1">Losses</p>
      <p class="text-3xl font-bold text-pong-accent">{data.stats.losses}</p>
    </div>

    <div class="card text-center">
      <p class="text-gray-400 text-sm mb-1">Win Rate</p>
      <p class="text-3xl font-bold text-pong-purple">{data.stats.winRate}%</p>
    </div>

    <div class="card text-center col-span-2">
      <p class="text-gray-400 text-sm mb-1">Current Streak</p>
      <p class="text-3xl font-bold text-pong-pink">🔥 {data.stats.currentStreak}</p>
    </div>

    <div class="card text-center col-span-2">
      <p class="text-gray-400 text-sm mb-1">Best Streak</p>
      <p class="text-3xl font-bold text-pong-purple">⭐ {data.stats.bestStreak}</p>
    </div>
  </div>

  <!-- Tabs Section -->
  <div class="card">
    <div class="border-b border-pong-purple/20 mb-6">
      <div class="flex gap-6">
        <button class="pb-3 border-b-2 border-pong-pink text-pong-pink font-semibold">
          Match History
        </button>
        <button class="pb-3 border-b-2 border-transparent text-gray-400 hover:text-pong-pink transition-colors">
          Achievements
        </button>
        <button class="pb-3 border-b-2 border-transparent text-gray-400 hover:text-pong-pink transition-colors">
          Friends
        </button>
      </div>
    </div>

    <!-- Match History Content -->
    <div class="space-y-4">
      {#if data.stats.totalGames === 0}
        <div class="text-center py-12">
          <div class="text-6xl mb-4">🎮</div>
          <h3 class="text-xl font-semibold text-gray-300 mb-2">No matches yet</h3>
          <p class="text-gray-400 mb-6">Start your first game to see your match history!</p>
          <a href="/game" class="btn-primary">
            Play Now
          </a>
        </div>
      {:else}
        <!-- Placeholder for future match history -->
        <div class="text-center py-8 text-gray-400">
          <p>Match history will appear here</p>
        </div>
      {/if}
    </div>
  </div>

  <!-- Achievements Section -->
  <div class="card mt-8">
    <h2 class="text-2xl font-semibold text-pong-pink mb-6">Achievements</h2>

    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">

      <!-- Locked Achievement Example -->
      <div class="text-center p-4 rounded-lg bg-pong-dark/50 border border-pong-purple/10 opacity-50">
        <div class="text-4xl mb-2">🔒</div>
        <p class="text-sm text-gray-400">First Win</p>
      </div>

      <div class="text-center p-4 rounded-lg bg-pong-dark/50 border border-pong-purple/10 opacity-50">
        <div class="text-4xl mb-2">🔒</div>
        <p class="text-sm text-gray-400">Win Streak</p>
      </div>

      <div class="text-center p-4 rounded-lg bg-pong-dark/50 border border-pong-purple/10 opacity-50">
        <div class="text-4xl mb-2">🔒</div>
        <p class="text-sm text-gray-400">Champion</p>
      </div>

      <div class="text-center p-4 rounded-lg bg-pong-dark/50 border border-pong-purple/10 opacity-50">
        <div class="text-4xl mb-2">🔒</div>
        <p class="text-sm text-gray-400">Veteran</p>
      </div>
    </div>
  </div>

</div>

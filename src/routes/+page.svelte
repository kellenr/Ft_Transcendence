<script lang="ts">
  // This page doesn't need any scripts yet
  // Later we might add:
  //   - User state check (redirect if logged in)
  //   - Animation logic
  //   - etc.
</script>

<svelte:head>
  <title>PONG - ft_transcendence</title>
  <meta name="description" content="Play the classic Pong game online! Challenge friends or AI opponents." />
</svelte:head>

<div class="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] px-4">
  <div class="text-center space-y-8">

    <h1 class="game-title text-4xl md:text-6xl animate-float">
      PONG
    </h1>
    <p class="text-gray-300 text-lg max-w-md mx-auto">
      The classic arcade game, reimagined for the web.
      Challenge your friends or play against AI!
    </p>
    <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
      <a href="/game" class="btn-primary text-lg px-8 py-3">
        🎮 Play Now
      </a>
      <a href="/auth/register" class="btn-secondary text-lg px-8 py-3">
        Create Account
      </a>
    </div>
  </div>
  <div class="mt-20 grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">

    <!-- Feature Card 1 -->
    <div class="card text-center">
      <div class="text-4xl mb-4">🏓</div>
      <h3 class="text-pong-pink font-semibold mb-2">Classic Gameplay</h3>
      <p class="text-gray-400 text-sm">Experience the timeless Pong mechanics</p>
    </div>

    <!-- Feature Card 2 -->
    <div class="card text-center">
      <div class="text-4xl mb-4">🌐</div>
      <h3 class="text-pong-pink font-semibold mb-2">Play Online</h3>
      <p class="text-gray-400 text-sm">Challenge players from anywhere</p>
    </div>

    <!-- Feature Card 3 -->
    <div class="card text-center">
      <div class="text-4xl mb-4">🏆</div>
      <h3 class="text-pong-pink font-semibold mb-2">Leaderboards</h3>
      <p class="text-gray-400 text-sm">Compete for the top spots</p>
    </div>
  </div>
</div>

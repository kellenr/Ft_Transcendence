<script lang="ts">
  import { page } from '$app/stores';

  $: errorCode = $page.error?.message || 'An error occurred';
  $: statusCode = $page.status || 500;

  const getErrorEmoji = (status: number) => {
    if (status === 404) return '🎯';
    if (status === 403) return '🚫';
    if (status === 500) return '💥';
    return '⚠️';
  };

  const getErrorTitle = (status: number) => {
    if (status === 404) return 'Page Not Found';
    if (status === 403) return 'Access Denied';
    if (status === 500) return 'Server Error';
    return 'Error';
  };

  const getErrorDescription = (status: number) => {
    if (status === 404) return "Looks like this page doesn't exist. It's out of bounds!";
    if (status === 403) return "You don't have permission to access this resource.";
    if (status === 500) return 'Something went wrong on our end. We\'re working to fix it!';
    return 'An unexpected error occurred.';
  };
</script>

<svelte:head>
  <title>{statusCode} - {getErrorTitle(statusCode)}</title>
</svelte:head>

<div class="flex items-center justify-center min-h-[calc(100vh-200px)] px-4">
  <div class="card max-w-2xl w-full text-center space-y-6">

    <!-- Error Code & Emoji -->
    <div class="space-y-4">
      <div class="text-8xl animate-float">
        {getErrorEmoji(statusCode)}
      </div>

      <div>
        <h1 class="game-title text-6xl mb-2">
          {statusCode}
        </h1>
        <h2 class="text-2xl font-semibold text-pong-pink mb-3">
          {getErrorTitle(statusCode)}
        </h2>
        <p class="text-gray-400 text-lg">
          {getErrorDescription(statusCode)}
        </p>
      </div>
    </div>

    <!-- Error Details (if available) -->
    {#if $page.error?.message && statusCode !== 404}
      <div class="bg-pong-dark/50 border border-pong-purple/20 rounded-lg p-4 text-left">
        <p class="text-sm text-gray-400 font-mono break-words">
          {$page.error.message}
        </p>
      </div>
    {/if}

    <!-- Actions -->
    <div class="flex flex-col sm:flex-row gap-4 justify-center pt-4">
      <a href="/" class="btn-primary">
        🏠 Go Home
      </a>
      <button
        on:click={() => window.history.back()}
        class="btn-secondary"
      >
        ← Go Back
      </button>
      {#if statusCode === 500}
        <button
          on:click={() => window.location.reload()}
          class="btn-secondary"
        >
          🔄 Retry
        </button>
      {/if}
    </div>

    <!-- Fun Error Messages -->
    <div class="border-t border-pong-purple/20 pt-6 mt-6">
      {#if statusCode === 404}
        <p class="text-gray-500 text-sm">
          The ball went out of bounds and we couldn't find it... 🏓
        </p>
      {:else if statusCode === 500}
        <p class="text-gray-500 text-sm">
          Our server missed the ball. Game over! 🎮
        </p>
      {:else if statusCode === 403}
        <p class="text-gray-500 text-sm">
          This area is off-limits. You need the right paddle to enter! 🔐
        </p>
      {:else}
        <p class="text-gray-500 text-sm">
          Something unexpected happened in the game! 🕹️
        </p>
      {/if}
    </div>

    <!-- Help Text -->
    <div class="text-sm text-gray-400">
      <p>Need help? Check out our <a href="/terms" class="link">Help Center</a></p>
    </div>

  </div>
</div>

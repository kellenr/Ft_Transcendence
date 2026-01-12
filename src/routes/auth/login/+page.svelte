<script lang="ts">
  import { enhance } from '$app/forms';

  let loading = false;
  let error = '';

  const handleSubmit = () => {
    loading = true;
    error = '';
    return async ({ result, update }: any) => {
      loading = false;
      if (result.type === 'failure') {
        error = result.data?.message || 'Login failed. Please try again.';
      }
      await update();
    };
  };
</script>

<svelte:head>
  <title>Login - PONG</title>
  <meta name="description" content="Login to your PONG account" />
</svelte:head>

<div class="flex items-center justify-center min-h-[calc(100vh-200px)] px-4 py-8">
  <div class="card max-w-md w-full space-y-6">

    <div class="text-center">
      <h1 class="game-title text-3xl mb-2">Login</h1>
      <p class="text-gray-400">Welcome back! Ready to play?</p>
    </div>

    {#if error}
      <div class="bg-pong-accent/20 border border-pong-accent rounded-lg p-3">
        <p class="text-pong-accent text-sm">{error}</p>
      </div>
    {/if}

    <form method="POST" use:enhance={handleSubmit} class="space-y-4">

      <div class="space-y-2">
        <label for="email" class="block text-sm font-medium text-gray-300">
          Email or Username
        </label>
        <input
          id="email"
          name="identifier"
          type="text"
          required
          placeholder="Enter your email or username"
          class="input"
          disabled={loading}
        />
      </div>

      <div class="space-y-2">
        <label for="password" class="block text-sm font-medium text-gray-300">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          placeholder="Enter your password"
          class="input"
          disabled={loading}
        />
      </div>

      <div class="flex items-center justify-between text-sm">
        <label class="flex items-center gap-2 text-gray-300 cursor-pointer">
          <input
            type="checkbox"
            name="remember"
            class="w-4 h-4 rounded border-pong-purple/30 bg-pong-darker text-pong-pink focus:ring-pong-pink"
          />
          Remember me
        </label>
        <a href="/auth/forgot-password" class="link text-sm">
          Forgot password?
        </a>
      </div>

      <button
        type="submit"
        disabled={loading}
        class="btn-primary w-full py-3"
      >
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>

    <div class="text-center text-sm text-gray-400">
      Don't have an account?
      <a href="/auth/register" class="link">Sign up</a>
    </div>

    <div class="relative">
      <div class="absolute inset-0 flex items-center">
        <div class="w-full border-t border-pong-purple/20"></div>
      </div>
      <div class="relative flex justify-center text-sm">
        <span class="px-2 bg-pong-darker text-gray-400">Or continue with</span>
      </div>
    </div>

    <div class="grid grid-cols-2 gap-3">
      <button
        type="button"
        class="btn-secondary py-2 text-sm"
      >
        🔗 42 Intra
      </button>
      <button
        type="button"
        class="btn-secondary py-2 text-sm"
      >
        👤 OAuth
      </button>
    </div>

  </div>
</div>

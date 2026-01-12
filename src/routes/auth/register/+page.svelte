<script lang="ts">
  import { enhance } from '$app/forms';

  let loading = false;
  let error = '';
  let passwordStrength = '';

  const handleSubmit = () => {
    loading = true;
    error = '';
    return async ({ result, update }: any) => {
      loading = false;
      if (result.type === 'failure') {
        error = result.data?.message || 'Registration failed. Please try again.';
      }
      await update();
    };
  };

  function checkPasswordStrength(event: Event) {
    const password = (event.target as HTMLInputElement).value;
    if (password.length < 6) {
      passwordStrength = 'weak';
    } else if (password.length < 10 || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
      passwordStrength = 'medium';
    } else {
      passwordStrength = 'strong';
    }
  }
</script>

<svelte:head>
  <title>Register - PONG</title>
  <meta name="description" content="Create your PONG account" />
</svelte:head>

<div class="flex items-center justify-center min-h-[calc(100vh-200px)] px-4 py-8">
  <div class="card max-w-md w-full space-y-6">

    <div class="text-center">
      <h1 class="game-title text-3xl mb-2">Sign Up</h1>
      <p class="text-gray-400">Join the game and start playing!</p>
    </div>

    {#if error}
      <div class="bg-pong-accent/20 border border-pong-accent rounded-lg p-3">
        <p class="text-pong-accent text-sm">{error}</p>
      </div>
    {/if}

    <form method="POST" use:enhance={handleSubmit} class="space-y-4">

      <div class="space-y-2">
        <label for="username" class="block text-sm font-medium text-gray-300">
          Username
        </label>
        <input
          id="username"
          name="username"
          type="text"
          required
          placeholder="Choose a username"
          class="input"
          disabled={loading}
          minlength="3"
          maxlength="20"
          pattern="[a-zA-Z0-9_]+"
          title="Username can only contain letters, numbers, and underscores"
        />
        <p class="text-xs text-gray-400">3-20 characters, letters, numbers, and underscores only</p>
      </div>

      <div class="space-y-2">
        <label for="email" class="block text-sm font-medium text-gray-300">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          placeholder="your.email@example.com"
          class="input"
          disabled={loading}
        />
      </div>

      <div class="space-y-2">
        <label for="displayName" class="block text-sm font-medium text-gray-300">
          Display Name <span class="text-gray-500">(Optional)</span>
        </label>
        <input
          id="displayName"
          name="displayName"
          type="text"
          placeholder="How should we call you?"
          class="input"
          disabled={loading}
          maxlength="50"
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
          placeholder="Create a strong password"
          class="input"
          disabled={loading}
          minlength="6"
          on:input={checkPasswordStrength}
        />
        {#if passwordStrength}
          <div class="flex gap-1">
            <div class="h-1 flex-1 rounded-full {passwordStrength === 'weak' ? 'bg-pong-accent' : passwordStrength === 'medium' ? 'bg-yellow-500' : 'bg-green-500'}"></div>
            <div class="h-1 flex-1 rounded-full {passwordStrength === 'medium' || passwordStrength === 'strong' ? (passwordStrength === 'medium' ? 'bg-yellow-500' : 'bg-green-500') : 'bg-gray-600'}"></div>
            <div class="h-1 flex-1 rounded-full {passwordStrength === 'strong' ? 'bg-green-500' : 'bg-gray-600'}"></div>
          </div>
          <p class="text-xs {passwordStrength === 'weak' ? 'text-pong-accent' : passwordStrength === 'medium' ? 'text-yellow-500' : 'text-green-500'}">
            Password strength: {passwordStrength}
          </p>
        {/if}
      </div>

      <div class="space-y-2">
        <label for="confirmPassword" class="block text-sm font-medium text-gray-300">
          Confirm Password
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          required
          placeholder="Re-enter your password"
          class="input"
          disabled={loading}
        />
      </div>

      <div class="space-y-2">
        <label class="flex items-start gap-2 text-sm text-gray-300 cursor-pointer">
          <input
            type="checkbox"
            name="acceptTerms"
            required
            class="w-4 h-4 mt-0.5 rounded border-pong-purple/30 bg-pong-darker text-pong-pink focus:ring-pong-pink"
          />
          <span>
            I agree to the <a href="/terms" class="link" target="_blank">Terms of Service</a>
            and <a href="/privacy" class="link" target="_blank">Privacy Policy</a>
          </span>
        </label>
      </div>

      <button
        type="submit"
        disabled={loading}
        class="btn-primary w-full py-3"
      >
        {loading ? 'Creating account...' : 'Create Account'}
      </button>
    </form>

    <div class="text-center text-sm text-gray-400">
      Already have an account?
      <a href="/auth/login" class="link">Login</a>
    </div>

    <div class="relative">
      <div class="absolute inset-0 flex items-center">
        <div class="w-full border-t border-pong-purple/20"></div>
      </div>
      <div class="relative flex justify-center text-sm">
        <span class="px-2 bg-pong-darker text-gray-400">Or sign up with</span>
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

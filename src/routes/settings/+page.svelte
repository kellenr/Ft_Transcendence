<script lang="ts">
  import { enhance } from '$app/forms';
  import { theme as themeStore, presetThemes, applyTheme, defaultTheme, type ThemeColors } from '$lib/stores/theme';
  import type { PageData } from './$types';

  export let data: PageData;

  // Form states
  let loading = {
    password: false,
    email: false,
    preferences: false,
    privacy: false,
    theme: false,
    notifications: false,
    delete: false
  };

  let error = '';
  let success = '';
  let showDeleteModal = false;

  // Form values
  let currentPassword = '';
  let newPassword = '';
  let confirmPassword = '';
  let newEmail = data.user.email;
  let emailPassword = '';
  let deletePassword = '';
  let deleteConfirmation = '';

  // Settings values
  let soundEnabled = data.settings.soundEnabled;
  let musicVolume = data.settings.musicVolume;
  let sfxVolume = data.settings.sfxVolume;
  let showOnlineStatus = data.settings.showOnlineStatus;
  let showMatchHistory = data.settings.showMatchHistory;
  let allowFriendRequests = data.settings.allowFriendRequests;
  let emailNotifications = data.settings.emailNotifications;
  let gameInviteNotifications = data.settings.gameInviteNotifications;

  // Theme color values
  let accentColor = data.settings.accentColor || '#ff6b9d';
  let backgroundColor = data.settings.backgroundColor || '#1a1a2e';
  let cardColor = data.settings.cardColor || '#16213e';
  let textColor = data.settings.textColor || '#e5e5e5';

  // Live preview when colors change
  function updatePreview() {
    applyTheme({ accentColor, backgroundColor, cardColor, textColor });
  }

  function selectPreset(presetName: string) {
    const preset = presetThemes[presetName];
    if (preset) {
      accentColor = preset.accentColor;
      backgroundColor = preset.backgroundColor;
      cardColor = preset.cardColor;
      textColor = preset.textColor;
      updatePreview();
    }
  }

  function resetToDefault() {
    accentColor = defaultTheme.accentColor;
    backgroundColor = defaultTheme.backgroundColor;
    cardColor = defaultTheme.cardColor;
    textColor = defaultTheme.textColor;
    updatePreview();
  }

  function createSubmitHandler(key: keyof typeof loading) {
    return () => {
      loading[key] = true;
      error = '';
      success = '';
      return async ({ result, update }: any) => {
        loading[key] = false;
        if (result.type === 'failure') {
          error = result.data?.message || 'An error occurred';
        } else if (result.type === 'success') {
          success = result.data?.message || 'Settings saved';
          // Clear password fields on success
          if (key === 'password') {
            currentPassword = '';
            newPassword = '';
            confirmPassword = '';
          }
          if (key === 'email') {
            emailPassword = '';
          }
          setTimeout(() => success = '', 3000);
        }
        await update();
      };
    };
  }

  function handleDeleteSubmit() {
    loading.delete = true;
    error = '';
    return async ({ result, update }: any) => {
      loading.delete = false;
      if (result.type === 'failure') {
        error = result.data?.message || 'Failed to delete account';
      }
      await update();
    };
  }
</script>

<svelte:head>
  <title>Settings - PONG</title>
</svelte:head>

<div class="max-w-3xl mx-auto px-4 py-8">
  <div class="mb-6">
    <a href="/profile" class="text-pong-pink hover:text-pong-purple transition-colors">
      &larr; Back to Profile
    </a>
  </div>

  <h1 class="game-title text-3xl mb-8">Settings</h1>

  {#if error}
    <div class="bg-pong-accent/20 border border-pong-accent rounded-lg p-4 mb-6">
      <p class="text-pong-accent">{error}</p>
    </div>
  {/if}

  {#if success}
    <div class="bg-green-500/20 border border-green-500 rounded-lg p-4 mb-6">
      <p class="text-green-500">{success}</p>
    </div>
  {/if}

  <!-- Security Section -->
  <section class="card mb-6">
    <h2 class="text-xl font-semibold text-pong-pink mb-6">Security</h2>

    <!-- Change Password -->
    <div class="mb-8">
      <h3 class="text-lg font-medium text-gray-200 mb-4">Change Password</h3>
      <form
        method="POST"
        action="?/changePassword"
        use:enhance={createSubmitHandler('password')}
        class="space-y-4 max-w-md"
      >
        <div class="space-y-2">
          <label for="currentPassword" class="block text-sm font-medium text-gray-300">
            Current Password
          </label>
          <input
            id="currentPassword"
            name="currentPassword"
            type="password"
            bind:value={currentPassword}
            required
            class="input"
            disabled={loading.password}
          />
        </div>

        <div class="space-y-2">
          <label for="newPassword" class="block text-sm font-medium text-gray-300">
            New Password
          </label>
          <input
            id="newPassword"
            name="newPassword"
            type="password"
            bind:value={newPassword}
            required
            minlength="6"
            class="input"
            disabled={loading.password}
          />
        </div>

        <div class="space-y-2">
          <label for="confirmPassword" class="block text-sm font-medium text-gray-300">
            Confirm New Password
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            bind:value={confirmPassword}
            required
            minlength="6"
            class="input"
            disabled={loading.password}
          />
        </div>

        <button type="submit" class="btn-primary" disabled={loading.password}>
          {loading.password ? 'Changing...' : 'Change Password'}
        </button>
      </form>
    </div>

    <!-- Change Email -->
    <div class="pt-6 border-t border-pong-purple/20">
      <h3 class="text-lg font-medium text-gray-200 mb-4">Change Email</h3>
      <form
        method="POST"
        action="?/changeEmail"
        use:enhance={createSubmitHandler('email')}
        class="space-y-4 max-w-md"
      >
        <div class="space-y-2">
          <label for="newEmail" class="block text-sm font-medium text-gray-300">
            New Email
          </label>
          <input
            id="newEmail"
            name="newEmail"
            type="email"
            bind:value={newEmail}
            required
            class="input"
            disabled={loading.email}
          />
        </div>

        <div class="space-y-2">
          <label for="emailPassword" class="block text-sm font-medium text-gray-300">
            Current Password
          </label>
          <input
            id="emailPassword"
            name="password"
            type="password"
            bind:value={emailPassword}
            required
            class="input"
            disabled={loading.email}
          />
          <p class="text-xs text-gray-400">Enter your password to confirm this change</p>
        </div>

        <button type="submit" class="btn-primary" disabled={loading.email}>
          {loading.email ? 'Updating...' : 'Update Email'}
        </button>
      </form>
    </div>
  </section>

  <!-- Preferences Section -->
  <section class="card mb-6">
    <h2 class="text-xl font-semibold text-pong-pink mb-6">Game Preferences</h2>

    <form
      method="POST"
      action="?/updatePreferences"
      use:enhance={createSubmitHandler('preferences')}
      class="space-y-6"
    >
      <label class="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          name="soundEnabled"
          bind:checked={soundEnabled}
          class="w-5 h-5 rounded border-pong-purple/30 bg-pong-darker text-pong-pink focus:ring-pong-pink"
        />
        <span class="text-gray-300">Enable Sound</span>
      </label>

      <div class="space-y-2">
        <label for="musicVolume" class="block text-sm font-medium text-gray-300">
          Music Volume: {musicVolume}%
        </label>
        <input
          id="musicVolume"
          name="musicVolume"
          type="range"
          min="0"
          max="100"
          bind:value={musicVolume}
          class="w-full max-w-md accent-pong-pink"
        />
      </div>

      <div class="space-y-2">
        <label for="sfxVolume" class="block text-sm font-medium text-gray-300">
          Sound Effects Volume: {sfxVolume}%
        </label>
        <input
          id="sfxVolume"
          name="sfxVolume"
          type="range"
          min="0"
          max="100"
          bind:value={sfxVolume}
          class="w-full max-w-md accent-pong-pink"
        />
      </div>

      <button type="submit" class="btn-primary" disabled={loading.preferences}>
        {loading.preferences ? 'Saving...' : 'Save Preferences'}
      </button>
    </form>
  </section>

  <!-- Notifications Section -->
  <section class="card mb-6">
    <h2 class="text-xl font-semibold text-pong-pink mb-6">Notifications</h2>

    <form
      method="POST"
      action="?/updateNotifications"
      use:enhance={createSubmitHandler('notifications')}
      class="space-y-4"
    >
      <label class="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          name="emailNotifications"
          bind:checked={emailNotifications}
          class="w-5 h-5 rounded border-pong-purple/30 bg-pong-darker text-pong-pink focus:ring-pong-pink"
        />
        <div>
          <span class="text-gray-300">Email Notifications</span>
          <p class="text-xs text-gray-400">Receive updates and news via email</p>
        </div>
      </label>

      <label class="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          name="gameInviteNotifications"
          bind:checked={gameInviteNotifications}
          class="w-5 h-5 rounded border-pong-purple/30 bg-pong-darker text-pong-pink focus:ring-pong-pink"
        />
        <div>
          <span class="text-gray-300">Game Invite Notifications</span>
          <p class="text-xs text-gray-400">Get notified when someone invites you to play</p>
        </div>
      </label>

      <button type="submit" class="btn-primary" disabled={loading.notifications}>
        {loading.notifications ? 'Saving...' : 'Save Notifications'}
      </button>
    </form>
  </section>

  <!-- Privacy Section -->
  <section class="card mb-6">
    <h2 class="text-xl font-semibold text-pong-pink mb-6">Privacy</h2>

    <form
      method="POST"
      action="?/updatePrivacy"
      use:enhance={createSubmitHandler('privacy')}
      class="space-y-4"
    >
      <label class="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          name="showOnlineStatus"
          bind:checked={showOnlineStatus}
          class="w-5 h-5 rounded border-pong-purple/30 bg-pong-darker text-pong-pink focus:ring-pong-pink"
        />
        <div>
          <span class="text-gray-300">Show Online Status</span>
          <p class="text-xs text-gray-400">Let others see when you're online</p>
        </div>
      </label>

      <label class="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          name="showMatchHistory"
          bind:checked={showMatchHistory}
          class="w-5 h-5 rounded border-pong-purple/30 bg-pong-darker text-pong-pink focus:ring-pong-pink"
        />
        <div>
          <span class="text-gray-300">Show Match History</span>
          <p class="text-xs text-gray-400">Allow others to view your match history</p>
        </div>
      </label>

      <label class="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          name="allowFriendRequests"
          bind:checked={allowFriendRequests}
          class="w-5 h-5 rounded border-pong-purple/30 bg-pong-darker text-pong-pink focus:ring-pong-pink"
        />
        <div>
          <span class="text-gray-300">Allow Friend Requests</span>
          <p class="text-xs text-gray-400">Let others send you friend requests</p>
        </div>
      </label>

      <button type="submit" class="btn-primary" disabled={loading.privacy}>
        {loading.privacy ? 'Saving...' : 'Save Privacy Settings'}
      </button>
    </form>
  </section>

  <!-- Appearance Section -->
  <section class="card mb-6">
    <h2 class="text-xl font-semibold text-accent mb-6">Appearance</h2>

    <!-- Theme Presets -->
    <div class="mb-8">
      <h3 class="text-lg font-medium text-gray-200 mb-4">Theme Presets</h3>
      <div class="flex flex-wrap gap-3">
        {#each Object.entries(presetThemes) as [name, preset]}
          <button
            type="button"
            on:click={() => selectPreset(name)}
            class="flex items-center gap-2 px-4 py-2 rounded-lg border transition-all hover:scale-105"
            style="border-color: {preset.accentColor}; background-color: {preset.backgroundColor};"
          >
            <div
              class="w-4 h-4 rounded-full"
              style="background-color: {preset.accentColor};"
            ></div>
            <span class="capitalize" style="color: {preset.textColor};">{name}</span>
          </button>
        {/each}
      </div>
    </div>

    <!-- Custom Colors -->
    <form
      method="POST"
      action="?/updateTheme"
      use:enhance={createSubmitHandler('theme')}
      class="space-y-6"
    >
      <h3 class="text-lg font-medium text-gray-200">Custom Colors</h3>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <!-- Accent Color -->
        <div class="space-y-2">
          <label for="accentColor" class="block text-sm font-medium text-gray-300">
            Accent Color
          </label>
          <div class="flex items-center gap-3">
            <input
              type="color"
              id="accentColor"
              name="accentColor"
              bind:value={accentColor}
              on:input={updatePreview}
              class="w-12 h-10 rounded cursor-pointer border-0 bg-transparent"
            />
            <input
              type="text"
              value={accentColor}
              on:input={(e) => { accentColor = e.currentTarget.value; updatePreview(); }}
              class="input flex-1"
              pattern="^#[0-9A-Fa-f]{6}$"
            />
          </div>
          <p class="text-xs text-gray-400">Buttons, links, highlights</p>
        </div>

        <!-- Background Color -->
        <div class="space-y-2">
          <label for="backgroundColor" class="block text-sm font-medium text-gray-300">
            Background Color
          </label>
          <div class="flex items-center gap-3">
            <input
              type="color"
              id="backgroundColor"
              name="backgroundColor"
              bind:value={backgroundColor}
              on:input={updatePreview}
              class="w-12 h-10 rounded cursor-pointer border-0 bg-transparent"
            />
            <input
              type="text"
              value={backgroundColor}
              on:input={(e) => { backgroundColor = e.currentTarget.value; updatePreview(); }}
              class="input flex-1"
              pattern="^#[0-9A-Fa-f]{6}$"
            />
          </div>
          <p class="text-xs text-gray-400">Page background</p>
        </div>

        <!-- Card Color -->
        <div class="space-y-2">
          <label for="cardColor" class="block text-sm font-medium text-gray-300">
            Card Color
          </label>
          <div class="flex items-center gap-3">
            <input
              type="color"
              id="cardColor"
              name="cardColor"
              bind:value={cardColor}
              on:input={updatePreview}
              class="w-12 h-10 rounded cursor-pointer border-0 bg-transparent"
            />
            <input
              type="text"
              value={cardColor}
              on:input={(e) => { cardColor = e.currentTarget.value; updatePreview(); }}
              class="input flex-1"
              pattern="^#[0-9A-Fa-f]{6}$"
            />
          </div>
          <p class="text-xs text-gray-400">Cards, navigation, footer</p>
        </div>

        <!-- Text Color -->
        <div class="space-y-2">
          <label for="textColor" class="block text-sm font-medium text-gray-300">
            Text Color
          </label>
          <div class="flex items-center gap-3">
            <input
              type="color"
              id="textColor"
              name="textColor"
              bind:value={textColor}
              on:input={updatePreview}
              class="w-12 h-10 rounded cursor-pointer border-0 bg-transparent"
            />
            <input
              type="text"
              value={textColor}
              on:input={(e) => { textColor = e.currentTarget.value; updatePreview(); }}
              class="input flex-1"
              pattern="^#[0-9A-Fa-f]{6}$"
            />
          </div>
          <p class="text-xs text-gray-400">Main text color</p>
        </div>
      </div>

      <div class="flex gap-4 pt-4">
        <button type="submit" class="btn-primary" disabled={loading.theme}>
          {loading.theme ? 'Saving...' : 'Save Colors'}
        </button>
        <button type="button" on:click={resetToDefault} class="btn-secondary">
          Reset to Default
        </button>
      </div>
    </form>
  </section>

  <!-- Danger Zone -->
  <section class="card border-pong-accent/50">
    <h2 class="text-xl font-semibold text-pong-accent mb-4">Danger Zone</h2>
    <p class="text-gray-400 mb-6">
      Once you delete your account, there is no going back. Please be certain.
    </p>

    <button
      type="button"
      on:click={() => showDeleteModal = true}
      class="px-4 py-2 bg-pong-accent/20 border border-pong-accent text-pong-accent rounded-lg hover:bg-pong-accent/30 transition-colors"
    >
      Delete Account
    </button>
  </section>
</div>

<!-- Delete Account Modal -->
{#if showDeleteModal}
  <div class="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
    <div class="card max-w-md w-full">
      <h2 class="text-xl font-semibold text-pong-accent mb-4">Delete Account</h2>
      <p class="text-gray-400 mb-6">
        This action cannot be undone. All your data will be permanently deleted.
      </p>

      <form
        method="POST"
        action="?/deleteAccount"
        use:enhance={handleDeleteSubmit}
        class="space-y-4"
      >
        <div class="space-y-2">
          <label for="deletePassword" class="block text-sm font-medium text-gray-300">
            Enter your password
          </label>
          <input
            id="deletePassword"
            name="password"
            type="password"
            bind:value={deletePassword}
            required
            class="input"
            disabled={loading.delete}
          />
        </div>

        <div class="space-y-2">
          <label for="deleteConfirmation" class="block text-sm font-medium text-gray-300">
            Type DELETE to confirm
          </label>
          <input
            id="deleteConfirmation"
            name="confirmation"
            type="text"
            bind:value={deleteConfirmation}
            required
            placeholder="DELETE"
            class="input"
            disabled={loading.delete}
          />
        </div>

        <div class="flex gap-4 pt-4">
          <button
            type="submit"
            class="px-4 py-2 bg-pong-accent text-white rounded-lg hover:bg-pong-accent/80 transition-colors"
            disabled={loading.delete || deleteConfirmation !== 'DELETE'}
          >
            {loading.delete ? 'Deleting...' : 'Delete My Account'}
          </button>
          <button
            type="button"
            on:click={() => {
              showDeleteModal = false;
              deletePassword = '';
              deleteConfirmation = '';
            }}
            class="btn-secondary"
            disabled={loading.delete}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
{/if}

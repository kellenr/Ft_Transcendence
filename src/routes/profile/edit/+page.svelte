<script lang="ts">
  import { enhance } from '$app/forms';
  import { predefinedAvatars } from '$lib/stores/theme';
  import type { PageData } from './$types';

  export let data: PageData;

  let displayName = data.user.displayName || '';
  let bio = data.user.bio || '';
  let avatarPreview = data.user.avatar;
  let loading = false;
  let avatarLoading = false;
  let error = '';
  let success = '';
  let selectedPredefinedAvatar = '';

  let fileInput: HTMLInputElement;

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleProfileSubmit = () => {
    loading = true;
    error = '';
    success = '';
    return async ({ result, update }: any) => {
      loading = false;
      if (result.type === 'failure') {
        error = result.data?.message || 'Failed to update profile';
      } else if (result.type === 'success') {
        success = result.data?.message || 'Profile updated';
        setTimeout(() => success = '', 3000);
      }
      await update();
    };
  };

  const handleAvatarSubmit = () => {
    avatarLoading = true;
    error = '';
    success = '';
    return async ({ result, update }: any) => {
      avatarLoading = false;
      if (result.type === 'failure') {
        error = result.data?.message || 'Failed to upload avatar';
      } else if (result.type === 'success') {
        success = result.data?.message || 'Avatar updated';
        if (result.data?.avatar) {
          avatarPreview = result.data.avatar;
        }
        setTimeout(() => success = '', 3000);
      }
      await update();
    };
  };

  const handleRemoveAvatar = () => {
    avatarLoading = true;
    error = '';
    success = '';
    return async ({ result, update }: any) => {
      avatarLoading = false;
      if (result.type === 'failure') {
        error = result.data?.message || 'Failed to remove avatar';
      } else if (result.type === 'success') {
        success = result.data?.message || 'Avatar removed';
        avatarPreview = null;
        setTimeout(() => success = '', 3000);
      }
      await update();
    };
  };

  const handleSelectPredefinedAvatar = () => {
    avatarLoading = true;
    error = '';
    success = '';
    return async ({ result, update }: any) => {
      avatarLoading = false;
      if (result.type === 'failure') {
        error = result.data?.message || 'Failed to select avatar';
      } else if (result.type === 'success') {
        success = result.data?.message || 'Avatar updated';
        if (result.data?.avatar) {
          avatarPreview = result.data.avatar;
        }
        setTimeout(() => success = '', 3000);
      }
      await update();
    };
  };

  function handleFileChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        avatarPreview = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }
</script>

<svelte:head>
  <title>Edit Profile - PONG</title>
</svelte:head>

<div class="max-w-2xl mx-auto px-4 py-8">
  <div class="mb-6">
    <a href="/profile" class="link">
      &larr; Back to Profile
    </a>
  </div>

  <h1 class="game-title text-3xl mb-8">Edit Profile</h1>

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

  <!-- Avatar Section -->
  <div class="card mb-8">
    <h2 class="text-xl font-semibold text-accent mb-4">Profile Picture</h2>

    <div class="flex flex-col sm:flex-row items-center gap-6 mb-8">
      <!-- Avatar Preview -->
      <div class="relative">
        {#if avatarPreview}
          <img
            src={avatarPreview}
            alt="Avatar preview"
            class="w-32 h-32 rounded-full border-4 border-accent object-cover"
          />
        {:else}
          <div class="w-32 h-32 rounded-full border-4 border-accent bg-page flex items-center justify-center">
            <span class="text-4xl font-bold text-accent">
              {getInitials(displayName || data.user.username)}
            </span>
          </div>
        {/if}
      </div>

      <!-- Current avatar info -->
      <div class="flex-1">
        <p class="text-gray-300 mb-2">Current avatar</p>
        {#if avatarPreview}
          <form
            method="POST"
            action="?/removeAvatar"
            use:enhance={handleRemoveAvatar}
          >
            <button
              type="submit"
              class="text-pong-accent hover:text-pong-accent/80 text-sm transition-colors"
              disabled={avatarLoading}
            >
              Remove avatar
            </button>
          </form>
        {:else}
          <p class="text-gray-400 text-sm">No avatar selected</p>
        {/if}
      </div>
    </div>

    <!-- Predefined Avatars -->
    <div class="mb-8">
      <h3 class="text-lg font-medium text-gray-200 mb-4">Choose a Pixel Art Avatar</h3>
      <div class="grid grid-cols-4 sm:grid-cols-8 gap-3">
        {#each predefinedAvatars as avatar}
          <form
            method="POST"
            action="?/selectPredefinedAvatar"
            use:enhance={handleSelectPredefinedAvatar}
            class="contents"
          >
            <input type="hidden" name="avatarPath" value={avatar.path} />
            <button
              type="submit"
              class="w-14 h-14 sm:w-16 sm:h-16 rounded-lg border-2 p-1 transition-all hover:scale-110 {avatarPreview === avatar.path ? 'border-accent bg-accent/20' : 'border-gray-600 hover:border-accent/50'}"
              disabled={avatarLoading}
              title={avatar.name}
            >
              <img
                src={avatar.path}
                alt={avatar.name}
                class="w-full h-full object-contain"
              />
            </button>
          </form>
        {/each}
      </div>
    </div>

    <!-- Custom Upload -->
    <div>
      <h3 class="text-lg font-medium text-gray-200 mb-4">Or Upload Your Own</h3>
      <p class="text-gray-400 text-sm mb-4">
        Supported formats: JPG, PNG, GIF, WebP. Max size: 5MB.
      </p>

      <form
        method="POST"
        action="?/uploadAvatar"
        enctype="multipart/form-data"
        use:enhance={handleAvatarSubmit}
        class="flex flex-wrap gap-3"
      >
        <input
          type="file"
          name="avatar"
          accept="image/jpeg,image/png,image/gif,image/webp"
          bind:this={fileInput}
          on:change={handleFileChange}
          class="hidden"
        />

        <button
          type="button"
          on:click={() => fileInput.click()}
          class="btn-secondary text-sm"
          disabled={avatarLoading}
        >
          Choose File
        </button>

        <button
          type="submit"
          class="btn-primary text-sm"
          disabled={avatarLoading}
        >
          {avatarLoading ? 'Uploading...' : 'Upload'}
        </button>
      </form>
    </div>
  </div>

  <!-- Profile Info Section -->
  <div class="card">
    <h2 class="text-xl font-semibold text-accent mb-6">Profile Information</h2>

    <form
      method="POST"
      action="?/updateProfile"
      use:enhance={handleProfileSubmit}
      class="space-y-6"
    >
      <div class="space-y-2">
        <label for="username" class="block text-sm font-medium text-gray-300">
          Username
        </label>
        <input
          id="username"
          type="text"
          value={data.user.username}
          disabled
          class="input opacity-50 cursor-not-allowed"
        />
        <p class="text-xs text-gray-400">Username cannot be changed</p>
      </div>

      <div class="space-y-2">
        <label for="displayName" class="block text-sm font-medium text-gray-300">
          Display Name
        </label>
        <input
          id="displayName"
          name="displayName"
          type="text"
          bind:value={displayName}
          maxlength="50"
          placeholder="Enter a display name"
          class="input"
          disabled={loading}
        />
        <p class="text-xs text-gray-400">
          {displayName.length}/50 characters - This is how others will see you
        </p>
      </div>

      <div class="space-y-2">
        <label for="bio" class="block text-sm font-medium text-gray-300">
          Bio
        </label>
        <textarea
          id="bio"
          name="bio"
          bind:value={bio}
          maxlength="500"
          rows="4"
          placeholder="Tell us about yourself..."
          class="input resize-none"
          disabled={loading}
        ></textarea>
        <p class="text-xs text-gray-400">
          {bio.length}/500 characters
        </p>
      </div>

      <div class="flex gap-4 pt-4">
        <button
          type="submit"
          class="btn-primary"
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
        <a href="/profile" class="btn-secondary">
          Cancel
        </a>
      </div>
    </form>
  </div>
</div>

<script lang="ts">
  import PongGame from '$lib/components/PongGame.svelte';

  // Game mode state
  let gameMode: 'local' | 'ai' = 'local';
  let aiDifficulty: 'easy' | 'medium' | 'hard' = 'medium';

  function selectMode(mode: 'local' | 'ai') {
    gameMode = mode;
  }

  function selectDifficulty(diff: 'easy' | 'medium' | 'hard') {
    aiDifficulty = diff;
  }
</script>

<svelte:head>
  <title>Play Pong - ft_transcendence</title>
  <meta name="description" content="Play Pong against a friend or AI!" />
</svelte:head>

<div class="game-page">
  <header class="game-header">
    <h1 class="game-title text-3xl">PONG</h1>
    <p class="subtitle">
      {#if gameMode === 'local'}
        Local 2-Player Mode
      {:else}
        vs AI ({aiDifficulty})
      {/if}
    </p>
  </header>

  <PongGame {gameMode} {aiDifficulty} on:quit={() => gameMode = gameMode} />

  <div class="game-options">
    <!-- Game Mode Selection -->
    <div class="option-group">
      <h2 class="option-title">Game Mode</h2>
      <div class="option-buttons">
        <button
          class="mode-btn"
          class:active={gameMode === 'local'}
          on:click={() => selectMode('local')}
        >
          <span class="btn-icon">👥</span>
          <span class="btn-text">Local 2P</span>
        </button>

        <button
          class="mode-btn"
          class:active={gameMode === 'ai'}
          on:click={() => selectMode('ai')}
        >
          <span class="btn-icon">🤖</span>
          <span class="btn-text">vs AI</span>
        </button>

        <button class="mode-btn disabled" disabled>
          <span class="btn-icon">🌐</span>
          <span class="btn-text">Online</span>
          <span class="btn-soon">Soon</span>
        </button>

        <button class="mode-btn disabled" disabled>
          <span class="btn-icon">🏆</span>
          <span class="btn-text">Tournament</span>
          <span class="btn-soon">Soon</span>
        </button>
      </div>
    </div>

    <!-- AI Difficulty (only shown when AI mode is selected) -->
    {#if gameMode === 'ai'}
      <div class="option-group">
        <h2 class="option-title">AI Difficulty</h2>
        <div class="option-buttons">
          <button
            class="diff-btn"
            class:active={aiDifficulty === 'easy'}
            on:click={() => selectDifficulty('easy')}
          >
            <span class="diff-emoji">😊</span>
            <span>Easy</span>
          </button>

          <button
            class="diff-btn"
            class:active={aiDifficulty === 'medium'}
            on:click={() => selectDifficulty('medium')}
          >
            <span class="diff-emoji">😐</span>
            <span>Medium</span>
          </button>

          <button
            class="diff-btn"
            class:active={aiDifficulty === 'hard'}
            on:click={() => selectDifficulty('hard')}
          >
            <span class="diff-emoji">😈</span>
            <span>Hard</span>
          </button>
        </div>
      </div>
    {/if}
  </div>
</div>

<style>
  .game-page {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 2rem;
    gap: 2rem;
    min-height: calc(100vh - 200px);
  }

  .game-header {
    text-align: center;
  }

  .subtitle {
    color: rgba(255, 255, 255, 0.6);
    margin-top: 0.5rem;
  }

  .game-options {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    margin-top: 1rem;
  }

  .option-group {
    text-align: center;
  }

  .option-title {
    font-size: 1rem;
    font-weight: 600;
    color: #ff6b9d;
    margin-bottom: 0.75rem;
  }

  .option-buttons {
    display: flex;
    gap: 0.75rem;
    flex-wrap: wrap;
    justify-content: center;
  }

  /* Mode buttons */
  .mode-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
    padding: 0.75rem 1.25rem;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.2s;
    min-width: 100px;
    position: relative;
  }

  .mode-btn:hover:not(:disabled) {
    background: rgba(255, 107, 157, 0.1);
    border-color: rgba(255, 107, 157, 0.3);
    transform: translateY(-2px);
  }

  .mode-btn.active {
    background: rgba(255, 107, 157, 0.2);
    border-color: #ff6b9d;
    box-shadow: 0 0 20px rgba(255, 107, 157, 0.3);
  }

  .mode-btn.disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  .btn-icon {
    font-size: 1.5rem;
  }

  .btn-text {
    font-weight: 600;
    color: white;
    font-size: 0.9rem;
  }

  .btn-soon {
    font-size: 0.65rem;
    color: rgba(255, 255, 255, 0.4);
    position: absolute;
    bottom: 4px;
    right: 8px;
  }

  /* Difficulty buttons */
  .diff-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;
    color: white;
    font-weight: 500;
  }

  .diff-btn:hover {
    background: rgba(199, 125, 255, 0.1);
    border-color: rgba(199, 125, 255, 0.3);
  }

  .diff-btn.active {
    background: rgba(199, 125, 255, 0.2);
    border-color: #c77dff;
    box-shadow: 0 0 15px rgba(199, 125, 255, 0.3);
  }

  .diff-emoji {
    font-size: 1.25rem;
  }
</style>
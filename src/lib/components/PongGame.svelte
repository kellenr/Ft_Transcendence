<script lang="ts">
  import { onMount, onDestroy } from 'svelte';

  // ==========================================================================
  // PROPS - Settings passed from parent component
  // ==========================================================================
  export let gameMode: 'local' | 'ai' = 'local';  // 'local' = 2 players, 'ai' = vs computer
  export let aiDifficulty: 'easy' | 'medium' | 'hard' = 'medium';

  // Event dispatcher to notify parent component
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  // ==========================================================================
  // GAME CONFIGURATION
  // ==========================================================================
  // All the settings for the game - easy to tweak!
  // ==========================================================================

  const CONFIG = {
    // Canvas size
    WIDTH: 800,
    HEIGHT: 500,

    // Paddle settings
    PADDLE_WIDTH: 12,
    PADDLE_HEIGHT: 100,
    PADDLE_SPEED: 8,
    PADDLE_MARGIN: 20,      // Distance from edge

    // Ball settings
    BALL_SIZE: 14,
    BALL_SPEED_INITIAL: 5,
    BALL_SPEED_INCREASE: 0.5,  // Speed up after each hit
    BALL_MAX_SPEED: 15,

    // Game settings
    WINNING_SCORE: 5,

    // AI Settings (will be adjusted based on difficulty)
    AI: {
      easy: {
        reactionDelay: 150,    // ms before AI reacts
        errorMargin: 60,       // pixels of randomness
        speedMultiplier: 0.6,  // slower than max speed
        predictionError: 80    // how wrong the prediction can be
      },
      medium: {
        reactionDelay: 80,
        errorMargin: 30,
        speedMultiplier: 0.85,
        predictionError: 40
      },
      hard: {
        reactionDelay: 30,
        errorMargin: 10,
        speedMultiplier: 1,
        predictionError: 15
      }
    },

    // Colors (matching your pink/purple theme!)
    COLORS: {
      background: '#1a1a2e',
      paddle1: '#ff6b9d',      // Pink
      paddle2: '#c77dff',      // Purple
      ball: '#ffffff',
      ballGlow: '#ff6b9d',
      centerLine: '#ffffff20',
      text: '#ffffff',
      score: '#ff6b9d'
    }
  };

  // ==========================================================================
  // GAME STATE
  // ==========================================================================
  // All the variables that change during gameplay
  // ==========================================================================

  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;
  let animationId: number;
  let gameRunning = false;
  let gameOver = false;
  let winner = '';
  let countdown = 0;
  let isPaused = false;

  // Paddle positions (Y coordinate - top of paddle)
  let paddle1Y = CONFIG.HEIGHT / 2 - CONFIG.PADDLE_HEIGHT / 2;
  let paddle2Y = CONFIG.HEIGHT / 2 - CONFIG.PADDLE_HEIGHT / 2;

  // Ball position and velocity
  let ballX = CONFIG.WIDTH / 2;
  let ballY = CONFIG.HEIGHT / 2;
  let ballVX = CONFIG.BALL_SPEED_INITIAL;  // Velocity X
  let ballVY = CONFIG.BALL_SPEED_INITIAL;  // Velocity Y

  // Scores
  let score1 = 0;
  let score2 = 0;

  // Keyboard state
  let keys: { [key: string]: boolean } = {};

  // AI state
  let aiTargetY = CONFIG.HEIGHT / 2;       // Where AI wants to move
  let aiLastUpdateTime = 0;                 // When AI last recalculated
  let aiRandomOffset = 0;                   // Random error in AI prediction

  // ==========================================================================
  // AI LOGIC
  // ==========================================================================

  function updateAI() {
    if (gameMode !== 'ai' || !gameRunning || isPaused) return;

    const aiConfig = CONFIG.AI[aiDifficulty];
    const now = Date.now();

    // Only update AI target periodically (simulates reaction time)
    if (now - aiLastUpdateTime > aiConfig.reactionDelay) {
      aiLastUpdateTime = now;

      // Predict where ball will be when it reaches the paddle
      if (ballVX > 0) {  // Ball moving toward AI
        const predictedY = predictBallY();

        // Add some randomness/error based on difficulty
        aiRandomOffset = (Math.random() - 0.5) * aiConfig.predictionError;
        aiTargetY = predictedY + aiRandomOffset;

        // Add error margin (makes AI less perfect)
        aiTargetY += (Math.random() - 0.5) * aiConfig.errorMargin;
      } else {
        // Ball moving away - return to center (with some variance)
        aiTargetY = CONFIG.HEIGHT / 2 + (Math.random() - 0.5) * 50;
      }

      // Clamp target to valid range
      aiTargetY = Math.max(
        CONFIG.PADDLE_HEIGHT / 2,
        Math.min(CONFIG.HEIGHT - CONFIG.PADDLE_HEIGHT / 2, aiTargetY)
      );
    }

    // Move paddle toward target
    const paddleCenter = paddle2Y + CONFIG.PADDLE_HEIGHT / 2;
    const maxSpeed = CONFIG.PADDLE_SPEED * aiConfig.speedMultiplier;

    if (Math.abs(paddleCenter - aiTargetY) > 5) {  // Dead zone to prevent jitter
      if (paddleCenter < aiTargetY) {
        paddle2Y = Math.min(
          paddle2Y + maxSpeed,
          CONFIG.HEIGHT - CONFIG.PADDLE_HEIGHT
        );
      } else {
        paddle2Y = Math.max(paddle2Y - maxSpeed, 0);
      }
    }
  }

  // Predict where the ball will be when it reaches the AI's paddle
  function predictBallY(): number {
    if (ballVX <= 0) return CONFIG.HEIGHT / 2;

    // Calculate time for ball to reach AI paddle
    const paddle2X = CONFIG.WIDTH - CONFIG.PADDLE_MARGIN - CONFIG.PADDLE_WIDTH;
    const distanceToTravel = paddle2X - ballX;

    if (distanceToTravel <= 0) return ballY;

    // Simple prediction (doesn't account for wall bounces perfectly)
    let predictedY = ballY + (ballVY * distanceToTravel / ballVX);

    // Account for bounces off top/bottom walls
    const bounces = Math.floor(Math.abs(predictedY) / CONFIG.HEIGHT);

    // Simulate bounces
    while (predictedY < 0 || predictedY > CONFIG.HEIGHT) {
      if (predictedY < 0) {
        predictedY = -predictedY;
      }
      if (predictedY > CONFIG.HEIGHT) {
        predictedY = 2 * CONFIG.HEIGHT - predictedY;
      }
    }

    return predictedY;
  }

  // ==========================================================================
  // KEYBOARD HANDLING
  // ==========================================================================

  function handleKeyDown(e: KeyboardEvent) {
    keys[e.key.toLowerCase()] = true;

    // Prevent page scrolling with arrow keys
    if (['arrowup', 'arrowdown', ' '].includes(e.key.toLowerCase())) {
      e.preventDefault();
    }

    // Space to start/pause
    if (e.key === ' ' && !gameOver) {
      if (!gameRunning) {
        startGame();
      } else {
        isPaused = !isPaused;
      }
    }

    // R to restart after game over
    if (e.key.toLowerCase() === 'r' && gameOver) {
      resetGame();
    }

    // ESC to quit game
    if (e.key === 'Escape') {
      quitGame();
    }
  }

  function handleKeyUp(e: KeyboardEvent) {
    keys[e.key.toLowerCase()] = false;
  }

  // Quit game function
  function quitGame() {
    gameRunning = false;
    isPaused = false;
    resetGame();
    dispatch('quit');  // Notify parent component
  }

  // ==========================================================================
  // GAME LOGIC
  // ==========================================================================

  function startGame() {
    countdown = 3;
    gameRunning = false;

    // Countdown timer
    const countdownInterval = setInterval(() => {
      countdown--;
      if (countdown <= 0) {
        clearInterval(countdownInterval);
        gameRunning = true;
        // Random initial direction
        ballVX = (Math.random() > 0.5 ? 1 : -1) * CONFIG.BALL_SPEED_INITIAL;
        ballVY = (Math.random() * 2 - 1) * CONFIG.BALL_SPEED_INITIAL;
      }
    }, 1000);
  }

  function resetGame() {
    score1 = 0;
    score2 = 0;
    gameOver = false;
    winner = '';
    resetBall();
    paddle1Y = CONFIG.HEIGHT / 2 - CONFIG.PADDLE_HEIGHT / 2;
    paddle2Y = CONFIG.HEIGHT / 2 - CONFIG.PADDLE_HEIGHT / 2;
    isPaused = false;
    gameRunning = false;
    aiTargetY = CONFIG.HEIGHT / 2;
  }

  function resetBall() {
    ballX = CONFIG.WIDTH / 2;
    ballY = CONFIG.HEIGHT / 2;
    ballVX = 0;
    ballVY = 0;
  }

  function serveBall(direction: number) {
    // direction: 1 = serve right, -1 = serve left
    ballVX = direction * CONFIG.BALL_SPEED_INITIAL;
    ballVY = (Math.random() * 2 - 1) * CONFIG.BALL_SPEED_INITIAL;
  }

  // ==========================================================================
  // UPDATE FUNCTION (runs every frame)
  // ==========================================================================

  function update() {
    if (!gameRunning || isPaused || gameOver) return;

    // ------------------------------------------------------------------------
    // Move paddles based on key presses
    // ------------------------------------------------------------------------

    // Player 1: W (up) and S (down)
    if (keys['w'] && paddle1Y > 0) {
      paddle1Y -= CONFIG.PADDLE_SPEED;
    }
    if (keys['s'] && paddle1Y < CONFIG.HEIGHT - CONFIG.PADDLE_HEIGHT) {
      paddle1Y += CONFIG.PADDLE_SPEED;
    }

    // Player 2: Arrow Up and Arrow Down (only in local mode)
    if (gameMode === 'local') {
      if (keys['arrowup'] && paddle2Y > 0) {
        paddle2Y -= CONFIG.PADDLE_SPEED;
      }
      if (keys['arrowdown'] && paddle2Y < CONFIG.HEIGHT - CONFIG.PADDLE_HEIGHT) {
        paddle2Y += CONFIG.PADDLE_SPEED;
      }
    } else {
      // AI controls paddle 2
      updateAI();
    }

    // ------------------------------------------------------------------------
    // Move ball
    // ------------------------------------------------------------------------
    ballX += ballVX;
    ballY += ballVY;

    // ------------------------------------------------------------------------
    // Ball collision with top/bottom walls
    // ------------------------------------------------------------------------
    if (ballY - CONFIG.BALL_SIZE / 2 <= 0) {
      ballY = CONFIG.BALL_SIZE / 2;
      ballVY = -ballVY;
    }
    if (ballY + CONFIG.BALL_SIZE / 2 >= CONFIG.HEIGHT) {
      ballY = CONFIG.HEIGHT - CONFIG.BALL_SIZE / 2;
      ballVY = -ballVY;
    }

    // ------------------------------------------------------------------------
    // Ball collision with paddles
    // ------------------------------------------------------------------------

    // Paddle 1 (left)
    const paddle1X = CONFIG.PADDLE_MARGIN;
    if (
      ballX - CONFIG.BALL_SIZE / 2 <= paddle1X + CONFIG.PADDLE_WIDTH &&
      ballX + CONFIG.BALL_SIZE / 2 >= paddle1X &&
      ballY >= paddle1Y &&
      ballY <= paddle1Y + CONFIG.PADDLE_HEIGHT &&
      ballVX < 0  // Ball moving left
    ) {
      // Bounce!
      ballX = paddle1X + CONFIG.PADDLE_WIDTH + CONFIG.BALL_SIZE / 2;
      ballVX = -ballVX;

      // Add spin based on where ball hit the paddle
      const hitPoint = (ballY - paddle1Y) / CONFIG.PADDLE_HEIGHT; // 0 to 1
      ballVY = (hitPoint - 0.5) * 10; // -5 to +5

      // Speed up (but cap it)
      if (Math.abs(ballVX) < CONFIG.BALL_MAX_SPEED) {
        ballVX *= 1 + CONFIG.BALL_SPEED_INCREASE / 10;
      }
    }

    // Paddle 2 (right)
    const paddle2X = CONFIG.WIDTH - CONFIG.PADDLE_MARGIN - CONFIG.PADDLE_WIDTH;
    if (
      ballX + CONFIG.BALL_SIZE / 2 >= paddle2X &&
      ballX - CONFIG.BALL_SIZE / 2 <= paddle2X + CONFIG.PADDLE_WIDTH &&
      ballY >= paddle2Y &&
      ballY <= paddle2Y + CONFIG.PADDLE_HEIGHT &&
      ballVX > 0  // Ball moving right
    ) {
      // Bounce!
      ballX = paddle2X - CONFIG.BALL_SIZE / 2;
      ballVX = -ballVX;

      // Add spin
      const hitPoint = (ballY - paddle2Y) / CONFIG.PADDLE_HEIGHT;
      ballVY = (hitPoint - 0.5) * 10;

      // Speed up
      if (Math.abs(ballVX) < CONFIG.BALL_MAX_SPEED) {
        ballVX *= 1 + CONFIG.BALL_SPEED_INCREASE / 10;
      }
    }

    // ------------------------------------------------------------------------
    // Scoring - ball goes past paddle
    // ------------------------------------------------------------------------

    // Ball goes past left side (Player 2 / AI scores)
    if (ballX < 0) {
      score2++;
      checkWinner();
      if (!gameOver) {
        resetBall();
        setTimeout(() => serveBall(-1), 1000); // Serve toward P1
      }
    }

    // Ball goes past right side (Player 1 scores)
    if (ballX > CONFIG.WIDTH) {
      score1++;
      checkWinner();
      if (!gameOver) {
        resetBall();
        setTimeout(() => serveBall(1), 1000); // Serve toward P2/AI
      }
    }
  }

  function checkWinner() {
    if (score1 >= CONFIG.WINNING_SCORE) {
      gameOver = true;
      winner = gameMode === 'ai' ? 'You Win!' : 'Player 1';
      gameRunning = false;
    } else if (score2 >= CONFIG.WINNING_SCORE) {
      gameOver = true;
      winner = gameMode === 'ai' ? 'AI Wins!' : 'Player 2';
      gameRunning = false;
    }
  }

  // ==========================================================================
  // DRAW FUNCTION (renders the game)
  // ==========================================================================

  function draw() {
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = CONFIG.COLORS.background;
    ctx.fillRect(0, 0, CONFIG.WIDTH, CONFIG.HEIGHT);

    // ------------------------------------------------------------------------
    // Draw center line (dashed)
    // ------------------------------------------------------------------------
    ctx.strokeStyle = CONFIG.COLORS.centerLine;
    ctx.lineWidth = 4;
    ctx.setLineDash([20, 15]);
    ctx.beginPath();
    ctx.moveTo(CONFIG.WIDTH / 2, 0);
    ctx.lineTo(CONFIG.WIDTH / 2, CONFIG.HEIGHT);
    ctx.stroke();
    ctx.setLineDash([]);

    // ------------------------------------------------------------------------
    // Draw scores
    // ------------------------------------------------------------------------
    ctx.fillStyle = CONFIG.COLORS.score;
    ctx.font = 'bold 64px "Press Start 2P", monospace';
    ctx.textAlign = 'center';
    ctx.fillText(score1.toString(), CONFIG.WIDTH / 4, 80);
    ctx.fillText(score2.toString(), (CONFIG.WIDTH / 4) * 3, 80);

    // Draw player labels
    ctx.font = '14px sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.fillText(gameMode === 'ai' ? 'YOU' : 'P1', CONFIG.WIDTH / 4, 110);
    ctx.fillText(gameMode === 'ai' ? `AI (${aiDifficulty})` : 'P2', (CONFIG.WIDTH / 4) * 3, 110);

    // ------------------------------------------------------------------------
    // Draw paddles with glow effect
    // ------------------------------------------------------------------------

    // Paddle 1 (Pink)
    ctx.shadowColor = CONFIG.COLORS.paddle1;
    ctx.shadowBlur = 20;
    ctx.fillStyle = CONFIG.COLORS.paddle1;
    ctx.fillRect(
      CONFIG.PADDLE_MARGIN,
      paddle1Y,
      CONFIG.PADDLE_WIDTH,
      CONFIG.PADDLE_HEIGHT
    );

    // Paddle 2 (Purple)
    ctx.shadowColor = CONFIG.COLORS.paddle2;
    ctx.fillStyle = CONFIG.COLORS.paddle2;
    ctx.fillRect(
      CONFIG.WIDTH - CONFIG.PADDLE_MARGIN - CONFIG.PADDLE_WIDTH,
      paddle2Y,
      CONFIG.PADDLE_WIDTH,
      CONFIG.PADDLE_HEIGHT
    );

    // Reset shadow for ball
    ctx.shadowBlur = 0;

    // ------------------------------------------------------------------------
    // Draw ball with glow
    // ------------------------------------------------------------------------
    ctx.shadowColor = CONFIG.COLORS.ballGlow;
    ctx.shadowBlur = 25;
    ctx.fillStyle = CONFIG.COLORS.ball;
    ctx.beginPath();
    ctx.arc(ballX, ballY, CONFIG.BALL_SIZE / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // ------------------------------------------------------------------------
    // Draw countdown
    // ------------------------------------------------------------------------
    if (countdown > 0) {
      ctx.fillStyle = CONFIG.COLORS.text;
      ctx.font = 'bold 120px "Press Start 2P", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(countdown.toString(), CONFIG.WIDTH / 2, CONFIG.HEIGHT / 2);
    }

    // ------------------------------------------------------------------------
    // Draw "Press SPACE to start" message
    // ------------------------------------------------------------------------
    if (!gameRunning && !gameOver && countdown === 0) {
      ctx.fillStyle = CONFIG.COLORS.text;
      ctx.font = '20px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Press SPACE to start', CONFIG.WIDTH / 2, CONFIG.HEIGHT / 2);
    }

    // ------------------------------------------------------------------------
    // Draw pause message
    // ------------------------------------------------------------------------
    if (isPaused) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(0, 0, CONFIG.WIDTH, CONFIG.HEIGHT);
      ctx.fillStyle = CONFIG.COLORS.text;
      ctx.font = 'bold 48px "Press Start 2P", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('PAUSED', CONFIG.WIDTH / 2, CONFIG.HEIGHT / 2);
      ctx.font = '20px sans-serif';
      ctx.fillText('Press SPACE to resume', CONFIG.WIDTH / 2, CONFIG.HEIGHT / 2 + 60);
    }

    // ------------------------------------------------------------------------
    // Draw game over screen
    // ------------------------------------------------------------------------
    if (gameOver) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
      ctx.fillRect(0, 0, CONFIG.WIDTH, CONFIG.HEIGHT);

      ctx.fillStyle = CONFIG.COLORS.score;
      ctx.font = 'bold 48px "Press Start 2P", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(winner, CONFIG.WIDTH / 2, CONFIG.HEIGHT / 2 - 40);

      ctx.fillStyle = CONFIG.COLORS.text;
      ctx.font = '24px sans-serif';
      ctx.fillText('Press R to play again', CONFIG.WIDTH / 2, CONFIG.HEIGHT / 2 + 40);
    }
  }

  // ==========================================================================
  // GAME LOOP
  // ==========================================================================

  function gameLoop() {
    update();
    draw();
    animationId = requestAnimationFrame(gameLoop);
  }

  // ==========================================================================
  // LIFECYCLE
  // ==========================================================================

  onMount(() => {
    ctx = canvas.getContext('2d')!;

    // Add keyboard listeners
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // Start game loop
    gameLoop();
  });

  onDestroy(() => {
    // Cleanup
    window.removeEventListener('keydown', handleKeyDown);
    window.removeEventListener('keyup', handleKeyUp);
    cancelAnimationFrame(animationId);
  });

  // Reset game when mode changes
  $: if (gameMode || aiDifficulty) {
    if (canvas) resetGame();
  }
</script>

<!-- ============================================================================
     GAME CANVAS
     ============================================================================ -->
<div class="game-container">
  <canvas
    bind:this={canvas}
    width={CONFIG.WIDTH}
    height={CONFIG.HEIGHT}
    class="game-canvas"
  />

  <!-- Controls Help -->
  <div class="controls">
    <div class="player">
      <span class="player-name" style="color: {CONFIG.COLORS.paddle1}">
        {gameMode === 'ai' ? 'You' : 'Player 1'}
      </span>
      <span class="keys">W / S</span>
    </div>

    {#if gameMode === 'local'}
      <div class="divider">|</div>
      <div class="player">
        <span class="player-name" style="color: {CONFIG.COLORS.paddle2}">Player 2</span>
        <span class="keys">↑ / ↓</span>
      </div>
    {:else}
      <div class="divider">|</div>
      <div class="player">
        <span class="player-name" style="color: {CONFIG.COLORS.paddle2}">AI</span>
        <span class="keys">🤖 {aiDifficulty}</span>
      </div>
    {/if}

    <div class="divider">|</div>
    <div class="action">
      <span class="keys">SPACE</span>
      <span class="action-text">Start / Pause</span>
    </div>

    <div class="divider">|</div>
    <button class="quit-btn" on:click={quitGame}>
      ✕ Quit <span class="esc-hint">(ESC)</span>
    </button>
  </div>
</div>

<style>
  .game-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
  }

  .game-canvas {
    border-radius: 12px;
    box-shadow:
      0 0 30px rgba(255, 107, 157, 0.3),
      0 0 60px rgba(199, 125, 255, 0.2);
  }

  .controls {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    padding: 1rem 2rem;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 8px;
    font-size: 0.9rem;
  }

  .player {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
  }

  .player-name {
    font-weight: 600;
  }

  .keys {
    background: rgba(255, 255, 255, 0.1);
    padding: 0.25rem 0.75rem;
    border-radius: 4px;
    font-family: monospace;
    font-size: 0.85rem;
  }

  .divider {
    color: rgba(255, 255, 255, 0.2);
  }

  .action {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .action-text {
    color: rgba(255, 255, 255, 0.6);
  }

  .quit-btn {
    padding: 0.4rem 0.75rem;
    background: rgba(233, 69, 96, 0.2);
    border: 1px solid rgba(233, 69, 96, 0.4);
    border-radius: 6px;
    color: #e94560;
    font-weight: 500;
    font-size: 0.85rem;
    cursor: pointer;
    transition: all 0.2s;
  }

  .quit-btn:hover {
    background: rgba(233, 69, 96, 0.3);
    border-color: #e94560;
    transform: scale(1.05);
  }

  .esc-hint {
    opacity: 0.6;
    font-size: 0.75rem;
  }
</style>
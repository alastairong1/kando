<script>
  import { onMount } from 'svelte';
  import Board from './Board.svelte';
  import { fetchBoardState } from './api.js';

  let board = null;

  // Base URL for the board API endpoints. Set this to your gateway
  // domain plus the DNA hash and cell id you want to read from, ending
  // with `/content`.
  const BOARD_API_BASE = 'http://localhost:3001/mock-dna/mock-id/content';

  onMount(async () => {
    try {
      board = await fetchBoardState(BOARD_API_BASE);
    } catch (e) {
      console.error('Failed to load board', e);
    }
  });
</script>

{#if board}
  <h1>{board.name}</h1>
  <Board {board} />
{:else}
  <p>Loading board...</p>
{/if}

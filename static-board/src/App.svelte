<script>
  import { onMount } from 'svelte';
  import Board from './Board.svelte';
  import { fetchBoardState } from './api.js';

  let board = null;

  const params = new URLSearchParams(window.location.search);
  const gatewayDomain = params.get('gateway');
  const dnaHash = params.get('dna');
  const id = params.get('id');
  const config = gatewayDomain && dnaHash && id ? { gatewayDomain, dnaHash, id } : {};

  onMount(async () => {
    try {
      board = await fetchBoardState(config);
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

<script>
  import { onMount } from 'svelte';
  import Board from './Board.svelte';

  let board = null;
  let mockId = null;

  // Extract mock-id from URL path
  function getMockIdFromPath() {
    const path = window.location.pathname;
    const segments = path.split('/').filter(s => s.length > 0);
    return segments.length > 0 ? segments[0] : null;
  }

  // Mock board data
  function createMockBoard(boardId) {
    return {
      name: "Breakfast Factory",
      description: "A delicious breakfast production line",
      categories: [
        {
          id: "todo",
          name: "To Do",
          cards: [
            {
              id: "eggs",
              text: "Eggs"
            }
          ]
        },
        {
          id: "doing", 
          name: "Doing",
          cards: [
            {
              id: "pancakes",
              text: "Pancakes"
            }
          ]
        },
        {
          id: "done",
          name: "Done",
          cards: [
            {
              id: "sausages",
              text: "Sausages"
            }
          ]
        }
      ]
    };
  }

  onMount(() => {
    mockId = getMockIdFromPath();
    
    if (mockId === '683b697294a7e8893427f87e') {
      // Load mock board for the specific ID
      board = createMockBoard(mockId);
    } else {
      // Show a different message for other IDs
      board = {
        name: "Board Not Found",
        description: "This board ID does not exist in the demo",
        categories: []
      };
    }
  });
</script>

{#if board}
  <h1>{board.name}</h1>
  <Board {board} />
{:else}
  <p>Loading board...</p>
{/if}

<style>
  h1 {
    text-align: center;
    color: #333;
    margin: 1rem 0;
    font-family: Arial, sans-serif;
  }
</style>

<script>
  export let board;
</script>

<div class="board">
  {#if board.categories && board.categories.length > 0}
    {#each board.categories as category}
      <div class="column">
        <div class="column-title">
          {category.name}
        </div>
        {#each category.cards as card}
          <div class="card">
            <div class="card-title">{card.text}</div>
          </div>
        {/each}
      </div>
    {/each}
  {:else}
    <div class="empty-board">
      <p>No categories found in this board.</p>
    </div>
  {/if}
</div>

<style>
  .board {
    display: flex;
    gap: 1rem;
    padding: 1rem;
    max-width: 1200px;
    margin: 0 auto;
    overflow-x: auto;
  }

  .column {
    flex: 0 0 300px;
    background: #f8f9fa;
    border-radius: 8px;
    padding: 1rem;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }

  .column-title {
    color: #333;
    font-weight: bold;
    padding: 0.75rem 1rem;
    margin: -1rem -1rem 1rem -1rem;
    border-radius: 8px 8px 0 0;
    text-align: center;
    font-size: 1.1rem;
    background: #e9ecef;
    border-bottom: 2px solid #ddd;
  }

  .card {
    background: white;
    border-radius: 6px;
    padding: 1rem;
    margin-bottom: 0.75rem;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    border-left: 4px solid #ddd;
  }

  .card-title {
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: #333;
    font-size: 1rem;
  }


  .empty-board {
    text-align: center;
    color: #666;
    font-style: italic;
    padding: 2rem;
  }

  @media (max-width: 768px) {
    .board {
      flex-direction: column;
      padding: 0.5rem;
    }
    
    .column {
      flex: none;
      width: 100%;
    }
  }
</style>

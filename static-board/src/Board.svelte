<script>
  export let board;

  function cardsForGroup(groupId) {
    const ids = board.grouping[groupId] || [];
    return board.cards.filter(c => ids.includes(c.id));
  }
</script>

<div class="board">
  {#each board.groups as group}
    <div class="column">
      <div class="column-title">{group.name}</div>
      {#each cardsForGroup(group.id) as card}
        <div class="card">
          <div class="card-title">{card.props.title}</div>
          {#if card.props.description}
            <div class="card-description">{card.props.description}</div>
          {/if}
        </div>
      {/each}
    </div>
  {/each}
</div>

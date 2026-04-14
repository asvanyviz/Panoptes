<script lang="ts">
  export let title: string = 'Overview';
  export let subtitle: string = 'Nézet fejlesztés alatt.';
</script>

<div class="placeholder-view">
  <h2>{title}</h2>
  <p class="placeholder-text">{subtitle}</p>
</div>

<style>
  .placeholder-view {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 300px;
    gap: 12px;
  }
  .placeholder-view h2 {
    font-size: 18px;
    margin: 0;
  }
  .placeholder-text {
    color: var(--fg-dim);
    font-size: 14px;
  }
</style>

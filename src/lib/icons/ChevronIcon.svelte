<script lang="ts">
  // SVG chevron icon for collapse/expand
  let expanded = $state(false);
</script>

<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
     class="chevron" class:expanded>
  <polyline points="6 9 12 15 18 9" />
</svg>

<style>
  .chevron {
    width: 16px;
    height: 16px;
    transition: transform 0.2s ease;
    flex-shrink: 0;
  }
  .chevron.expanded {
    transform: rotate(180deg);
  }
</style>

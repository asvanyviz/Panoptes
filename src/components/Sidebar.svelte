<script lang="ts">
  import HomeIcon from '../lib/icons/HomeIcon.svelte';
  import DashboardIcon from '../lib/icons/DashboardIcon.svelte';
  import SettingsIcon from '../lib/icons/SettingsIcon.svelte';
  import MonitorIcon from '../lib/icons/MonitorIcon.svelte';

  type ViewName = 'overview' | 'dashboard' | 'system' | 'settings';

  let { currentView = $bindable('overview') }: { currentView: ViewName } = $props();

  interface NavItem {
    id: ViewName;
    label: string;
    icon: typeof HomeIcon;
  }

  const items: NavItem[] = [
    { id: 'overview', label: 'Overview', icon: HomeIcon },
    { id: 'dashboard', label: 'Dashboard', icon: DashboardIcon },
    { id: 'system', label: 'Rendszer', icon: MonitorIcon },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ];

  function select(id: ViewName) {
    currentView = id;
  }
</script>

<nav class="sidebar-nav">
  {#each items as item}
    <button
      class="nav-item"
      class:active={currentView === item.id}
      onclick={() => select(item.id)}
    >
      <item.icon />
      <span>{item.label}</span>
    </button>
  {/each}
</nav>

<style>
  .sidebar-nav {
    display: flex;
    flex-direction: column;
    padding: 8px 0;
  }

  .nav-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 16px;
    color: var(--fg-dim);
    cursor: pointer;
    transition: color 0.15s, background 0.15s;
    border: none;
    background: none;
    font: inherit;
    font-size: 14px;
    width: 100%;
    border-left: 3px solid transparent;
  }

  .nav-item:hover {
    color: var(--fg);
    background: var(--bg-elevated);
  }

  .nav-item.active {
    color: var(--accent);
    background: var(--bg-elevated);
    border-left-color: var(--accent);
  }

  .nav-item :global(svg) {
    width: 18px;
    height: 18px;
    flex-shrink: 0;
  }
</style>
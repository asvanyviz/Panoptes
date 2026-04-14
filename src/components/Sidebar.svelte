<script lang="ts">
  import HomeIcon from '../lib/icons/HomeIcon.svelte';
  import DashboardIcon from '../lib/icons/DashboardIcon.svelte';
  import MonitorIcon from '../lib/icons/MonitorIcon.svelte';
  import UsersIcon from '../lib/icons/UsersIcon.svelte';
  import BrainIcon from '../lib/icons/BrainIcon.svelte';
  import SessionsIcon from '../lib/icons/SessionsIcon.svelte';
  import SettingsIcon from '../lib/icons/SettingsIcon.svelte';
  import ChevronIcon from '../lib/icons/ChevronIcon.svelte';

  export type ViewName =
    | 'overview'
    | 'dashboard'
    | 'system'
    | 'agents'
    | 'memory'
    | 'memory-health'
    | 'memory-insights'
    | 'memory-learnings'
    | 'sessions'
    | 'settings';

  let { currentView = $bindable('overview') }: { currentView: ViewName } = $props();

  interface LeafItem {
    type: 'leaf';
    id: ViewName;
    label: string;
  }

  interface GroupItem {
    type: 'group';
    label: string;
    children: LeafItem[];
  }

  type NavEntry = LeafItem | GroupItem;

  const navItems: NavEntry[] = [
    {
      type: 'group',
      label: 'Megfigyelés',
      children: [
        { type: 'leaf', id: 'overview', label: 'Overview' },
        { type: 'leaf', id: 'dashboard', label: 'Dashboard' },
      ],
    },
    {
      type: 'group',
      label: 'Infrastruktúra',
      children: [
        { type: 'leaf', id: 'system', label: 'Rendszer' },
        { type: 'leaf', id: 'agents', label: 'Agentek' },
      ],
    },
    {
      type: 'group',
      label: 'Memória',
      children: [
        { type: 'leaf', id: 'memory-health', label: 'Health' },
        { type: 'leaf', id: 'memory-insights', label: 'Insights' },
        { type: 'leaf', id: 'memory-learnings', label: 'Learnings' },
      ],
    },
    {
      type: 'group',
      label: 'Kommunikáció',
      children: [
        { type: 'leaf', id: 'sessions', label: 'Sessions' },
      ],
    },
    {
      type: 'group',
      label: 'Egyéb',
      children: [
        { type: 'leaf', id: 'settings', label: 'Settings' },
      ],
    },
  ];

  // Track which groups are expanded
  let expandedGroups: Set<string> = $state(new Set(['Megfigyelés', 'Infrastruktúra']));

  function toggleGroup(label: string) {
    if (expandedGroups.has(label)) {
      expandedGroups.delete(label);
    } else {
      expandedGroups.add(label);
    }
    expandedGroups = new Set(expandedGroups);
  }

  function isGroupExpanded(label: string): boolean {
    return expandedGroups.has(label);
  }

  function select(id: ViewName) {
    currentView = id;
  }

  // Map memory sub-views to parent group auto-expand
  $effect(() => {
    const cv = currentView;
    if (cv.startsWith('memory-')) {
      if (!expandedGroups.has('Memória')) {
        expandedGroups.add('Memória');
        expandedGroups = new Set(expandedGroups);
      }
    }
  });

  function getIcon(id: ViewName) {
    switch (id) {
      case 'overview': return HomeIcon;
      case 'dashboard': return DashboardIcon;
      case 'system': return MonitorIcon;
      case 'agents': return UsersIcon;
      case 'memory':
      case 'memory-health':
      case 'memory-insights':
      case 'memory-learnings': return BrainIcon;
      case 'sessions': return SessionsIcon;
      case 'settings': return SettingsIcon;
      default: return HomeIcon;
    }
  }

  function isActive(id: ViewName): boolean {
    if (currentView === id) return true;
    // Memory group: if any memory-* is active, highlight memory-health as default
    if (id === 'memory-health' && currentView.startsWith('memory-')) return true;
    return false;
  }

  function getActiveMemoryView(): ViewName {
    if (currentView === 'memory' || currentView.startsWith('memory-')) {
      return currentView;
    }
    return 'memory-health';
  }
</script>

<nav class="sidebar-nav">
  {#each navItems as group (group.label)}
    <div class="nav-group">
      <button class="nav-group-header" onclick={() => toggleGroup(group.label)}>
        <span class="group-label">{group.label}</span>
        <ChevronIcon />
      </button>

      {#if isGroupExpanded(group.label) && group.type === 'group'}
        <div class="nav-group-children">
          {#each group.children as child}
            <button
              class="nav-item"
              class:active={isActive(child.id)}
              onclick={() => select(child.id)}
            >
              {#if child.id.startsWith('memory-')}
                <span class="leaf-icon dot"></span>
              {:else}
                <svelte:component this={getIcon(child.id)} />
              {/if}
              <span>{child.label}</span>
            </button>
          {/each}
        </div>
      {/if}
    </div>
  {/each}
</nav>

<style>
  .sidebar-nav {
    display: flex;
    flex-direction: column;
    padding: 8px 0;
  }

  .nav-group {
    margin-bottom: 4px;
  }

  .nav-group-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 6px 16px;
    color: var(--fg-dim);
    cursor: pointer;
    transition: color 0.15s, background 0.15s;
    border: none;
    background: none;
    font: inherit;
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    width: 100%;
  }

  .nav-group-header:hover {
    color: var(--fg);
    background: var(--bg-elevated);
  }

  .nav-group-children {
    display: flex;
    flex-direction: column;
  }

  .nav-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 16px 8px 20px;
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

  .leaf-icon.dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--fg-dim);
    flex-shrink: 0;
    margin-left: 6px;
  }

  .nav-item.active .leaf-icon.dot {
    background: var(--accent);
  }
</style>

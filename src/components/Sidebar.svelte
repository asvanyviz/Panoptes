<script lang="ts">
  import ChevronIcon from '../lib/icons/ChevronIcon.svelte';

  export type ViewName =
    // Rendszer
    | 'rendszer-attekintes'
    | 'rendszer-problemak'
    // Infrastruktúra
    | 'infra-cron'
    | 'infra-heartbeat'
    | 'infra-memory'
    | 'infra-pszichologia'
    | 'infra-security'
    | 'infra-sessions'
    | 'infra-tokenhasznalat'
    // Agentek
    | 'agent-live'
    | 'agent-vegrehajtok'
    | 'agent-tanacsadok'
    | 'agent-specialistak'
    // Jelentések
    | 'jelentes-bejelentesek'
    | 'jelentes-eszkalaciok'
    | 'jelentes-napi'
    | 'jelentes-heti'
    | 'jelentes-havi';

  let { currentView = $bindable('rendszer-attekintes') }: { currentView: ViewName } = $props();

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
      label: 'Rendszer',
      children: [
        { type: 'leaf', id: 'rendszer-attekintes', label: 'Áttekintés' },
        { type: 'leaf', id: 'rendszer-problemak', label: 'Problémák' },
      ],
    },
    {
      type: 'group',
      label: 'Infrastruktúra',
      children: [
        { type: 'leaf', id: 'infra-cron', label: 'Cron jobs' },
        { type: 'leaf', id: 'infra-heartbeat', label: 'Heartbeat' },
        { type: 'leaf', id: 'infra-memory', label: 'Memória' },
        { type: 'leaf', id: 'infra-pszichologia', label: 'Pszichológia' },
        { type: 'leaf', id: 'infra-security', label: 'Security' },
        { type: 'leaf', id: 'infra-sessions', label: 'Sessions' },
        { type: 'leaf', id: 'infra-tokenhasznalat', label: 'Tokenhasználat' },
      ],
    },
    {
      type: 'group',
      label: 'Agentek',
      children: [
        { type: 'leaf', id: 'agent-live', label: 'Live' },
        { type: 'leaf', id: 'agent-vegrehajtok', label: 'Végrehajtók' },
        { type: 'leaf', id: 'agent-tanacsadok', label: 'Tanácsadók' },
        { type: 'leaf', id: 'agent-specialistak', label: 'Specialisták' },
      ],
    },
    {
      type: 'group',
      label: 'Jelentések',
      children: [
        { type: 'leaf', id: 'jelentes-bejelentesek', label: 'Bejelentések' },
        { type: 'leaf', id: 'jelentes-eszkalaciok', label: 'Eszkalációk' },
        { type: 'leaf', id: 'jelentes-napi', label: 'Napi jelentések' },
        { type: 'leaf', id: 'jelentes-heti', label: 'Heti jelentések' },
        { type: 'leaf', id: 'jelentes-havi', label: 'Havi jelentések' },
      ],
    },
  ];

  // Track which groups are expanded (first group open by default)
  let expandedGroups: Set<string> = $state(new Set(['Rendszer']));

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

  // Auto-expand the group that contains the current view
  $effect(() => {
    const cv = currentView;
    for (const group of navItems) {
      if (group.type === 'group') {
        for (const child of group.children) {
          if (child.id === cv) {
            if (!expandedGroups.has(group.label)) {
              expandedGroups.add(group.label);
              expandedGroups = new Set(expandedGroups);
            }
          }
        }
      }
    }
  });
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
              class:active={currentView === child.id}
              onclick={() => select(child.id)}
            >
              <span class="leaf-icon dot"></span>
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
    padding: 8px 16px;
    color: var(--fg-dim);
    cursor: pointer;
    transition: color 0.15s, background 0.15s;
    border: none;
    background: none;
    font: inherit;
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.6px;
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
    padding: 7px 16px 7px 24px;
    color: var(--fg-dim);
    cursor: pointer;
    transition: color 0.15s, background 0.15s;
    border: none;
    background: none;
    font: inherit;
    font-size: 13px;
    width: 100%;
    border-left: 3px solid transparent;
    text-align: left;
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

  .leaf-icon.dot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: var(--fg-dim);
    flex-shrink: 0;
  }

  .nav-item.active .leaf-icon.dot {
    background: var(--accent);
  }
</style>

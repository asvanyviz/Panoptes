<script lang="ts">
  import './app.css';
  import Sidebar from './components/Sidebar.svelte';
  import ActivityLog from './components/ActivityLog.svelte';
  import System from './views/System.svelte';
  import Agents from './views/Agents.svelte';
  import Memory from './views/Memory.svelte';
  import Sessions from './views/Sessions.svelte';

  type ViewName = 'overview' | 'dashboard' | 'system' | 'agents' | 'memory' | 'memory-health' | 'memory-insights' | 'memory-learnings' | 'sessions' | 'settings';

  let currentView: ViewName = $state('overview');

  function getActiveMemoryTab(): 'health' | 'insights' | 'learnings' {
    if (currentView === 'memory-insights') return 'insights';
    if (currentView === 'memory-learnings') return 'learnings';
    return 'health';
  }
</script>

<div class="dashboard">
  <header class="dashboard-header">
    <span>Panoptes</span>
  </header>

  <aside class="dashboard-sidebar">
    <Sidebar bind:currentView />
  </aside>

  <main class="dashboard-main">
    {#if currentView === 'overview'}
      <h1>Overview</h1>
      <p>Welcome to Panoptes — system monitoring & control.</p>
    {:else if currentView === 'dashboard'}
      <h1>Dashboard</h1>
      <p>Agent dashboard — all agents at a glance.</p>
    {:else if currentView === 'system'}
      <System />
    {:else if currentView === 'agents'}
      <Agents />
    {:else if currentView === 'memory' || currentView === 'memory-health' || currentView === 'memory-insights' || currentView === 'memory-learnings'}
      <Memory activeTab={getActiveMemoryTab()} />
    {:else if currentView === 'sessions'}
      <Sessions />
    {:else if currentView === 'settings'}
      <h1>Settings</h1>
      <p>Settings — coming soon.</p>
    {/if}
  </main>

  <aside class="dashboard-log">
    <ActivityLog />
  </aside>
</div>
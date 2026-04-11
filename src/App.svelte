<script lang="ts">
  import './app.css';
  import Sidebar from './components/Sidebar.svelte';
  import ActivityLog from './components/ActivityLog.svelte';
</script>

<div class="dashboard">
  <header class="dashboard-header">
    <span>Panoptes</span>
  </header>

  <aside class="dashboard-sidebar">
    <Sidebar />
  </aside>

  <main class="dashboard-main">
    <h1>Overview</h1>
    <p>Welcome to Panoptes — system monitoring &amp; control.</p>
  </main>

  <aside class="dashboard-log">
    <ActivityLog />
  </aside>
</div>

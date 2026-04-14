<script lang="ts">
  import './app.css';
  import Sidebar from './components/Sidebar.svelte';
  import ActivityLog from './components/ActivityLog.svelte';
  // Rendszer
  import Attekintes from './views/Attekintes.svelte';
  import Problemak from './views/Problemak.svelte';
  // Infrastruktúra
  import InfraCron from './views/InfraCron.svelte';
  import InfraHeartbeat from './views/InfraHeartbeat.svelte';
  import InfraPszichologia from './views/InfraPszichologia.svelte';
  import InfraSecurity from './views/InfraSecurity.svelte';
  import InfraToken from './views/InfraToken.svelte';
  // Agentek
  import AgentLive from './views/AgentLive.svelte';
  import AgentVegrehajtok from './views/AgentVegrehajtok.svelte';
  import AgentTanacsadok from './views/AgentTanacsadok.svelte';
  import AgentSpecialistak from './views/AgentSpecialistak.svelte';
  // Jelentések
  import JelentesBejelentesek from './views/JelentesBejelentesek.svelte';
  import JelentesEszkalaciok from './views/JelentesEszkalaciok.svelte';
  import JelentesNapi from './views/JelentesNapi.svelte';
  import JelentesHeti from './views/JelentesHeti.svelte';
  import JelentesHavi from './views/JelentesHavi.svelte';

  type ViewName =
    | 'rendszer-attekintes'
    | 'rendszer-problemak'
    | 'infra-cron'
    | 'infra-heartbeat'
    | 'infra-memory'
    | 'infra-pszichologia'
    | 'infra-security'
    | 'infra-sessions'
    | 'infra-tokenhasznalat'
    | 'agent-live'
    | 'agent-vegrehajtok'
    | 'agent-tanacsadok'
    | 'agent-specialistak'
    | 'jelentes-bejelentesek'
    | 'jelentes-eszkalaciok'
    | 'jelentes-napi'
    | 'jelentes-heti'
    | 'jelentes-havi';

  let currentView: ViewName = $state('rendszer-attekintes');
</script>

<div class="dashboard">
  <header class="dashboard-header">
    <span>Panoptes</span>
  </header>

  <aside class="dashboard-sidebar">
    <Sidebar bind:currentView />
  </aside>

  <main class="dashboard-main">
    {#if currentView === 'rendszer-attekintes'}
      <Attekintes />
    {:else if currentView === 'rendszer-problemak'}
      <Problemak />
    {:else if currentView === 'infra-cron'}
      <InfraCron />
    {:else if currentView === 'infra-heartbeat'}
      <InfraHeartbeat />
    {:else if currentView === 'infra-memory'}
      <InfraPszichologia />
    {:else if currentView === 'infra-pszichologia'}
      <InfraPszichologia />
    {:else if currentView === 'infra-security'}
      <InfraSecurity />
    {:else if currentView === 'infra-sessions'}
      <InfraPszichologia />
    {:else if currentView === 'infra-tokenhasznalat'}
      <InfraToken />
    {:else if currentView === 'agent-live'}
      <AgentLive />
    {:else if currentView === 'agent-vegrehajtok'}
      <AgentVegrehajtok />
    {:else if currentView === 'agent-tanacsadok'}
      <AgentTanacsadok />
    {:else if currentView === 'agent-specialistak'}
      <AgentSpecialistak />
    {:else if currentView === 'jelentes-bejelentesek'}
      <JelentesBejelentesek />
    {:else if currentView === 'jelentes-eszkalaciok'}
      <JelentesEszkalaciok />
    {:else if currentView === 'jelentes-napi'}
      <JelentesNapi />
    {:else if currentView === 'jelentes-heti'}
      <JelentesHeti />
    {:else if currentView === 'jelentes-havi'}
      <JelentesHavi />
    {/if}
  </main>

  <aside class="dashboard-log">
    <ActivityLog />
  </aside>
</div>

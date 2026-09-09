<script lang="ts">
  import { onMount } from 'svelte';
  import { Sun, Moon } from '@lucide/svelte';

  let theme = $state<'dark' | 'light'>('dark');
  const label = $derived(theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');

  function applyTheme() {
    document.documentElement.dataset.theme = theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'light' ? '#edf1e7' : '#161916');
  }

  function toggleTheme() {
    theme = theme === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem('metrone-theme', theme); } catch { /* Storage can be disabled. */ }
    applyTheme();
  }

  onMount(() => {
    try {
      const stored = localStorage.getItem('metrone-theme');
      if (stored === 'dark' || stored === 'light') theme = stored;
      // Migrate the former System option to the current device appearance.
      else if (stored === 'system') theme = matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    } catch { /* Keep the default theme when storage is unavailable. */ }
    applyTheme();
  });
</script>

<button class="theme-toggle" type="button" aria-label={label} title={label} onclick={toggleTheme}>
  {#if theme === 'dark'}<Sun size={21} strokeWidth={2} aria-hidden="true" />{:else}<Moon size={21} strokeWidth={2} aria-hidden="true" />{/if}
</button>

<style>
  .theme-toggle { width: 44px; height: 44px; display: grid; place-items: center; border: 1px solid var(--control-border); border-radius: 50%; background: var(--surface); color: var(--ink); }
  .theme-toggle:hover { background: var(--hover); }
  .theme-toggle:focus-visible { outline: 2px solid var(--accent); outline-offset: 4px; }
</style>

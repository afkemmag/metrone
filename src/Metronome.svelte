<script lang="ts">
  import { onMount } from 'svelte';
  import { animate } from 'animejs';

  let { beat, duration }: { beat: number; duration: number } = $props();
  let pendulum: HTMLDivElement;
  let reducedMotion = $state(true);

  onMount(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => { reducedMotion = preference.matches; };
    update();
    preference.addEventListener('change', update);
    return () => preference.removeEventListener('change', update);
  });

  // Each audio-scheduled beat starts one swing: no independent looping clock.
  $effect(() => {
    const currentBeat = beat;
    const interval = duration;
    const reduce = reducedMotion;
    if (!pendulum) return;
    const animation = animate(pendulum, {
      rotate: reduce || currentBeat < 0 ? 0 : currentBeat % 2 === 0 ? 28 : -28,
      duration: reduce ? 0 : currentBeat < 0 ? 180 : interval,
      ease: 'inOutSine',
    });
    return () => { animation.cancel(); };
  });
</script>

<div class="metronome-visual" aria-hidden="true" data-beat-duration={duration} data-reduced-motion={reducedMotion}>
  <div class="housing"></div>
  <div class="scale"><i></i><i></i><i></i><i></i><i></i></div>
  <div class="pendulum" bind:this={pendulum}><span class="weight"></span></div>
  <div class="pivot"></div>
  <div class="base"></div>
</div>

<style>
  .metronome-visual {
    position: relative;
    width: 150px;
    height: 100px;
    margin: 20px auto 0;
  }
  .housing {
    position: absolute;
    inset: 4px 27px 8px;
    background: var(--line);
    clip-path: polygon(36% 0, 64% 0, 100% 100%, 0 100%);
    border-radius: 5px;
  }
  .housing::after {
    content: '';
    position: absolute;
    inset: 2px;
    background: #20251f;
    clip-path: polygon(36% 0, 64% 0, 100% 100%, 0 100%);
  }
  .scale {
    position: absolute;
    top: 18px;
    left: 65px;
    display: grid;
    gap: 8px;
    width: 20px;
  }
  .scale i { height: 1px; background: var(--muted); opacity: .5; }
  .pendulum {
    position: absolute;
    left: 73px;
    bottom: 18px;
    width: 4px;
    height: 80px;
    border-radius: 3px;
    background: var(--accent);
    transform-origin: 50% 100%;
    will-change: transform;
  }
  .weight {
    position: absolute;
    left: -6px;
    top: 18px;
    width: 16px;
    height: 20px;
    background: var(--accent);
    border: 3px solid #20251f;
    outline: 1px solid var(--accent);
    border-radius: 3px;
  }
  .pivot {
    position: absolute;
    left: 69px;
    bottom: 12px;
    width: 12px;
    height: 12px;
    border: 3px solid var(--accent);
    border-radius: 50%;
    background: #20251f;
  }
  .base {
    position: absolute;
    bottom: 3px;
    left: 24px;
    right: 24px;
    height: 5px;
    background: var(--muted);
    border-radius: 3px;
  }
</style>

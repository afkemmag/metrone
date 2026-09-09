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

<div class="metronome-visual metronome-3d" aria-hidden="true" data-beat-duration={duration} data-reduced-motion={reducedMotion}>
  <div class="floor-shadow"></div>
  <div class="metronome-body">
    <div class="body-face front"><div class="dial"><span>40</span><span>60</span><span>80</span><span>120</span><span>160</span><span>208</span></div><span class="badge">METRONE</span></div>
    <div class="body-face back"></div>
    <div class="body-face left"></div>
    <div class="body-face right"></div>
    <div class="body-face top"></div>
    <div class="body-face bottom"></div>
    <div class="plinth"></div>
    <div class="winding-key"><span></span></div>
    <div class="mechanism">
      <div class="pendulum" bind:this={pendulum}>
        <div class="rod"></div>
        <div class="weight"><span class="weight-front"></span><span class="weight-side"></span><span class="weight-top"></span></div>
      </div>
      <div class="pivot"></div>
    </div>
  </div>
</div>

<style>
  .metronome-3d {
    --wood-light: #637055;
    --wood: #35412e;
    --wood-dark: #20271d;
    --brass: var(--accent);
    --ivory: #e6eadd;
    position: relative;
    width: 180px;
    height: 120px;
    margin: 20px auto 0;
    perspective: 650px;
    perspective-origin: 50% 35%;
  }
  .floor-shadow { position: absolute; width: 108px; height: 20px; left: 39px; bottom: 0; border-radius: 50%; background: #0006; filter: blur(7px); }
  .metronome-body {
    position: absolute;
    width: 82px;
    height: 96px;
    left: 49px;
    top: 6px;
    transform-style: preserve-3d;
    transform: rotateX(-10deg) rotateY(-25deg);
  }
  .body-face { position: absolute; backface-visibility: hidden; }
  .front, .back {
    width: 82px;
    height: 96px;
    clip-path: polygon(29px 0, 53px 0, 100% 100%, 0 100%);
    background: repeating-linear-gradient(87deg, #d0ef8610 0 1px, transparent 1px 5px), linear-gradient(100deg, var(--wood-light), var(--wood) 55%, var(--wood-dark));
  }
  .front { transform: translateZ(22px); }
  .front::before {
    content: '';
    position: absolute;
    inset: 3px 5px 16px;
    clip-path: polygon(36% 0, 64% 0, 100% 100%, 0 100%);
    background: linear-gradient(100deg, #161916, #303b2b 50%, #182014);
  }
  .back { transform: rotateY(180deg) translateZ(22px); }
  /* Sloped sides meet the 24px crown and 82px base without flattening the scene. */
  .left, .right {
    width: 44px;
    height: 100.2846px;
    top: 0;
    transform-origin: 50% 0;
    background: repeating-linear-gradient(92deg, #d0ef8614 0 1px, transparent 1px 4px), linear-gradient(90deg, var(--wood-dark), var(--wood));
    border: 1px solid #66715b;
  }
  .left { left: 7px; transform: rotateZ(16.8087deg) rotateY(-90deg); }
  .right { left: 31px; transform: rotateZ(-16.8087deg) rotateY(90deg); }
  .top { width: 24px; height: 44px; left: 29px; top: -22px; transform: rotateX(90deg); background: var(--wood-light); border: 1px solid #879776; }
  .bottom { width: 82px; height: 44px; top: 74px; transform: rotateX(-90deg); background: var(--wood-dark); }
  .dial {
    position: absolute;
    top: 8px;
    left: 29px;
    width: 24px;
    padding: 3px 4px;
    display: grid;
    gap: 2px;
    background: var(--ivory);
    border: 1px solid var(--brass);
    box-shadow: 0 1px 3px #0008;
  }
  .dial span { color: #283322; font-family: Georgia, serif; font-size: 5px; line-height: 6px; border-bottom: 1px solid #78866c; }
  .badge { position: absolute; bottom: 5px; left: 26px; color: var(--ivory); font-family: Georgia, serif; font-size: 5px; letter-spacing: .8px; }
  .plinth { position: absolute; left: -4px; top: 94px; width: 90px; height: 7px; transform: translateZ(24px); background: linear-gradient(var(--wood-light), var(--wood-dark)); border-top: 1px solid #a2b890; box-shadow: 0 3px 0 #161916; }
  .winding-key { position: absolute; right: -10px; top: 75px; width: 17px; height: 4px; transform: translateZ(3px); background: linear-gradient(var(--ivory), var(--brass), #718357); }
  .winding-key span { position: absolute; right: -2px; top: -5px; width: 7px; height: 14px; border: 2px solid var(--brass); border-radius: 4px; box-shadow: 1px 0 0 #effbdc; }
  .mechanism { position: absolute; inset: 0; transform: translateZ(29px); transform-style: preserve-3d; }
  .pendulum { position: absolute; width: 3px; height: 84px; left: 39.5px; bottom: 16px; transform-origin: 50% 100%; transform-style: preserve-3d; will-change: transform; }
  .rod { position: absolute; inset: 0; border-radius: 2px; background: linear-gradient(90deg, #77846a, #edf8da, #a2b890); box-shadow: 1px 1px 0 #5e6c51; }
  .weight { position: absolute; left: -6.5px; top: 19px; width: 16px; height: 19px; transform-style: preserve-3d; }
  .weight-front { position: absolute; inset: 0; transform: translateZ(4px); background: linear-gradient(110deg, #e8fac9, var(--brass) 45%, #91aa64); border: 1px solid #effbdc; border-radius: 2px; box-shadow: inset 0 -3px 0 #71835740; }
  .weight-side { position: absolute; width: 8px; height: 19px; left: 4px; transform: rotateY(90deg) translateZ(8px); background: #8da663; }
  .weight-top { position: absolute; width: 16px; height: 8px; top: 5.5px; transform: rotateX(90deg) translateZ(9.5px); background: #effbdc; }
  .pivot { position: absolute; width: 11px; height: 11px; left: 35.5px; bottom: 10.5px; transform: translateZ(5px); border: 3px solid var(--brass); border-radius: 50%; background: #39472c; box-shadow: 1px 1px 0 #d0ef86; }
</style>

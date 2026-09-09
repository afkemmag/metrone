<script lang="ts">
  import { onDestroy } from 'svelte';
  import Metronome3D from './Metronome3D.svelte';
  import ThemeSwitcher from './ThemeSwitcher.svelte';

  let tempo = $state(120);
  let playing = $state(false);
  let activeBeat = $state(-1);
  let beatDuration = $state(500);
  let error = $state('');
  let context: AudioContext | undefined;
  let timer: ReturnType<typeof setInterval> | undefined;
  let nextTime = 0;
  let beat = 0;
  let generation = 0;
  const visualTimers = new Set<ReturnType<typeof setTimeout>>();

  function setTempo(value: number) {
    tempo = Number.isFinite(value) ? Math.min(240, Math.max(30, Math.round(value))) : 120;
  }

  function stop() {
    generation++;
    playing = false;
    activeBeat = -1;
    clearInterval(timer);
    visualTimers.forEach(clearTimeout);
    visualTimers.clear();
    if (context) void context.close().catch(() => {});
    context = undefined;
  }

  function schedule() {
    if (!context || !playing) return;
    while (nextTime < context.currentTime + 0.1) {
      const oscillator = context.createOscillator();
      const envelope = context.createGain();
      oscillator.frequency.value = beat === 0 ? 1100 : 750;
      envelope.gain.setValueAtTime(0, nextTime);
      envelope.gain.linearRampToValueAtTime(0.3, nextTime + 0.002);
      envelope.gain.exponentialRampToValueAtTime(0.001, nextTime + 0.045);
      oscillator.connect(envelope);
      envelope.connect(context.destination);
      oscillator.start(nextTime);
      oscillator.stop(nextTime + 0.05);
      oscillator.onended = () => { oscillator.disconnect(); envelope.disconnect(); };
      const currentBeat = beat;
      const duration = 60000 / tempo;
      const visualTimer = setTimeout(() => {
        beatDuration = duration;
        activeBeat = currentBeat;
        visualTimers.delete(visualTimer);
      }, Math.max(0, (nextTime - context.currentTime) * 1000));
      visualTimers.add(visualTimer);
      nextTime += 60 / tempo;
      beat = (beat + 1) % 4;
    }
  }

  async function toggle() {
    if (playing) { stop(); return; }
    const currentGeneration = ++generation;
    error = '';
    try {
      context ??= new AudioContext();
      await context.resume();
      if (currentGeneration !== generation || !context) return;
      playing = true;
      beat = 0;
      nextTime = context.currentTime + 0.03;
      schedule();
      clearInterval(timer);
      timer = setInterval(schedule, 25);
    } catch {
      stop();
      error = 'Audio could not start. Check your browser’s audio permissions and try again.';
    }
  }

  onDestroy(stop);
</script>

<svelte:head><meta name="description" content="A simple, focused metronome. Set your tempo and find your rhythm." /></svelte:head>

<div class="shell">
  <header>
    <a class="brand" href="./" aria-label="Metrone home"><span class="brand-mark" aria-hidden="true">/ /</span> metrone<span class="brand-dot">.</span></a>
    <div class="header-actions"><span class="header-note">A little structure. A lot of flow.</span><ThemeSwitcher /></div>
  </header>

  <main>


    <section class="instrument" aria-label="Metronome">
      <div class="instrument-top"><span class="eyebrow">METRONOME</span><span class="status"><span class:running={playing}></span>{playing ? 'Playing' : 'Ready when you are'}</span></div>
      <Metronome3D beat={activeBeat} duration={beatDuration} />
      <div class="tempo-control">
        <button class="step" aria-label="Decrease tempo" disabled={tempo <= 30} onclick={() => setTempo(tempo - 1)}>−</button>
        <div class="tempo-value"><input id="tempo" aria-label="Tempo" type="number" min="30" max="240" value={tempo} onchange={(event) => setTempo(event.currentTarget.valueAsNumber)} /><label for="tempo">BEATS PER MINUTE</label></div>
        <button class="step" aria-label="Increase tempo" disabled={tempo >= 240} onclick={() => setTempo(tempo + 1)}>+</button>
      </div>
      <div class="slider-wrap"><input class="tempo-slider" aria-label="Tempo slider" type="range" min="30" max="240" value={tempo} oninput={(event) => setTempo(event.currentTarget.valueAsNumber)} /><div class="range-labels"><span>30 BPM</span><span>240 BPM</span></div></div>
      <div class="rhythm"><span>Time signature <strong>4 / 4</strong></span><span>Quarter notes</span></div>
      <div class="beats" aria-label="Four beat measure">{#each [0, 1, 2, 3] as index}<div class="beat" class:active={activeBeat === index}><span>{index + 1}</span></div>{/each}</div>
      <button class="play" class:playing onclick={toggle} aria-label={playing ? 'Stop metronome' : 'Start metronome'}><span aria-hidden="true">{playing ? '■' : '▶'}</span>{playing ? 'Stop metronome' : 'Start metronome'}</button>
      {#if error}<p class="error" role="alert">{error}</p>{/if}
      <p class="hint">First beat accented. Every beat counts.</p>
    </section>
    <p class="practice-note">Start slow. Stay steady. Make it yours.</p>
  </main>
  <footer><span>Made for the practice, not the performance.</span><span>NO NOISE. JUST TIME.</span></footer>
</div>

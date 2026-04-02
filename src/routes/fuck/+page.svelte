<script>
  import { onMount } from "svelte";

  let percent = $state(25);
  let pAmount = $state(360);
  let pSize = $state(2);
  let hueOffset = $state(0);
  let menuOpen = $state(true);


  let canvas;
  let ctx;
  let size = $state({ w: 0, h: 0 });

  const cx = $derived(size.w / 2);
  const cy = $derived(size.h / 2);

  function toRadians(deg) {
    return deg * (Math.PI / 180);
  }

  function resize() {
    size = {
      w: window.innerWidth,
      h: window.innerHeight
    };

    const dpr = window.devicePixelRatio || 1;

    canvas.width = size.w * dpr;
    canvas.height = size.h * dpr;

    canvas.style.width = size.w + "px";
    canvas.style.height = size.h + "px";

    ctx.scale(dpr, dpr);

    draw();
  }

  let animationFrameId;

  function draw() {
    if (!ctx) return;

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, size.w, size.h);
    const scale = percent / 100;
    const maxRadiusX = Math.max(0, cx - pSize / 2);
    const maxRadiusY = Math.max(0, cy - pSize / 2);

    for (let i = 0; i < pAmount; i++) {
      const angleDeg = (i / pAmount) * 360;
      const angle = toRadians(angleDeg);
      const hue = (angleDeg + hueOffset) % 360;

      const x = cx + Math.cos(angle) * scale * maxRadiusX;
      const y = cy + Math.sin(angle) * scale * maxRadiusY;

      ctx.fillStyle = `hsl(${(hue + 360) % 360}deg,50%,50%)`;
      ctx.fillRect(x - pSize / 2, y - pSize / 2, pSize, pSize);
    }
  }

  function animateHue() {
    hueOffset = (hueOffset + 1) % 360;
    animationFrameId = requestAnimationFrame(animateHue);
  }

  function startHueAnimation() {
    if (!animationFrameId) {
      animationFrameId = requestAnimationFrame(animateHue);
    }
  }

  function stopHueAnimation() {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
  }

  onMount(() => {
    ctx = canvas.getContext("2d");

    resize();
    window.addEventListener("resize", resize);

    return () => window.removeEventListener("resize", resize);
  });

  // ✅ Svelte 5 reactive effect
  $effect(() => {
    draw();
  });
</script>

<canvas bind:this={canvas} class="fixed inset-0"></canvas>

<div class="fixed bottom-4 left-1/2 -translate-x-1/2 w-64">
  <button
    class="w-full flex items-center justify-between px-3 py-2 rounded bg-neutral-900 text-neutral-100 border border-neutral-700"
    onclick={() => (menuOpen = !menuOpen)}
    aria-expanded={menuOpen}
  >
    <span>Controls</span>
    <svg
      class="w-4 h-4 transition-transform duration-200"
      style="transform: rotate({menuOpen ? 180 : 0}deg);"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.72-3.72a.75.75 0 111.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clip-rule="evenodd" />
    </svg>
  </button>

  {#if menuOpen}
    <div class="mt-2 p-3 rounded bg-black/70 border border-neutral-700 space-y-3">
      <div class="flex items-center gap-4">
        <input type="range" min="0" max="100" bind:value={percent} class="w-full" />
        <span class="text-sm font-medium text-neutral-50">{percent}%</span>
      </div>

      <div class="flex items-center gap-4">
        <input type="range" min="100" max="2000" bind:value={pAmount} class="w-full" />
        <span class="text-sm font-medium text-neutral-50">{pAmount} pts</span>
      </div>

      <div class="flex items-center gap-4">
        <input type="range" min="0" max="360" bind:value={hueOffset} class="w-full" />
        <span class="text-sm font-medium text-neutral-50">Hue offset: {hueOffset}°</span>
      </div>

      <div class="flex items-center gap-4">
        <input type="range" min="1" max="20" bind:value={pSize} class="w-full" />
        <span class="text-sm font-medium text-neutral-50">Point size: {pSize}px</span>
      </div>

      <div class="flex justify-between gap-2">
        <button class="px-3 py-1 rounded bg-blue-600 text-white" onclick={startHueAnimation}>Start</button>
        <button class="px-3 py-1 rounded bg-red-600 text-white" onclick={stopHueAnimation}>Stop</button>
      </div>
    </div>
  {/if}
</div>
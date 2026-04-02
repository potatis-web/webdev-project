<script>
  import { onMount } from "svelte";

  let percent = $state(25);

  let canvas;
  let ctx;
  let pAmount = 360;
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

  function draw() {
    if (!ctx) return;

    ctx.clearRect(0, 0, size.w, size.h);

    const scale = percent / 100;

    for (let i = 0; i < 720; i++) {
      const angle = toRadians(i);

      const x = cx + Math.cos(angle) * scale * cx;
      const y = cy + Math.sin(angle) * scale * cy;

      ctx.fillRect(x, y, 2, 2);
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
  <div class="flex items-center gap-4">
    <input
      type="range"
      min="0"
      max="100"
      bind:value={percent}
      class="w-full"
    />
    <span class="text-sm font-medium">{percent}%</span>
  </div>
</div>
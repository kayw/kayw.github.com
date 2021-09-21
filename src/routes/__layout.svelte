<script lang="ts">
  import '../global.css';
  import Nav from '$lib/Nav.svelte';
  import Footer from '$lib/Footer.svelte';
  import { onMount } from 'svelte';

  let loaded = false;

  import { page } from '$app/stores';
  onMount(async () => {
    loaded = true;
  });
</script>

{#if !loaded}
  <section class="overflow-x-hidden w-screen relative">
    <div class="fade-in h-screen flex flex-col items-center justify-center">
      <h1 class="font-sans text-gray-400 sm:text-xl lg:text-3xl">WELCOME TO HELL!</h1>
      <div class="lds-heart"><div /></div>
    </div>
  </section>
{:else}
  <div class="grid">
    <nav class="nav">
      <Nav path={$page.path} />
    </nav>

    <main class="main h-full">
      <slot />
    </main>

    <footer class="footer">
      <Footer />
    </footer>
  </div>
{/if}

<style lang="postcss">
  /* minmax on the nav is used for expansion on mobile */
  /* minmax on the main is used for long main content */
  .grid {
    display: grid;
    grid-template-rows: minmax(10vh, auto) minmax(80vh, auto) 10vh;
    grid-template-areas:
      'nav'
      'main'
      'footer';
  }

  .nav {
    grid-area: nav;
    height: 4rem;
    border-bottom: 0.0625rem var(--color-borders) solid;
    z-index: 30;
    background-color: var(--color-alt-bg);
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
  }

  .main {
    grid-area: main;
  }

  .footer {
    grid-area: footer;
  }
</style>

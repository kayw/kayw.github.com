<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  export let path;
  let open = false;
  function toggleOpen() {
    open = !open;
  }
  const dispatch = createEventDispatcher();

  let dark = false;
  const toggleTheme = (): void => {
    dark = !dark;
    dispatch('toggleTheme', {
      dark: dark,
    });
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
  };
</script>

<button
  on:click={() => toggleTheme()}
  aria-label="Toggle Dark Mode"
  type="button"
  class:sticky-theme-mode-button={'true'}
  class="w-10 h-10 p-3 bg-gray-200 rounded-full dark:bg-gray-800 filter shadow hover:shadow-md dark:shadow-dark dark:hover:shadow-dark-lg"
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    stroke="currentColor"
    class="w-4 h-4 text-gray-800 dark:text-gray-200"
  >
    {#if dark}
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width={2}
        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
      />
    {:else}
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width={2}
        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
      />
    {/if}
  </svg>
</button>

<div class="mx-auto px-2 sm:px-4 lg:px-8">
  <div class="relative flex items-center justify-between h-16">
    <div class="flex items-center px-2 lg:px-0">
      <div class="hidden lg:block lg:ml-6">
        <div class="flex space-x-4">
          <a href="/" class="{path === '/' ? 'nav-active' : 'nav-inactive'} nav-default">Home</a>
          <a href="/about" class="{path === '/about' ? 'nav-active' : 'nav-inactive'} nav-default"
            >About</a
          >
          <a href="/blog" class="{path === '/blog' ? 'nav-active' : 'nav-inactive'} nav-default"
            >Blog</a
          >
        </div>
      </div>
    </div>
    <div class="flex-1 flex justify-center px-2 lg:ml-6 lg:justify-end" />
    <div class="md:hidden">
      <button
        on:click={toggleOpen}
        class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:bg-gray-700 focus:text-white transition duration-150 ease-in-out bg-transparent"
      >
        <svg class="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
          <path
            class={open ? 'hidden' : 'inline-flex'}
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h16M4 18h16"
          />
          <path
            class={open ? 'inline-flex' : 'hidden'}
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  </div>
</div>
<div class="{open ? 'block' : 'hidden'} md:hidden">
  <div class="px-2 pt-2 pb-3 flex flex-col space-y-1">
    <a href="/" class="{path === '/' ? 'nav-active' : 'nav-inactive'} nav-default">Home</a>
    <a href="/about" class="{path === '/about' ? 'nav-active' : 'nav-inactive'} nav-default"
      >About</a
    >
    <a href="/blog" class="{path === '/blog' ? 'nav-active' : 'nav-inactive'} nav-default">Blog</a>
  </div>
</div>

<style>
  .nav-default {
    @apply px-3 py-2 rounded-md text-sm leading-5 font-medium  transition duration-150 ease-in-out;
  }

  .nav-default:focus {
    @apply ring text-blue-500 bg-black;
  }

  .nav-active {
    @apply text-blue-500 border-2 border-blue-500;
  }

  .nav-active:hover {
    @apply text-black bg-blue-500;
  }

  .nav-inactive {
  }

  .nav-inactive:hover {
    @apply text-black bg-blue-500;
  }
  .sticky-theme-mode-button {
    position: fixed;
    top: 10px;
    right: 15px;
    z-index: 1000;
  }
</style>

<svelte:head>
  <title>A Introvert Geek</title>
</svelte:head>

<div class="h-full flex flex-col justify-center text-center my-auto mx-auto">
  <p class="text-base text-gray-500 md:text-xl">
    Hi! I'm <span class="text-yellow-500">kayw</span>
  </p>
  <h2 class="headline tracking-tight leading-10 font-extrabold text-purple-500 mt-3 md:mt-10">
    I
    <a
      href="https://github.com/kayw/starter-step"
      class="leading-6 text-blue-500 hover:text-blue-300"
    >
      tinker
    </a>
    <br class="xl:hidden" />
    with hyping tech
  </h2>
  <p class="mt-3 md:mt-10 text-base text-gray-500 md:text-xl">welcome to my digital garden</p>
  <div class="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
    <div class="rounded-md">
      <a
        href="/blog"
        class="w-full flex items-center justify-center px-8 py-3 border-4 border-blue-500 text-base text-black leading-6 font-medium rounded-md bg-blue-500 hover:bg-transparent hover:text-blue-500 focus:outline-none focus:ring-blue transition duration-150 ease-in-out md:py-4 md:text-lg md:px-10"
      >
        Blog
      </a>
    </div>
    <div class="rounded-md mt-3 md:ml-3 md:mt-0">
      <a
        href="/about"
        class="w-full flex items-center justify-center px-8 py-3 border-4 text-base leading-6 font-medium rounded-md text-blue-500 border-blue-500 hover:bg-blue-500 hover:text-black focus:outline-none focus:ring-blue transition duration-150 ease-in-out md:py-4 md:text-lg md:px-10"
      >
        About
      </a>
    </div>
  </div>
</div>

<style lang="postcss">
  .headline {
    font-size: 2rem;
  }

  @media (min-width: 768px) {
    .headline {
      font-size: 5rem;
    }
  }
</style>

<script context="module" lang="ts">
  const slugFromPath = (path: string): string =>
    path.match(/([\w-]+)\/([\w-]+)\.(md|svx)/i)?.[1] ?? null;
  const svxPosts = import.meta.glob('./**/*.{md,svx}');

  let body = [];

  for (const [path, resolver] of Object.entries(svxPosts)) {
    const slug = slugFromPath(path);
    body.push(resolver().then(({ metadata }) => ({ ...metadata, slug })));
  }
  /**
   * @type {import('@sveltejs/kit').Load}
   */
  export async function load({ page, fetch }) {
    const posts = await Promise.all(body);
    // sort by published_at
    return {
      props: {
        posts,
      },
    };
  }
</script>

<script>
  import Tag from '$lib/Tag.svelte';
  export let posts;
</script>

<svelte:head>
  <title>Blog</title>
</svelte:head>

<!--Title-->
<div class="font-sans">
  <h1 class="font-sans break-normal pt-6 pb-2 text-3xl md:text-4xl">Recent posts</h1>

  <ul class="list-none">
    {#each posts as { title, tags, outline, slug }}
      <li class="list-none">
        <a class="text-blue-500 space-y-3" rel="prefetch" href="blog/{slug}">
          <h2>
            {title}
          </h2>

          <p class="text-gray-400 text-base">
            {outline}
          </p>
          {#if tags && tags.length}
            <p class="text-sm font-normal text-gray-500">
              Tags: {#each tags as tag}
                <Tag {tag} />
              {/each}
            </p>
          {/if}
        </a>
      </li>
    {/each}
  </ul>
</div>

<style lang="postcss">
  a:hover {
    text-decoration: none;
  }
</style>

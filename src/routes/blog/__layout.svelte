<div class="content-grid">
  <div class="content w-full text-xl leading-normal" style="font-family: Georgia, serif;">
    <slot />
  </div>
</div>

<style>
  .content-grid {
    display: grid;
    grid-template-columns: 22vw 50vw 22vw;
    grid-template-rows: minmax(60vh, auto) 10vh;
    grid-template-areas:
      '. content .'
      '. . .';
  }

  .content {
    grid-area: content;
  }

  @media only screen and (max-width: 768px) {
    .content-grid {
      grid-template-columns: 10vw 80vw 5vw;
    }
  }
</style>

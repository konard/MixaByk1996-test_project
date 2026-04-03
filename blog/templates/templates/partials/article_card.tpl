{* Renders a compact article card. Expects $article variable. *}
<article class="card">
    <a href="/article/{$article.slug}">
        {if $article.image}
            <img class="card__image" src="{$article.image}" alt="{$article.title|escape}" loading="lazy">
        {else}
            <div class="card__image-placeholder">📄</div>
        {/if}
    </a>
    <div class="card__body">
        <div class="card__meta">
            <span>📅 {$article.published_at|date_format:"%b %d, %Y"}</span>
            <span>👁 {$article.views|number_format:0:'.':','}</span>
        </div>
        <h3 class="card__title">
            <a href="/article/{$article.slug}">{$article.title|escape}</a>
        </h3>
        {if $article.description}
            <p class="card__description">{$article.description|escape}</p>
        {/if}
    </div>
    <div class="card__footer">
        <a href="/article/{$article.slug}" class="btn btn--outline btn--sm">Read more</a>
    </div>
</article>

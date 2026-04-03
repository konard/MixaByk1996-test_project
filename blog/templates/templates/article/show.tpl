{include file='partials/header.tpl'}

<div class="container">
    <article class="article">
        <header class="article__header">
            {* Categories *}
            {if $categories}
                <div class="article__categories">
                    {foreach $categories as $cat}
                        <a href="/category/{$cat.slug}" class="badge badge--primary">{$cat.name|escape}</a>
                    {/foreach}
                </div>
            {/if}

            <h1 class="article__title">{$article.title|escape}</h1>

            <div class="article__meta">
                <span>📅 {$article.published_at|date_format:"%B %d, %Y"}</span>
                <span>👁 {$article.views|number_format:0:'.':','} views</span>
            </div>

            {if $article.description}
                <p class="article__description">{$article.description|escape}</p>
            {/if}
        </header>

        {if $article.image}
            <img class="article__image"
                 src="{$article.image}"
                 alt="{$article.title|escape}">
        {/if}

        <div class="article__content">
            {$article.content}
        </div>
    </article>

    {* Similar articles *}
    {if $similar_articles}
        <section class="similar-articles">
            <h2 class="similar-articles__title">Similar Articles</h2>
            <div class="similar-articles__grid">
                {foreach $similar_articles as $article}
                    {include file='partials/article_card.tpl'}
                {/foreach}
            </div>
        </section>
    {/if}
</div>

{include file='partials/footer.tpl'}

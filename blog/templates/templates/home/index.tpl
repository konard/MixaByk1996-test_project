{include file='partials/header.tpl'}

<div class="page-hero">
    <div class="page-hero__container">
        <h1 class="page-hero__title">Welcome to the Blog</h1>
        <p class="page-hero__description">Explore articles across technology, science, travel, food, and more.</p>
    </div>
</div>

<div class="container">
    {if $categories}
        {foreach $categories as $category}
            <section class="category-section">
                <div class="category-section__header">
                    <h2 class="category-section__title">
                        <a href="/category/{$category.slug}">{$category.name|escape}</a>
                        {if $category.articles}
                            <span class="category-section__count">({count($category.articles)} recent)</span>
                        {/if}
                    </h2>
                    <a href="/category/{$category.slug}" class="btn btn--outline btn--sm">All articles &rarr;</a>
                </div>

                {if $category.articles}
                    <div class="category-section__grid">
                        {foreach $category.articles as $article}
                            {include file='partials/article_card.tpl'}
                        {/foreach}
                    </div>
                {else}
                    <div class="empty-state">
                        <div class="empty-state__icon">📭</div>
                        <p class="empty-state__text">No articles in this category yet.</p>
                    </div>
                {/if}
            </section>
        {/foreach}
    {else}
        <div class="empty-state">
            <div class="empty-state__icon">📭</div>
            <h2 class="empty-state__title">No Categories Yet</h2>
            <p class="empty-state__text">Check back soon for new content.</p>
        </div>
    {/if}
</div>

{include file='partials/footer.tpl'}

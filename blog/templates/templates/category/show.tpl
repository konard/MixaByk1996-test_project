{include file='partials/header.tpl'}

<div class="container">

    <div class="category-header">
        <h1 class="category-header__name">{$category.name|escape}</h1>
        {if $category.description}
            <p class="category-header__description">{$category.description|escape}</p>
        {/if}
        <p class="category-header__stats">
            <strong>{$total_articles}</strong> {if $total_articles == 1}article{else}articles{/if} in this category
        </p>
    </div>

    {* Sorting controls *}
    {if $total_articles > 0}
        <div class="sort-controls">
            <span class="sort-controls__label">Sort by:</span>
            <div class="sort-controls__group">
                {assign var="date_order" value=($sort_by == 'published_at' && $sort_order == 'DESC') ? 'ASC' : 'DESC'}
                <a href="/category/{$category.slug}?sort=published_at&order=DESC&page=1"
                   class="sort-controls__btn{if $sort_by == 'published_at'} sort-controls__btn--active{/if}">
                    📅 Date
                    {if $sort_by == 'published_at'}{if $sort_order == 'DESC'}↓{else}↑{/if}{/if}
                </a>
                <a href="/category/{$category.slug}?sort=published_at&order=ASC&page=1"
                   class="sort-controls__btn{if $sort_by == 'published_at' && $sort_order == 'ASC'} sort-controls__btn--active{/if}">
                    📅 Oldest first
                </a>
                <a href="/category/{$category.slug}?sort=views&order=DESC&page=1"
                   class="sort-controls__btn{if $sort_by == 'views' && $sort_order == 'DESC'} sort-controls__btn--active{/if}">
                    👁 Most viewed
                </a>
                <a href="/category/{$category.slug}?sort=views&order=ASC&page=1"
                   class="sort-controls__btn{if $sort_by == 'views' && $sort_order == 'ASC'} sort-controls__btn--active{/if}">
                    👁 Least viewed
                </a>
            </div>
        </div>

        {* Articles list *}
        <div class="articles-list">
            {foreach $articles as $article}
                <article class="article-list-item">
                    <div class="article-list-item__image-wrapper">
                        {if $article.image}
                            <img class="article-list-item__image"
                                 src="{$article.image}"
                                 alt="{$article.title|escape}"
                                 loading="lazy">
                        {else}
                            <div class="article-list-item__image-placeholder">📄</div>
                        {/if}
                    </div>
                    <div class="article-list-item__body">
                        <div class="article-list-item__meta">
                            <span>📅 {$article.published_at|date_format:"%b %d, %Y"}</span>
                            <span>👁 {$article.views|number_format:0:'.':','} views</span>
                        </div>
                        <h2 class="article-list-item__title">
                            <a href="/article/{$article.slug}">{$article.title|escape}</a>
                        </h2>
                        {if $article.description}
                            <p class="article-list-item__description">{$article.description|escape}</p>
                        {/if}
                        <div class="article-list-item__footer">
                            <a href="/article/{$article.slug}" class="btn btn--outline btn--sm">Read more</a>
                        </div>
                    </div>
                </article>
            {/foreach}
        </div>

        {* Pagination *}
        {if $total_pages > 1}
            <nav class="pagination" aria-label="Pagination">
                {* Previous *}
                {if $current_page > 1}
                    <a href="/category/{$category.slug}?sort={$sort_by}&order={$sort_order}&page={$current_page - 1}"
                       class="pagination__item">&lsaquo;</a>
                {else}
                    <span class="pagination__item pagination__item--disabled">&lsaquo;</span>
                {/if}

                {* Page numbers *}
                {if $page_window_start > 1}
                    <a href="/category/{$category.slug}?sort={$sort_by}&order={$sort_order}&page=1" class="pagination__item">1</a>
                    {if $page_window_start > 2}<span class="pagination__item pagination__item--disabled">…</span>{/if}
                {/if}

                {for $i=$page_window_start to $page_window_end}
                    {if $i == $current_page}
                        <span class="pagination__item pagination__item--active">{$i}</span>
                    {else}
                        <a href="/category/{$category.slug}?sort={$sort_by}&order={$sort_order}&page={$i}"
                           class="pagination__item">{$i}</a>
                    {/if}
                {/for}

                {if $page_window_end < $total_pages}
                    {if $page_window_end < $total_pages - 1}<span class="pagination__item pagination__item--disabled">…</span>{/if}
                    <a href="/category/{$category.slug}?sort={$sort_by}&order={$sort_order}&page={$total_pages}"
                       class="pagination__item">{$total_pages}</a>
                {/if}

                {* Next *}
                {if $current_page < $total_pages}
                    <a href="/category/{$category.slug}?sort={$sort_by}&order={$sort_order}&page={$current_page + 1}"
                       class="pagination__item">&rsaquo;</a>
                {else}
                    <span class="pagination__item pagination__item--disabled">&rsaquo;</span>
                {/if}
            </nav>
        {/if}

    {else}
        <div class="empty-state">
            <div class="empty-state__icon">📭</div>
            <h2 class="empty-state__title">No Articles Yet</h2>
            <p class="empty-state__text">No articles have been published in this category yet.</p>
            <a href="/" class="btn btn--primary" style="margin-top:1.5rem">Back to Home</a>
        </div>
    {/if}

</div>

{include file='partials/footer.tpl'}

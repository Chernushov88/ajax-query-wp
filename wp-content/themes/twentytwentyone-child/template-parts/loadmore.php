<?php
	global $wp_query;
	
	$paged = get_query_var( 'paged' ) ? get_query_var( 'paged' ) : 1;
	$max_pages = $wp_query->max_num_pages;

	if($paged < $max_pages) : ?>

	<div id="loadmore" class="wp-block-image">
		<a href="#" 
			 class="button"
			 data-max-pages="<?= $max_pages; ?>"
			 data-paged="<?= $paged; ?>"
			 data-taxonomy="<?= is_category() ? 'category' : get_query_var('taxonomy'); ?>"
			 data-term-id="<?=  get_queried_object_id(); ?>"
			 data-pagenumlink="<?=  get_pagenum_link(1); ?>"
			 >Load more</a>
	</div>
	<?php endif; ?>



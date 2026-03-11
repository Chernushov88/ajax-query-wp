<?php
function twentytwentyone_child_enqueue_styles() {
	wp_enqueue_style(
		'twentytwentyone-child-style',
		get_stylesheet_uri(),
		array('twenty-twenty-one-style'),
		wp_get_theme()->get('Version')
	);
}
add_action('wp_enqueue_scripts', 'twentytwentyone_child_enqueue_styles');


/* ***
* Scripts
*/
// ADD web-site scripts
function twentytwentyone_child_enqueue_scripts() {
    wp_register_script(
        'trueajax',
        get_stylesheet_directory_uri() . '/js/ajax.js',
        array('jquery'),
        time(),
        true
    );

    wp_localize_script(
        'trueajax',
        'serhii',
        array(
            'ajax_url' => admin_url('admin-ajax.php')
        )
    );
		
    wp_enqueue_script('trueajax');
}
add_action('wp_enqueue_scripts', 'twentytwentyone_child_enqueue_scripts');

// ADD ADmin scripts
function admin_enqueue_scripts_func() {
	wp_enqueue_script( 'trueajax', get_stylesheet_directory_uri() . '/js/adminAjax.js', array( 'jquery' ), time(), true );

}
add_action('admin_enqueue_scripts', 'admin_enqueue_scripts_func');


/* ***
* Find Posts
*/
function true_ajax() {
	$post_id = !empty($_POST['post_id']) && $_POST['post_id'] ? intval($_POST['post_id']) : 0;
	$post = get_post($post_id);

	if(!$post){
		echo 'Post with this ID does not exist!';
	} else{
		echo get_the_title($post);
	}

	die;
}
add_action('wp_ajax_truepostname', 'true_ajax');
add_action('wp_ajax_nopriv_truepostname', 'true_ajax');



function true_changeviews_func(){
	$nonce = check_ajax_referer( 'viws_post_token', 'token', false );
	if( ! $nonce ) {
		echo 'Security breach (Nonce)';
		die;
	}

	$post_id = intval($_POST['post_id']);
  $views = intval($_POST['views']);

	if( $views < 0 ) {
		echo "It can't be negative!!";
	} else {
		update_post_meta( $post_id, 'post_views', $views );
		echo 'Saved successfully (ok)';
	}
	die;

};
add_action( 'wp_ajax_truechangeviews', 'true_changeviews_func');

/* ***
* Add column to admin Posts
*/
// добавление колонки в админку WordPress
function true_add_post_columns( $my_columns ){
	$my_columns['views'] = 'Views';
	return $my_columns;
}
function true_fill_post_columns( $column ) {
	global $post;
	switch ( $column ) {
		case 'views':
			$views = get_post_meta($post->ID, 'post_views', true);
			$views = ($views !== '') ? intval($views) : 0;
			echo '<div class="form-field">';
			echo '<input type="number" 
									class="change-views" 
									data-token="' . wp_create_nonce( 'viws_post_token' ) . '"
									data-id="' . $post->ID . '" 
									value="' . $views . '" />';
			echo '<p style="margin:0; color:green; font-size:11px; min-height:15px;"></p>';
			echo '</div>';
			break;
	}
}
add_action( 'manage_posts_custom_column', 'true_fill_post_columns', 10, 1 );
add_filter( 'manage_edit-post_columns', 'true_add_post_columns', 10, 1 );

/* ***
* Cout Posts Views
*/
// Функція для підрахунку переглядів на фронтенді
function true_track_post_views() {
    // Рахуємо перегляди тільки для поодиноких записів (post) і не для адмінів
    if ( is_single() ) {
        global $post;
        $post_id = $post->ID;
        
        // Отримуємо поточне значення
        $views = get_post_meta($post_id, 'post_views', true);
        $views = ( $views !== '' ) ? intval($views) : 0;
        
        // Збільшуємо на 1 та оновлюємо
        update_post_meta($post_id, 'post_views', $views + 1);
    }
}
// Вішаємо функцію на wp_head, щоб вона спрацьовувала при завантаженні сторінки
add_action('wp_head', 'true_track_post_views');




/*
* true_loadmore
*/

function true_loadmore() {
	$paged = !empty($_POST['paged']) ? $_POST['paged'] : 1;
	$paged++;

	$args = array(
		'paged' => $paged,
		'post_status' => 'publish'
	);

	$taxonomy = !empty($_POST['taxonomy']) ? sanitize_text_field($_POST['taxonomy']) : '';
	$term_id = !empty($_POST['term_id']) ? intval($_POST['term_id']) : 0;

	if($taxonomy && $term_id) {
		$args['tax_query'] = array(
			array(
				'taxonomy' => $taxonomy,
				'field' => 'term_id',
				'terms' => $term_id
			)
		);
	}

	query_posts($args);
	ob_start();

	while(have_posts()): the_post();
		get_template_part('template-parts/content/content', get_theme_mod('display_excerpt_or_full_post', 'excerpt'));
	endwhile;	

	$posts = ob_get_contents();
	ob_get_clean();

	ob_start();
	twenty_twenty_one_the_posts_navigation();
	$pagination = ob_get_contents();
	ob_get_clean();

	echo json_encode( array(
		'posts' => $posts,
		'pagination' => str_replace( admin_url( 'admin-ajax.php' ), $_POST[ 'pagenumlink' ], $pagination )
	) );

	die;
}

add_action('wp_ajax_loadmore', 'true_loadmore');
add_action('wp_ajax_nopriv_loadmore', 'true_loadmore');
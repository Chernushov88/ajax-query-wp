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
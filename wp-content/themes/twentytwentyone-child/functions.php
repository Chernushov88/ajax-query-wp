<?php
function twentytwentyone_child_enqueue_styles() {
	wp_enqueue_style(
		'twentytwentyone-style',
		get_template_directory_uri(). '/style.css'
	);
	
	wp_enqueue_style(
		'twentytwentyone-child-style',
		get_stylesheet_uri(),
		array('twenty-twenty-one-style'),
		wp_get_theme()->get('Version')
	);
}
add_action('wp_enqueue_scripts', 'twentytwentyone_child_enqueue_styles');

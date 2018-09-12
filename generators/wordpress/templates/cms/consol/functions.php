<?php

/* Custom Post Type: Spelers */

function register_projects() {
    $labels = array(
        'name'               => 'Projects',
        'singular_name'      => 'Project',
        'add_new'            => 'New Project',
        'add_new_item'       => 'Add Project',
        'edit_item'          => 'Edit Project',
        'new_item'           => 'New Project',
        'all_items'          => 'All Projects',
        'view_item'          => 'View project',
        'search_items'       => 'Search projects',
        'not_found'          => 'No projects found',
        'not_found_in_trash' => 'No projects found in the trash',
        'parent_item_colon'  => '',
        'menu_name'          => 'Projects'
    );
    $args = array(
        'labels'             => $labels,
        'public'             => true,
        'publicly_queryable' => true,
        'show_in_rest'       => true,
        'show_ui'            => true,
        'show_in_menu'       => true,
        'query_var'          => true,
        'rewrite'            => array(
            'slug' => 'projects'
        ),
        'capability_type'    => 'post',
        'has_archive'	       => true,
        'menu_icon'          => 'dashicons-universal-access',
        'hierarchical'       => true,
        'menu_position'      => null,
        'supports'           => array( 'title', 'thumbnail', 'editor' ),
        'taxonomies'		     => array(''),
    );
    register_post_type( 'projects', $args );
}

add_action( 'init', 'register_projects' );



add_action( 'init', function() {
    global $wp_rewrite;
    $wp_rewrite->set_permalink_structure( '/%postname%/' );
} );




add_theme_support( 'menus' );

function get_menu() {
    # Change 'menu' to your own navigation slug.
	$menu_items = wp_get_nav_menu_items('menu');
	foreach($menu_items as $menu_item) {
		// ALTERNATIVE: $slug = get_post_field( 'post_name', $menu_item->object_id );
		$slug = basename( get_permalink($menu_item->object_id) );
		$menu_item->slug = $slug;
		
		if($menu_item->type === 'post_type' && $menu_item->object === 'page') {
            $menu_item->url = '/' . $menu_item->slug;
		}
	}
	return $menu_items;
}

add_action( 'rest_api_init', function () {
        register_rest_route( 'myroutes', '/menu', array(
        'methods' => 'GET',
        'callback' => 'get_menu',
    ) );
} );

if(function_exists('acf_add_options_page')) {
    acf_add_options_page( array(
	    'page_title' => 'Options',
        'post_id' => 'site-options',
        "show_in_rest" => 1,
    ));
}

// http://wpvuecms.test/wp-json/acf/v3/posts/36
add_action( 'acf/rest_api/id', function( $id ) {
    if ( 'options' == $id ) {
        return 'site-options';
    }
    return $id;
} );

// add_filter( 'acf/rest_api/field_settings/show_in_rest', '__return_true' );

add_action( 'send_headers', function() {
	if ( ! did_action('rest_api_init') && $_SERVER['REQUEST_METHOD'] == 'HEAD' ) {
		header("Access-Control-Allow-Origin: *");
		header("Access-Control-Expose-Headers: Link");
		header("Access-Control-Allow-Methods: HEAD");
	}
} );

add_action( 'after_switch_theme', 'auto_set_license_keys' );


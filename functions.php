<?php
function whitestudioteam_enqueue_styles() {
    wp_enqueue_style('terminal-style', get_stylesheet_directory_uri() . '/style.css', [], wp_get_theme()->get('Version'));
}
add_action('wp_enqueue_scripts', 'whitestudioteam_enqueue_styles');

function whitestudioteam_theme_setup() {
    add_theme_support('editor-styles');
    add_editor_style('style.css');
}
add_action('after_setup_theme', 'whitestudioteam_theme_setup');

function whitestudioteam_register_portfolio() {
    register_post_type('portfolio', [
        'labels' => [
            'name' => __('Portfolio'),
            'singular_name' => __('Portfolio Item'),
        ],
        'public' => true,
        'has_archive' => true,
        'show_in_rest' => true,
        'supports' => ['title', 'editor', 'custom-fields'],
        'rewrite' => ['slug' => 'portfolio'],
        'menu_icon' => 'dashicons-portfolio'
    ]);
}
add_action('init', 'whitestudioteam_register_portfolio');

function whitestudioteam_load_textdomain() {
    load_theme_textdomain('terminal-theme', get_template_directory() . '/languages');
}
add_action('after_setup_theme', 'whitestudioteam_load_textdomain');

function whitestudioteam_enqueue_cf7_styles() {
    if (function_exists('wpcf7_enqueue_scripts')) {
        wp_enqueue_style('terminal-cf7', get_template_directory_uri() . '/assets/css/terminal-cf7.css', [], '1.0');
    }
}
add_action('wp_enqueue_scripts', 'whitestudioteam_enqueue_cf7_styles');

function whitestudioteam_enqueue_scripts() {
    wp_enqueue_script('terminal-js', get_template_directory_uri() . '/assets/js/terminal.js', [], '1.0', true);
}
add_action('wp_enqueue_scripts', 'whitestudioteam_enqueue_scripts');

function whitestudioteam_script_loader_tag($tag, $handle, $src) {
    if ($handle === 'terminal-js') {
        return '<script type="module" src="' . esc_url($src) . '"></script>';
    }
    return $tag;
}
add_filter('script_loader_tag', 'whitestudioteam_script_loader_tag', 10, 3);

function whitestudioteam_rest_authentication($result) {
    if (!empty($result)) return $result;
    return true;
}
add_filter('rest_authentication_errors', 'whitestudioteam_rest_authentication');

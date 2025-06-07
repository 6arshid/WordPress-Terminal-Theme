<?php
function terminal_theme_enqueue_styles() {
    wp_enqueue_style('terminal-style', get_stylesheet_directory_uri() . '/style.css', [], wp_get_theme()->get('Version'));
}
add_action('wp_enqueue_scripts', 'terminal_theme_enqueue_styles');
function terminal_theme_setup() {
    add_theme_support('editor-styles');
    add_editor_style('style.css');
}
add_action('after_setup_theme', 'terminal_theme_setup');


add_action('init', function () {
    register_post_type('portfolio', [
        'labels' => [
            'name' => __('Portfolio', 'terminal-theme'),
            'singular_name' => __('Portfolio Item', 'terminal-theme'),
        ],
        'public' => true,
        'has_archive' => true,
        'show_in_rest' => true,
        'supports' => ['title', 'editor', 'custom-fields'],
        'rewrite' => ['slug' => 'portfolio'],
        'menu_icon' => 'dashicons-portfolio'
    ]);
});


add_action('after_setup_theme', function () {
    load_theme_textdomain('terminal-theme', get_template_directory() . '/languages');
});

add_action('wp_enqueue_scripts', function () {
    if (function_exists('wpcf7_enqueue_scripts')) {
        wp_enqueue_style('terminal-cf7', get_template_directory_uri() . '/assets/css/terminal-cf7.css', [], '1.0');
    }
});

add_action('wp_enqueue_scripts', function () {
    wp_enqueue_script('terminal-js', get_template_directory_uri() . '/assets/js/terminal.js', ['wp-i18n'], '1.0', true);
    wp_set_script_translations('terminal-js', 'terminal-theme', get_template_directory() . '/languages');
});


add_filter('rest_authentication_errors', function($result) {
    if (!empty($result)) return $result;
    return true;
});

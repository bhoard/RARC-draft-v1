<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function rarc_theme_setup() {
	add_theme_support( 'wp-block-styles' );
	add_theme_support( 'responsive-embeds' );
	add_theme_support( 'editor-styles' );
	remove_theme_support( 'core-block-patterns' );
	add_theme_support(
		'custom-logo',
		array(
			'height'      => 163,
			'width'       => 300,
			'flex-height' => true,
			'flex-width'  => true,
		)
	);
}
add_action( 'after_setup_theme', 'rarc_theme_setup' );

add_filter( 'should_load_remote_block_patterns', '__return_false' );

function rarc_theme_get_version() {
	static $version = null;

	if ( null === $version ) {
		$version = wp_get_theme()->get( 'Version' );
	}

	return $version;
}

function rarc_theme_fonts_url() {
	return 'https://fonts.googleapis.com/css2?family=Manrope:wght@400;700;800;900&display=swap';
}

function rarc_theme_default_logo_markup() {
	return sprintf(
		'<a href="%1$s" class="custom-logo-link" rel="home"><img src="%2$s" class="custom-logo" alt="%3$s" /></a>',
		esc_url( home_url( '/' ) ),
		esc_url( get_theme_file_uri( 'assets/images/rarc-logo.jpg' ) ),
		esc_attr__( 'Richmond Area Remote Control Club', 'rarc-theme' )
	);
}

function rarc_theme_get_seed_logo_path() {
	return get_theme_file_path( 'assets/images/rarc-logo.jpg' );
}

function rarc_theme_render_site_logo_fallback( $block_content, $block ) {
	if ( empty( $block['blockName'] ) || 'core/site-logo' !== $block['blockName'] ) {
		return $block_content;
	}

	if ( has_custom_logo() || ! empty( trim( $block_content ) ) ) {
		return $block_content;
	}

	return rarc_theme_default_logo_markup();
}
add_filter( 'render_block', 'rarc_theme_render_site_logo_fallback', 10, 2 );

function rarc_theme_seed_custom_logo() {
	if ( ! current_user_can( 'edit_theme_options' ) ) {
		return;
	}

	if ( get_option( 'rarc_theme_seed_logo_done' ) ) {
		return;
	}

	if ( get_theme_mod( 'custom_logo' ) ) {
		update_option( 'rarc_theme_seed_logo_done', 1, false );
		return;
	}

	$source = rarc_theme_get_seed_logo_path();

	if ( ! file_exists( $source ) ) {
		update_option( 'rarc_theme_seed_logo_done', 1, false );
		return;
	}

	$attachment_id = (int) get_option( 'rarc_theme_seed_logo_attachment_id' );

	if ( $attachment_id && ! get_post( $attachment_id ) ) {
		$attachment_id = 0;
	}

	if ( ! $attachment_id ) {
		$file_bits = file_get_contents( $source );

		if ( false !== $file_bits ) {
			$upload = wp_upload_bits( basename( $source ), null, $file_bits );

			if ( empty( $upload['error'] ) ) {
				$filetype = wp_check_filetype( $upload['file'] );
				$attachment_id = wp_insert_attachment(
					array(
						'post_mime_type' => $filetype['type'],
						'post_title'     => __( 'RARC Seed Logo', 'rarc-theme' ),
						'post_content'   => '',
						'post_status'    => 'inherit',
					),
					$upload['file']
				);

				if ( ! is_wp_error( $attachment_id ) ) {
					require_once ABSPATH . 'wp-admin/includes/image.php';
					$metadata = wp_generate_attachment_metadata( $attachment_id, $upload['file'] );
					wp_update_attachment_metadata( $attachment_id, $metadata );
					update_option( 'rarc_theme_seed_logo_attachment_id', $attachment_id, false );
				} else {
					$attachment_id = 0;
				}
			}
		}
	}

	if ( $attachment_id ) {
		set_theme_mod( 'custom_logo', $attachment_id );
	}

	update_option( 'rarc_theme_seed_logo_done', 1, false );
}
add_action( 'after_switch_theme', 'rarc_theme_seed_custom_logo' );

function rarc_theme_render_page_hero_background( $block_content, $block ) {
	if ( empty( $block['blockName'] ) || 'core/group' !== $block['blockName'] ) {
		return $block_content;
	}

	if ( empty( $block['attrs']['className'] ) || false === strpos( $block['attrs']['className'], 'rarc-page-hero' ) ) {
		return $block_content;
	}

	$post_id = ! empty( $block['context']['postId'] ) ? (int) $block['context']['postId'] : get_the_ID();

	if ( ! $post_id || ! has_post_thumbnail( $post_id ) ) {
		return $block_content;
	}

	$image_url = get_the_post_thumbnail_url( $post_id, 'full' );

	if ( ! $image_url ) {
		return $block_content;
	}

	$style = '--rarc-page-hero-image:url(' . esc_url_raw( $image_url ) . ')';

	if ( preg_match( '/\sstyle="([^"]*)"/', $block_content, $matches ) ) {
		$existing = rtrim( $matches[1], '; ' );
		$replacement = ' style="' . esc_attr( $existing . ';' . $style ) . '"';
		return preg_replace( '/\sstyle="([^"]*)"/', $replacement, $block_content, 1 );
	}

	return preg_replace( '/^<div\b/', '<div style="' . esc_attr( $style ) . '"', $block_content, 1 );
}
add_filter( 'render_block', 'rarc_theme_render_page_hero_background', 11, 2 );

function rarc_theme_assets() {
	$version = rarc_theme_get_version();

	wp_enqueue_style(
		'rarc-theme-fonts',
		rarc_theme_fonts_url(),
		array(),
		null
	);

	wp_enqueue_style(
		'rarc-theme-styles',
		get_theme_file_uri( 'assets/css/theme.css' ),
		array( 'rarc-theme-fonts' ),
		$version
	);

	wp_enqueue_script(
		'rarc-theme-frontend',
		get_theme_file_uri( 'assets/js/frontend.js' ),
		array(),
		$version,
		true
	);
}
add_action( 'wp_enqueue_scripts', 'rarc_theme_assets' );

function rarc_theme_editor_assets() {
	if ( ! is_admin() ) {
		return;
	}

	if ( function_exists( 'wp_should_load_block_editor_scripts_and_styles' ) && ! wp_should_load_block_editor_scripts_and_styles() ) {
		return;
	}

	$version = rarc_theme_get_version();

	wp_enqueue_style(
		'rarc-theme-fonts',
		rarc_theme_fonts_url(),
		array(),
		null
	);

	wp_enqueue_style(
		'rarc-theme-editor-content',
		get_theme_file_uri( 'assets/css/theme.css' ),
		array( 'rarc-theme-fonts' ),
		$version
	);

	wp_enqueue_style(
		'rarc-theme-editor-styles',
		get_theme_file_uri( 'assets/css/editor.css' ),
		array( 'rarc-theme-editor-content' ),
		$version
	);
}
add_action( 'enqueue_block_assets', 'rarc_theme_editor_assets' );

function rarc_theme_register_pattern_categories() {
	$categories = array(
		'rarc-theme' => __( 'RARC Theme', 'rarc-theme' ),
	);

	foreach ( $categories as $slug => $label ) {
		register_block_pattern_category(
			$slug,
			array(
				'label' => $label,
			)
		);
	}
}
add_action( 'init', 'rarc_theme_register_pattern_categories' );

function rarc_theme_get_pattern_markup( $relative_path ) {
	static $cache = array();

	if ( isset( $cache[ $relative_path ] ) ) {
		return $cache[ $relative_path ];
	}

	$path = get_theme_file_path( $relative_path );
	if ( ! file_exists( $path ) ) {
		$cache[ $relative_path ] = '';
		return '';
	}

	ob_start();
	include $path;
	$cache[ $relative_path ] = trim( ob_get_clean() );

	return $cache[ $relative_path ];
}

function rarc_theme_home_hero_pattern_markup() {
	return rarc_theme_get_pattern_markup( 'patterns/home-hero.php' );
}

function rarc_theme_interior_hero_pattern_markup() {
	return rarc_theme_get_pattern_markup( 'patterns/interior-page-hero.php' );
}

function rarc_theme_default_page_content( $content, $post ) {
	if ( 'page' !== $post->post_type || '' !== trim( $content ) ) {
		return $content;
	}

	return rarc_theme_interior_hero_pattern_markup();
}
add_filter( 'default_content', 'rarc_theme_default_page_content', 10, 2 );

function rarc_theme_is_home_hero_block( $block ) {
	return 'rarc/hero-carousel' === ( $block['blockName'] ?? '' );
}

function rarc_theme_is_interior_hero_block( $block ) {
	if ( 'core/group' !== ( $block['blockName'] ?? '' ) ) {
		return false;
	}

	return false !== strpos( $block['attrs']['className'] ?? '', 'rarc-page-hero' );
}

function rarc_theme_is_hero_pattern_reference( $block ) {
	if ( 'core/pattern' !== ( $block['blockName'] ?? '' ) ) {
		return false;
	}

	return in_array( $block['attrs']['slug'] ?? '', array( 'rarc-theme/home-hero', 'rarc-theme/interior-page-hero' ), true );
}

function rarc_theme_sync_page_hero_pattern( $page_id ) {
	static $syncing = false;

	$page_id = (int) $page_id;
	if ( $syncing || ! $page_id ) {
		return;
	}

	if ( ! current_user_can( 'edit_post', $page_id ) ) {
		return;
	}

	$page = get_post( $page_id );
	if ( ! $page || 'page' !== $page->post_type ) {
		return;
	}

	$front_page_id = (int) get_option( 'page_on_front' );
	$is_front_page = $front_page_id && $front_page_id === $page_id;
	$content = $page->post_content;

	if ( '' === trim( $content ) ) {
		$desired_markup = $is_front_page ? rarc_theme_home_hero_pattern_markup() : rarc_theme_interior_hero_pattern_markup();

		$syncing = true;
		wp_update_post(
			array(
				'ID'           => $page_id,
				'post_content' => $desired_markup,
			)
		);
		$syncing = false;
		return;
	}

	$blocks = parse_blocks( $content );
	if ( empty( $blocks ) ) {
		return;
	}

	$first = $blocks[0];
	if ( $is_front_page && rarc_theme_is_home_hero_block( $first ) ) {
		return;
	}

	if ( ! $is_front_page && rarc_theme_is_interior_hero_block( $first ) ) {
		return;
	}

	$desired_markup = $is_front_page ? rarc_theme_home_hero_pattern_markup() : rarc_theme_interior_hero_pattern_markup();
	$desired_blocks = parse_blocks( $desired_markup );
	if ( empty( $desired_blocks ) ) {
		return;
	}

	if ( rarc_theme_is_home_hero_block( $first ) || rarc_theme_is_interior_hero_block( $first ) || rarc_theme_is_hero_pattern_reference( $first ) ) {
		$blocks[0] = $desired_blocks[0];
	} else {
		array_unshift( $blocks, $desired_blocks[0] );
	}

	$updated = '';
	foreach ( $blocks as $block ) {
		$updated .= serialize_block( $block );
	}

	$syncing = true;
	wp_update_post(
		array(
			'ID'           => $page_id,
			'post_content' => $updated,
		)
	);
	$syncing = false;
}

function rarc_theme_sync_front_page_content( $old_value, $value ) {
	$old_page_id = (int) $old_value;
	$page_id = (int) $value;

	if ( $old_page_id ) {
		rarc_theme_sync_page_hero_pattern( $old_page_id );
	}

	if ( $page_id ) {
		rarc_theme_sync_page_hero_pattern( $page_id );
	}
}
add_action( 'update_option_page_on_front', 'rarc_theme_sync_front_page_content', 10, 2 );

function rarc_theme_sync_current_front_page_content() {
	if ( ! current_user_can( 'edit_theme_options' ) ) {
		return;
	}

	$front_page_id = (int) get_option( 'page_on_front' );
	if ( $front_page_id ) {
		rarc_theme_sync_page_hero_pattern( $front_page_id );
	}
}
add_action( 'after_switch_theme', 'rarc_theme_sync_current_front_page_content' );

function rarc_theme_sync_saved_page_hero_pattern( $post_id, $post, $update ) {
	if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
		return;
	}

	if ( wp_is_post_revision( $post_id ) || wp_is_post_autosave( $post_id ) || 'page' !== $post->post_type ) {
		return;
	}

	rarc_theme_sync_page_hero_pattern( $post_id );
}
add_action( 'save_post_page', 'rarc_theme_sync_saved_page_hero_pattern', 10, 3 );

function rarc_theme_register_blocks() {
	$version = rarc_theme_get_version();

	wp_register_script(
		'rarc-theme-blocks',
		get_theme_file_uri( 'assets/js/blocks.js' ),
		array( 'wp-blocks', 'wp-block-editor', 'wp-components', 'wp-data', 'wp-element', 'wp-i18n' ),
		$version,
		true
	);

	register_block_type(
		'rarc/card-grid',
		array(
			'api_version'   => 2,
			'editor_script' => 'rarc-theme-blocks',
		)
	);

	register_block_type(
		'rarc/card',
		array(
			'api_version'   => 2,
			'editor_script' => 'rarc-theme-blocks',
			'render_callback' => 'rarc_theme_render_card_block',
			'attributes'    => array(
				'variant'     => array( 'type' => 'string', 'default' => 'image' ),
				'eyebrow'     => array( 'type' => 'string', 'default' => '' ),
				'title'       => array( 'type' => 'string', 'default' => '' ),
				'subheadline' => array( 'type' => 'string', 'default' => '' ),
				'meta'        => array( 'type' => 'string', 'default' => '' ),
				'text'        => array( 'type' => 'string', 'default' => '' ),
				'imageUrl'    => array( 'type' => 'string', 'default' => '' ),
				'imageAlt'    => array( 'type' => 'string', 'default' => '' ),
				'credit'      => array( 'type' => 'string', 'default' => '' ),
				'linkText'    => array( 'type' => 'string', 'default' => '' ),
				'linkUrl'     => array( 'type' => 'string', 'default' => '' ),
				'buttonStyle' => array( 'type' => 'string', 'default' => 'primary' ),
				'actions'     => array(
					'type'    => 'array',
					'default' => array(),
					'items'   => array( 'type' => 'object' ),
				),
			)
		)
	);

	register_block_type(
		'rarc/carousel',
		array(
			'api_version'   => 2,
			'editor_script' => 'rarc-theme-blocks',
			'render_callback' => 'rarc_theme_render_carousel_block',
			'attributes'    => array(
				'variant'     => array( 'type' => 'string', 'default' => 'full' ),
				'eyebrow'     => array( 'type' => 'string', 'default' => '' ),
				'heading'     => array( 'type' => 'string', 'default' => '' ),
				'intro'       => array( 'type' => 'string', 'default' => '' ),
				'bodyHeading' => array( 'type' => 'string', 'default' => '' ),
				'bodyText'    => array( 'type' => 'string', 'default' => '' ),
				'slides'      => array(
					'type'    => 'array',
					'default' => array(),
					'items'   => array( 'type' => 'object' ),
				),
			)
		)
	);

	register_block_type(
		'rarc/hero-carousel',
		array(
			'api_version'   => 2,
			'editor_script' => 'rarc-theme-blocks',
			'render_callback' => 'rarc_theme_render_hero_block',
			'supports'      => array(
				'align' => array( 'full' ),
			),
			'attributes'    => array(
				'align'          => array( 'type' => 'string', 'default' => 'full' ),
				'anchor'         => array( 'type' => 'string', 'default' => 'top' ),
				'eyebrow'        => array( 'type' => 'string', 'default' => '' ),
				'heading'        => array( 'type' => 'string', 'default' => '' ),
				'lede'           => array( 'type' => 'string', 'default' => '' ),
				'primaryLabel'   => array( 'type' => 'string', 'default' => '' ),
				'primaryUrl'     => array( 'type' => 'string', 'default' => '' ),
				'secondaryLabel' => array( 'type' => 'string', 'default' => '' ),
				'secondaryUrl'   => array( 'type' => 'string', 'default' => '' ),
				'actions'        => array(
					'type'    => 'array',
					'default' => array(),
					'items'   => array( 'type' => 'object' ),
				),
				'slides'         => array(
					'type'    => 'array',
					'default' => array(),
					'items'   => array( 'type' => 'object' ),
				),
			)
		)
	);

	register_block_type(
		'rarc/info-list',
		array(
			'api_version'   => 2,
			'editor_script' => 'rarc-theme-blocks',
			'render_callback' => 'rarc_theme_render_info_list_block',
			'attributes'    => array(
				'rows' => array(
					'type'    => 'array',
					'default' => array(),
					'items'   => array( 'type' => 'object' ),
				),
			)
		)
	);

	register_block_type(
		'rarc/info-row',
		array(
			'api_version'   => 2,
			'editor_script' => 'rarc-theme-blocks',
			'render_callback' => 'rarc_theme_render_info_row_block',
			'attributes'    => array(
				'label'   => array( 'type' => 'string', 'default' => '' ),
				'content' => array( 'type' => 'string', 'default' => '' ),
			)
		)
	);

	register_block_type(
		'rarc/sidebar-card',
		array(
			'api_version'   => 2,
			'editor_script' => 'rarc-theme-blocks',
			'render_callback' => 'rarc_theme_render_sidebar_card_block',
			'attributes'    => array(
				'title'      => array( 'type' => 'string', 'default' => '' ),
				'text'       => array( 'type' => 'string', 'default' => '' ),
				'buttonText' => array( 'type' => 'string', 'default' => '' ),
				'buttonUrl'  => array( 'type' => 'string', 'default' => '' ),
				'isShare'    => array( 'type' => 'boolean', 'default' => false ),
				'shareNote'  => array( 'type' => 'string', 'default' => '' ),
			)
		)
	);

	register_block_type(
		'rarc/story-preview',
		array(
			'api_version'     => 2,
			'editor_script'   => 'rarc-theme-blocks',
			'render_callback' => 'rarc_theme_render_story_preview_block',
			'attributes'      => array(
				'ctaLabel'  => array( 'type' => 'string', 'default' => 'Read story' ),
				'showImage' => array( 'type' => 'boolean', 'default' => true ),
			)
		)
	);
}
add_action( 'init', 'rarc_theme_register_blocks' );

function rarc_theme_get_cta_variant_class( $variant ) {
	$allowed = array( 'primary', 'outline', 'inline', 'share' );

	if ( ! in_array( $variant, $allowed, true ) ) {
		$variant = 'primary';
	}

	return 'rarc-cta--' . $variant;
}

function rarc_theme_get_cta_icon_svg( $icon_type ) {
	$icons = array(
		'arrow' =>
			'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>',
		'external' =>
			'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>',
		'lock' =>
			'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>',
		'share' =>
			'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>',
	);

	return $icons[ $icon_type ] ?? $icons['arrow'];
}

function rarc_theme_get_cta_icon_type( $url ) {
	if ( empty( $url ) ) {
		return 'arrow';
	}

	$host = wp_parse_url( $url, PHP_URL_HOST );

	if ( empty( $host ) ) {
		return 'arrow';
	}

	$internal_patterns = array(
		'rarc.club',
		'richmondarearc',
		'localhost',
	);

	$locked_patterns = array(
		'members.',
		'login.',
		'secure.',
		'portal.',
	);

	foreach ( $locked_patterns as $pattern ) {
		if ( str_contains( $host, $pattern ) ) {
			return 'lock';
		}
	}

	foreach ( $internal_patterns as $pattern ) {
		if ( str_contains( $host, $pattern ) ) {
			return 'arrow';
		}
	}

	return 'external';
}

function rarc_theme_render_cta( $args = array() ) {
	$args = wp_parse_args(
		$args,
		array(
			'tag'         => 'a',
			'text'        => '',
			'url'         => '',
			'variant'     => 'primary',
			'class_name'  => '',
			'type'        => 'button',
			'show_icon'   => false,
			'icon_type'   => 'auto',
			'attributes'  => array(),
		)
	);

	if ( '' === trim( $args['text'] ) ) {
		return '';
	}

	$tag = 'button' === $args['tag'] ? 'button' : 'a';
	$attributes = array(
		'class' => trim( 'rarc-cta ' . rarc_theme_get_cta_variant_class( $args['variant'] ) . ' ' . $args['class_name'] ),
	);

	if ( 'button' === $tag ) {
		$attributes['type'] = $args['type'];
	} else {
		if ( empty( $args['url'] ) ) {
			return '';
		}

		$attributes['href'] = $args['url'];
	}

	foreach ( $args['attributes'] as $name => $value ) {
		if ( '' === $value || null === $value ) {
			continue;
		}

		$attributes[ $name ] = $value;
	}

	$parts = array();
	foreach ( $attributes as $name => $value ) {
		if ( 'href' === $name ) {
			$parts[] = 'href="' . esc_url( $value ) . '"';
			continue;
		}

		$parts[] = esc_attr( $name ) . '="' . esc_attr( $value ) . '"';
	}

	if ( ! empty( $args['show_icon'] ) ) {
		$icon_type = ( 'auto' === $args['icon_type'] ) ? rarc_theme_get_cta_icon_type( $args['url'] ) : $args['icon_type'];
		$icon_markup = rarc_theme_get_cta_icon_svg( $icon_type );
	} else {
		$icon_markup = '';
	}

	$markup  = '<' . $tag . ' ' . implode( ' ', $parts ) . '>';
	$markup .= '<span class="rarc-cta__label">' . esc_html( $args['text'] ) . '</span>';

	if ( ! empty( $icon_markup ) ) {
		$markup .= '<span class="rarc-cta__icon" aria-hidden="true">' . $icon_markup . '</span>';
	}

	$markup .= '</' . $tag . '>';

	return $markup;
}

function rarc_theme_render_card_block( $attributes ) {
	$variant = sanitize_html_class( $attributes['variant'] ?? 'image' );
	$has_link = ! empty( $attributes['linkUrl'] );
	$link_url = $has_link ? esc_url( $attributes['linkUrl'] ) : '';
	$actions = array();

	if ( ! empty( $attributes['actions'] ) && is_array( $attributes['actions'] ) ) {
		foreach ( $attributes['actions'] as $action ) {
			if ( empty( $action['text'] ) || empty( $action['url'] ) ) {
				continue;
			}

			$actions[] = array(
				'text'    => $action['text'],
				'url'     => $action['url'],
				'variant' => $action['variant'] ?? 'primary',
			);
		}
	}

	if ( empty( $actions ) && $has_link && ! empty( $attributes['linkText'] ) ) {
		$actions[] = array(
			'text'    => $attributes['linkText'],
			'url'     => $attributes['linkUrl'],
			'variant' => $attributes['buttonStyle'] ?? 'primary',
		);
	}

	$image = empty( $attributes['imageUrl'] ) ? '' : sprintf(
		'<div class="rarc-card__image"><img src="%1$s" alt="%2$s" />%3$s</div>',
		esc_url( $attributes['imageUrl'] ),
		esc_attr( $attributes['imageAlt'] ?? '' ),
		empty( $attributes['credit'] ) ? '' : '<span class="rarc-card-credit">' . esc_html( $attributes['credit'] ) . '</span>'
	);

	if ( empty( $image ) && in_array( $variant, array( 'image', 'story', 'horizontal' ), true ) ) {
		$image = '<div class="rarc-card__image rarc-card__image--placeholder"><span class="rarc-card-placeholder">Add card image</span></div>';
	}

	$eyebrow = empty( $attributes['eyebrow'] ) ? '' : '<div class="rarc-eyebrow">' . esc_html( $attributes['eyebrow'] ) . '</div>';
	$meta = empty( $attributes['meta'] ) ? '' : '<div class="rarc-card-meta">' . esc_html( $attributes['meta'] ) . '</div>';
	$title = empty( $attributes['title'] ) ? '' : '<h3>' . esc_html( $attributes['title'] ) . '</h3>';
	$subheadline = empty( $attributes['subheadline'] ) ? '' : '<p class="rarc-card-subheadline">' . esc_html( $attributes['subheadline'] ) . '</p>';

	$header_content = trim( $meta . $eyebrow . $title . $subheadline );

	if ( $has_link && ! empty( $header_content ) ) {
		$header = '<a class="rarc-card__header-link" href="' . $link_url . '">' . $header_content . '</a>';
	} elseif ( ! empty( $header_content ) ) {
		$header = '<div class="rarc-card__header">' . $header_content . '</div>';
	} else {
		$header = '';
	}

	$body_text = empty( $attributes['text'] ) ? '' : '<p>' . wp_kses_post( $attributes['text'] ) . '</p>';

	$button = '';
	if ( ! empty( $actions ) ) {
		$button = '<div class="rarc-card__actions">';

		foreach ( $actions as $action ) {
			$button .= rarc_theme_render_cta(
				array(
					'text'       => $action['text'],
					'url'        => $action['url'],
					'variant'    => $action['variant'],
					'show_icon'  => true,
					'icon_type'  => 'auto',
					'class_name' => 'rarc-card-cta',
				)
			);
		}

		$button .= '</div>';
	}

	$markup  = '<article class="wp-block-rarc-card rarc-card rarc-card--' . esc_attr( $variant ) . '">';
	$markup .= $image;
	$markup .= '<div class="rarc-card__content">';
	$markup .= $header;
	$markup .= empty( $body_text ) ? '' : $body_text;
	$markup .= $button;
	$markup .= '</div></article>';

	return $markup;
}

function rarc_theme_render_carousel_slides( $slides ) {
	if ( empty( $slides ) || ! is_array( $slides ) ) {
		return '';
	}

	$markup = '';
	foreach ( $slides as $index => $slide ) {
		if ( empty( $slide['imageUrl'] ) ) {
			continue;
		}

		$active = 0 === $index ? ' is-active' : '';
		$markup .= '<figure class="rarc-slide' . esc_attr( $active ) . '">';
		$markup .= '<img src="' . esc_url( $slide['imageUrl'] ) . '" alt="' . esc_attr( $slide['alt'] ?? '' ) . '" />';
		$markup .= '<figcaption class="rarc-slide-caption">';
		$markup .= empty( $slide['title'] ) ? '' : '<strong>' . esc_html( $slide['title'] ) . '</strong>';
		$markup .= empty( $slide['caption'] ) ? '' : '<span>' . esc_html( $slide['caption'] ) . '</span>';
		$markup .= '</figcaption></figure>';
	}

	return $markup;
}

function rarc_theme_render_carousel_block( $attributes ) {
	$slides = $attributes['slides'] ?? array();
	if ( empty( $slides ) ) {
		return '';
	}

	$variant = $attributes['variant'] ?? 'full';
	$wrapper = 'wp-block-rarc-carousel rarc-carousel-block rarc-carousel-block--' . sanitize_html_class( $variant );

	ob_start();
	?>
	<div class="<?php echo esc_attr( $wrapper ); ?>" data-rarc-carousel>
		<?php if ( 'full' === $variant && ( ! empty( $attributes['eyebrow'] ) || ! empty( $attributes['heading'] ) || ! empty( $attributes['intro'] ) ) ) : ?>
			<div class="rarc-section-head">
				<div>
					<?php if ( ! empty( $attributes['eyebrow'] ) ) : ?>
						<div class="rarc-eyebrow"><?php echo esc_html( $attributes['eyebrow'] ); ?></div>
					<?php endif; ?>
					<?php if ( ! empty( $attributes['heading'] ) ) : ?>
						<h2><?php echo esc_html( $attributes['heading'] ); ?></h2>
					<?php endif; ?>
				</div>
				<?php if ( ! empty( $attributes['intro'] ) ) : ?>
					<p><?php echo wp_kses_post( $attributes['intro'] ); ?></p>
				<?php endif; ?>
			</div>
		<?php endif; ?>

		<div class="rarc-carousel<?php echo 'card' === $variant ? ' rarc-carousel-card' : ''; ?>" aria-label="<?php esc_attr_e( 'Image carousel', 'rarc-theme' ); ?>">
			<div class="rarc-carousel-stage">
				<?php echo rarc_theme_render_carousel_slides( $slides ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
				<div class="rarc-carousel-buttons">
					<button class="rarc-carousel-btn" type="button" data-rarc-carousel-prev aria-label="<?php esc_attr_e( 'Previous image', 'rarc-theme' ); ?>">&#8249;</button>
					<button class="rarc-carousel-btn" type="button" data-rarc-carousel-next aria-label="<?php esc_attr_e( 'Next image', 'rarc-theme' ); ?>">&#8250;</button>
				</div>
			</div>
			<div class="rarc-carousel-controls">
				<span class="rarc-carousel-status" aria-live="polite"><?php printf( esc_html__( 'Image 1 of %d', 'rarc-theme' ), count( $slides ) ); ?></span>
				<div class="rarc-thumb-row" aria-label="<?php esc_attr_e( 'Choose carousel image', 'rarc-theme' ); ?>"></div>
			</div>
		</div>

		<?php if ( 'card' === $variant && ( ! empty( $attributes['eyebrow'] ) || ! empty( $attributes['bodyHeading'] ) || ! empty( $attributes['bodyText'] ) ) ) : ?>
			<div class="rarc-carousel-card-body">
				<?php if ( ! empty( $attributes['eyebrow'] ) ) : ?>
					<div class="rarc-eyebrow"><?php echo esc_html( $attributes['eyebrow'] ); ?></div>
				<?php endif; ?>
				<?php if ( ! empty( $attributes['bodyHeading'] ) ) : ?>
					<h3><?php echo esc_html( $attributes['bodyHeading'] ); ?></h3>
				<?php endif; ?>
				<?php if ( ! empty( $attributes['bodyText'] ) ) : ?>
					<p><?php echo wp_kses_post( $attributes['bodyText'] ); ?></p>
				<?php endif; ?>
			</div>
		<?php endif; ?>
	</div>
	<?php
	return ob_get_clean();
}

function rarc_theme_render_hero_block( $attributes ) {
	$slides = $attributes['slides'] ?? array();
	if ( empty( $slides ) ) {
		return '';
	}

	$actions = array();

	if ( ! empty( $attributes['actions'] ) && is_array( $attributes['actions'] ) ) {
		foreach ( $attributes['actions'] as $action ) {
			if ( empty( $action['text'] ) || empty( $action['url'] ) ) {
				continue;
			}

			$actions[] = array(
				'text'    => $action['text'],
				'url'     => $action['url'],
				'variant' => $action['variant'] ?? 'primary',
			);
		}
	}

	if ( empty( $actions ) ) {
		if ( ! empty( $attributes['primaryLabel'] ) && ! empty( $attributes['primaryUrl'] ) ) {
			$actions[] = array(
				'text'    => $attributes['primaryLabel'],
				'url'     => $attributes['primaryUrl'],
				'variant' => 'primary',
			);
		}

		if ( ! empty( $attributes['secondaryLabel'] ) && ! empty( $attributes['secondaryUrl'] ) ) {
			$actions[] = array(
				'text'    => $attributes['secondaryLabel'],
				'url'     => $attributes['secondaryUrl'],
				'variant' => 'outline',
			);
		}
	}

	$anchor = empty( $attributes['anchor'] ) ? '' : ' id="' . esc_attr( sanitize_title( $attributes['anchor'] ) ) . '"';
	$align  = empty( $attributes['align'] ) ? 'alignfull' : 'align' . sanitize_html_class( $attributes['align'] );

	ob_start();
	?>
	<section class="wp-block-rarc-hero-carousel rarc-hero <?php echo esc_attr( $align ); ?>"<?php echo $anchor; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?> data-rarc-hero>
		<div class="rarc-hero-bg" data-rarc-hero-carousel aria-label="<?php esc_attr_e( 'Featured RC aircraft photography', 'rarc-theme' ); ?>">
			<?php foreach ( $slides as $index => $slide ) : ?>
				<?php if ( empty( $slide['imageUrl'] ) ) { continue; } ?>
				<div class="rarc-hero-slide<?php echo 0 === $index ? ' is-active' : ''; ?>" style="--hero-image:url('<?php echo esc_url( $slide['imageUrl'] ); ?>');" data-credit="<?php echo esc_attr( $slide['credit'] ?? '' ); ?>"></div>
			<?php endforeach; ?>
			<div class="rarc-hero-credit" aria-live="polite"><?php echo esc_html( $slides[0]['credit'] ?? '' ); ?></div>
		</div>
		<div class="wp-block-group alignwide rarc-hero-grid">
			<div class="rarc-hero-copy">
				<?php if ( ! empty( $attributes['eyebrow'] ) ) : ?>
					<div class="rarc-eyebrow"><?php echo esc_html( $attributes['eyebrow'] ); ?></div>
				<?php endif; ?>
				<?php if ( ! empty( $attributes['heading'] ) ) : ?>
					<h1><?php echo esc_html( $attributes['heading'] ); ?></h1>
				<?php endif; ?>
				<?php if ( ! empty( $attributes['lede'] ) ) : ?>
					<p class="rarc-lede"><?php echo wp_kses_post( $attributes['lede'] ); ?></p>
				<?php endif; ?>
				<?php if ( ! empty( $actions ) ) : ?>
				<div class="rarc-actions">
					<?php foreach ( $actions as $action ) : ?>
						<?php echo rarc_theme_render_cta( array( 'text' => $action['text'], 'url' => $action['url'], 'variant' => $action['variant'], 'show_icon' => true, 'icon_type' => 'auto', 'class_name' => 'rarc-hero-cta' ) ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
					<?php endforeach; ?>
				</div>
				<?php endif; ?>
				<div class="rarc-hero-footer">
					<button class="rarc-hero-pause" type="button" data-rarc-hero-pause aria-pressed="false" aria-label="<?php esc_attr_e( 'Pause rotating hero field photos', 'rarc-theme' ); ?>" aria-describedby="rarc-hero-pause-desc">
						<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9.6" fill="none" stroke="currentColor" stroke-width="1.5"></circle><path d="M9.8 8.9v6.2M14.2 8.9v6.2" fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="1.8"></path></svg>
					</button>
					<span id="rarc-hero-pause-desc" class="screen-reader-text"><?php esc_html_e( 'Pauses or resumes the automatic rotation of the hero field photos.', 'rarc-theme' ); ?></span>
					<span class="rarc-carousel-announce" aria-live="polite"><?php printf( esc_html__( 'Hero image 1 of %d', 'rarc-theme' ), count( $slides ) ); ?></span>
				</div>
			</div>
		</div>
	</section>
	<?php
	return ob_get_clean();
}

function rarc_theme_render_info_list_block( $attributes ) {
	$rows = ! empty( $attributes['rows'] ) && is_array( $attributes['rows'] ) ? $attributes['rows'] : array();

	if ( empty( $rows ) ) {
		return '';
	}

	$markup = '<div class="wp-block-rarc-info-list alignwide rarc-info-list">';

	foreach ( $rows as $row ) {
		$label = $row['label'] ?? '';
		$content = $row['content'] ?? '';

		if ( '' === trim( $label ) && '' === trim( wp_strip_all_tags( $content ) ) ) {
			continue;
		}

		$markup .= '<div class="rarc-info-item">';
		$markup .= '<p><strong>' . esc_html( $label ) . '</strong></p>';
		$markup .= '<p><span>' . wp_kses_post( $content ) . '</span></p>';
		$markup .= '</div>';
	}

	$markup .= '</div>';

	return $markup;
}

function rarc_theme_render_info_row_block( $attributes ) {
	if ( empty( $attributes['label'] ) && empty( $attributes['content'] ) ) {
		return '';
	}

	$markup  = '<div class="wp-block-rarc-info-row rarc-info-item">';
	$markup .= '<p><strong>' . esc_html( $attributes['label'] ?? '' ) . '</strong></p>';
	$markup .= '<p><span>' . wp_kses_post( $attributes['content'] ?? '' ) . '</span></p>';
	$markup .= '</div>';

	return $markup;
}

function rarc_theme_render_sidebar_card_block( $attributes ) {
	if ( empty( $attributes['title'] ) && empty( $attributes['text'] ) ) {
		return '';
	}

	$markup  = '<div class="wp-block-rarc-sidebar-card rarc-sidebar-card">';
	$markup .= '<p><strong>' . esc_html( $attributes['title'] ?? '' ) . '</strong></p>';
	$markup .= empty( $attributes['text'] ) ? '' : '<p>' . wp_kses_post( $attributes['text'] ) . '</p>';

	if ( ! empty( $attributes['buttonText'] ) ) {
		if ( ! empty( $attributes['isShare'] ) ) {
			$markup .= rarc_theme_render_cta(
				array(
					'tag'        => 'button',
					'text'       => $attributes['buttonText'],
					'variant'    => 'share',
					'class_name' => 'rarc-share-button',
					'show_icon'  => true,
				)
			);
			$markup .= '<p class="rarc-share-note">' . esc_html( $attributes['shareNote'] ?: __( 'Ready to share Richmond Area RC.', 'rarc-theme' ) ) . '</p>';
		} elseif ( ! empty( $attributes['buttonUrl'] ) ) {
			$markup .= rarc_theme_render_cta(
				array(
					'text'       => $attributes['buttonText'],
					'url'        => $attributes['buttonUrl'],
					'variant'    => 'outline',
					'show_icon'  => true,
					'icon_type'  => 'auto',
					'class_name' => 'rarc-sidebar-cta',
				)
			);
		}
	}

	$markup .= '</div>';

	return $markup;
}

function rarc_theme_render_story_preview_block( $attributes ) {
	$post_id = get_the_ID();

	if ( ! $post_id ) {
		return '';
	}

	$title = get_the_title( $post_id );
	$permalink = get_permalink( $post_id );
	$excerpt = get_the_excerpt( $post_id );
	$cta_label = empty( $attributes['ctaLabel'] ) ? __( 'Read story', 'rarc-theme' ) : $attributes['ctaLabel'];
	$show_image = ! isset( $attributes['showImage'] ) || ! empty( $attributes['showImage'] );
	$image = '';
	$date = esc_html( get_the_date( '', $post_id ) );

	if ( $show_image && has_post_thumbnail( $post_id ) ) {
		$image = '<div class="rarc-card__image">' . get_the_post_thumbnail( $post_id, 'large' ) . '</div>';
	}

	$header = '<a class="rarc-card__header-link" href="' . esc_url( $permalink ) . '">';
	$header .= '<div class="rarc-card-meta">' . $date . '</div>';
	$header .= '<h3>' . esc_html( $title ) . '</h3>';
	$header .= '</a>';

	$markup  = '<article class="wp-block-rarc-story-preview rarc-card rarc-card--story rarc-story-preview">';
	$markup .= $image;
	$markup .= '<div class="rarc-card__content">';
	$markup .= $header;
	$markup .= empty( $excerpt ) ? '' : '<p>' . esc_html( $excerpt ) . '</p>';
	$markup .= rarc_theme_render_cta(
		array(
			'text'       => $cta_label,
			'url'        => $permalink,
			'variant'    => 'inline',
			'icon_type'  => 'auto',
			'show_icon'  => true,
			'class_name' => 'rarc-story-preview__cta',
		)
	);
	$markup .= '</div></article>';

	return $markup;
}

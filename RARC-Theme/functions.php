<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function rarc_theme_setup() {
	add_theme_support( 'wp-block-styles' );
	add_theme_support( 'responsive-embeds' );
	add_theme_support( 'editor-styles' );
	add_theme_support(
		'custom-logo',
		array(
			'height'      => 163,
			'width'       => 300,
			'flex-height' => true,
			'flex-width'  => true,
		)
	);
	add_editor_style( 'assets/css/editor.css' );
}
add_action( 'after_setup_theme', 'rarc_theme_setup' );

function rarc_theme_default_logo_markup() {
	return sprintf(
		'<a href="%1$s" class="custom-logo-link" rel="home"><img src="%2$s" class="custom-logo" alt="%3$s" /></a>',
		esc_url( home_url( '/' ) ),
		esc_url( get_theme_file_uri( 'assets/images/rarc-logo.jpg' ) ),
		esc_attr__( 'Richmond Area Remote Control Club', 'rarc-theme' )
	);
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

function rarc_theme_assets() {
	$version = wp_get_theme()->get( 'Version' );

	wp_enqueue_style(
		'rarc-theme-styles',
		get_theme_file_uri( 'assets/css/theme.css' ),
		array(),
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

function rarc_theme_register_pattern_categories() {
	$categories = array(
		'rarc-theme' => __( 'RARC Theme', 'rarc-theme' ),
		'rarc-home-sections' => __( 'RARC Home Sections', 'rarc-theme' ),
		'rarc-interior-sections' => __( 'RARC Interior Sections', 'rarc-theme' ),
		'rarc-utility-sections' => __( 'RARC Utility Sections', 'rarc-theme' ),
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

function rarc_theme_configure_page_templates() {
	$page_type = get_post_type_object( 'page' );

	if ( ! $page_type ) {
		return;
	}

	$page_type->template = array(
		array(
			'core/pattern',
			array(
				'slug' => 'rarc-theme/interior-page-hero',
			)
		),
		array(
			'core/pattern',
			array(
				'slug' => 'rarc-theme/interior-post-content',
			)
		),
	);
}
add_action( 'init', 'rarc_theme_configure_page_templates' );

function rarc_theme_register_blocks() {
	$version = wp_get_theme()->get( 'Version' );

	wp_register_script(
		'rarc-theme-blocks',
		get_theme_file_uri( 'assets/js/blocks.js' ),
		array( 'wp-blocks', 'wp-block-editor', 'wp-components', 'wp-element', 'wp-i18n' ),
		$version,
		true
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
			'attributes'    => array(
				'anchor'         => array( 'type' => 'string', 'default' => 'top' ),
				'eyebrow'        => array( 'type' => 'string', 'default' => '' ),
				'heading'        => array( 'type' => 'string', 'default' => '' ),
				'lede'           => array( 'type' => 'string', 'default' => '' ),
				'primaryLabel'   => array( 'type' => 'string', 'default' => '' ),
				'primaryUrl'     => array( 'type' => 'string', 'default' => '' ),
				'secondaryLabel' => array( 'type' => 'string', 'default' => '' ),
				'secondaryUrl'   => array( 'type' => 'string', 'default' => '' ),
				'slides'         => array(
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

	$markup  = '<' . $tag . ' ' . implode( ' ', $parts ) . '>';
	$markup .= '<span class="rarc-cta__label">' . esc_html( $args['text'] ) . '</span>';

	if ( ! empty( $args['show_icon'] ) ) {
		$markup .= '<span class="rarc-cta__icon" aria-hidden="true">&rarr;</span>';
	}

	$markup .= '</' . $tag . '>';

	return $markup;
}

function rarc_theme_render_card_block( $attributes ) {
	$variant = sanitize_html_class( $attributes['variant'] ?? 'image' );
	$image = empty( $attributes['imageUrl'] ) ? '' : sprintf(
		'<div class="rarc-card-media"><img src="%1$s" alt="%2$s" />%3$s</div>',
		esc_url( $attributes['imageUrl'] ),
		esc_attr( $attributes['imageAlt'] ?? '' ),
		empty( $attributes['credit'] ) ? '' : '<span class="rarc-card-credit">' . esc_html( $attributes['credit'] ) . '</span>'
	);

	if ( empty( $image ) && in_array( $variant, array( 'image', 'story', 'horizontal' ), true ) ) {
		$image = '<div class="rarc-card-media rarc-card-media--placeholder"><span class="rarc-card-placeholder">Add card image</span></div>';
	}

	$button = '';
	if ( ! empty( $attributes['linkText'] ) && ! empty( $attributes['linkUrl'] ) ) {
		$button = rarc_theme_render_cta(
			array(
				'text'       => $attributes['linkText'],
				'url'        => $attributes['linkUrl'],
				'variant'    => $attributes['buttonStyle'] ?? 'primary',
				'class_name' => 'rarc-card-cta',
			)
		);
	}

	$markup  = '<article class="wp-block-rarc-card rarc-card rarc-card--' . esc_attr( $variant ) . '">';
	$markup .= $image;
	$markup .= '<div class="rarc-card-body">';
	$markup .= empty( $attributes['meta'] ) ? '' : '<div class="rarc-card-meta">' . esc_html( $attributes['meta'] ) . '</div>';
	$markup .= empty( $attributes['eyebrow'] ) ? '' : '<div class="rarc-eyebrow">' . esc_html( $attributes['eyebrow'] ) . '</div>';
	$markup .= empty( $attributes['title'] ) ? '' : '<h3>' . esc_html( $attributes['title'] ) . '</h3>';
	$markup .= empty( $attributes['subheadline'] ) ? '' : '<p class="rarc-card-subheadline">' . esc_html( $attributes['subheadline'] ) . '</p>';
	$markup .= empty( $attributes['text'] ) ? '' : '<p>' . wp_kses_post( $attributes['text'] ) . '</p>';
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

	$anchor = empty( $attributes['anchor'] ) ? '' : ' id="' . esc_attr( sanitize_title( $attributes['anchor'] ) ) . '"';

	ob_start();
	?>
	<section class="wp-block-rarc-hero-carousel rarc-hero"<?php echo $anchor; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?> data-rarc-hero>
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
				<div class="rarc-actions">
				<?php if ( ! empty( $attributes['primaryLabel'] ) && ! empty( $attributes['primaryUrl'] ) ) : ?>
					<?php echo rarc_theme_render_cta( array( 'text' => $attributes['primaryLabel'], 'url' => $attributes['primaryUrl'], 'variant' => 'primary', 'class_name' => 'rarc-hero-cta' ) ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
				<?php endif; ?>
				<?php if ( ! empty( $attributes['secondaryLabel'] ) && ! empty( $attributes['secondaryUrl'] ) ) : ?>
					<?php echo rarc_theme_render_cta( array( 'text' => $attributes['secondaryLabel'], 'url' => $attributes['secondaryUrl'], 'variant' => 'outline', 'class_name' => 'rarc-hero-cta' ) ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
				<?php endif; ?>
			</div>
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

	if ( $show_image && has_post_thumbnail( $post_id ) ) {
		$image = '<div class="rarc-card-media">' . get_the_post_thumbnail( $post_id, 'large' ) . '</div>';
	}

	$markup  = '<article class="wp-block-rarc-story-preview rarc-card rarc-card--story rarc-story-preview">';
	$markup .= $image;
	$markup .= '<div class="rarc-card-body">';
	$markup .= '<div class="rarc-card-meta">' . esc_html( get_the_date( '', $post_id ) ) . '</div>';
	$markup .= '<h3><a class="rarc-story-preview__title" href="' . esc_url( $permalink ) . '">' . esc_html( $title ) . '</a></h3>';
	$markup .= empty( $excerpt ) ? '' : '<p>' . esc_html( $excerpt ) . '</p>';
	$markup .= rarc_theme_render_cta(
		array(
			'text'       => $cta_label,
			'url'        => $permalink,
			'variant'    => 'inline',
			'class_name' => 'rarc-story-preview__cta',
			'show_icon'  => true,
		)
	);
	$markup .= '</div></article>';

	return $markup;
}

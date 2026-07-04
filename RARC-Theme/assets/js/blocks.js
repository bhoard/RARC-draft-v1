( function ( blocks, element, blockEditor, components, i18n ) {
	var el = element.createElement;
	var Fragment = element.Fragment;
	var useBlockProps = blockEditor.useBlockProps;
	var MediaUpload = blockEditor.MediaUpload;
	var MediaUploadCheck = blockEditor.MediaUploadCheck;
	var InspectorControls = blockEditor.InspectorControls;
	var RichText = blockEditor.RichText;
	var PlainText = blockEditor.PlainText;
	var PanelBody = components.PanelBody;
	var Button = components.Button;
	var TextControl = components.TextControl;
	var TextareaControl = components.TextareaControl;
	var SelectControl = components.SelectControl;
	var BaseControl = components.BaseControl;
	var __ = i18n.__;

	function updateSlide( slides, index, key, value ) {
		return slides.map( function ( slide, slideIndex ) {
			if ( slideIndex !== index ) {
				return slide;
			}

			var next = {};
			Object.keys( slide ).forEach( function ( slideKey ) {
				next[ slideKey ] = slide[ slideKey ];
			} );
			next[ key ] = value;
			return next;
		} );
	}

	function removeSlide( slides, index ) {
		return slides.filter( function ( _, slideIndex ) {
			return slideIndex !== index;
		} );
	}

	function addSlide( slides, fields ) {
		return slides.concat( [ fields ] );
	}

	function ctaPreviewField( options ) {
		return el(
			'div',
			{ className: 'rarc-cta ' + options.variant + ' rarc-editor-cta' + ( options.className ? ' ' + options.className : '' ) },
			el( PlainText, {
				placeholder: options.placeholder,
				value: options.value || '',
				onChange: options.onChange
			} ),
			options.showIcon ? el( 'span', { className: 'rarc-cta__icon', 'aria-hidden': 'true' }, '->' ) : null
		);
	}

	function slideEditor( slides, setAttributes, imageFields ) {
		return slides.map( function ( slide, index ) {
			return el(
				PanelBody,
				{ key: 'slide-' + index, title: __( 'Slide', 'rarc-theme' ) + ' ' + ( index + 1 ), initialOpen: 0 === index },
				el( TextControl, {
					label: __( 'Title', 'rarc-theme' ),
					value: slide.title || '',
					onChange: function ( value ) {
						setAttributes( { slides: updateSlide( slides, index, 'title', value ) } );
					}
				} ),
				el( TextareaControl, {
					label: __( 'Caption', 'rarc-theme' ),
					value: slide.caption || '',
					onChange: function ( value ) {
						setAttributes( { slides: updateSlide( slides, index, 'caption', value ) } );
					}
				} ),
				imageFields( slide, index ),
				el( Button, {
					isDestructive: true,
					onClick: function () {
						setAttributes( { slides: removeSlide( slides, index ) } );
					}
				}, __( 'Remove Slide', 'rarc-theme' ) )
			);
		} );
	}

	blocks.registerBlockType( 'rarc/card', {
		apiVersion: 2,
		title: __( 'RARC Card', 'rarc-theme' ),
		icon: 'format-image',
		category: 'design',
		attributes: {
			variant: { type: 'string', default: 'image' },
			eyebrow: { type: 'string', default: '' },
			title: { type: 'string', default: '' },
			subheadline: { type: 'string', default: '' },
			meta: { type: 'string', default: '' },
			text: { type: 'string', default: '' },
			imageUrl: { type: 'string', default: '' },
			imageAlt: { type: 'string', default: '' },
			credit: { type: 'string', default: '' },
			linkText: { type: 'string', default: '' },
			linkUrl: { type: 'string', default: '' },
			buttonStyle: { type: 'string', default: 'primary' }
		},
		edit: function ( props ) {
			var attributes = props.attributes;
			var setAttributes = props.setAttributes;
			var blockProps = useBlockProps( { className: 'rarc-card' } );

			return el(
				Fragment,
				null,
				el(
					InspectorControls,
					null,
					el(
						PanelBody,
						{ title: __( 'Card Settings', 'rarc-theme' ), initialOpen: true },
						el( SelectControl, {
							label: __( 'Card Variant', 'rarc-theme' ),
							value: attributes.variant,
							options: [
								{ label: __( 'Image Preview', 'rarc-theme' ), value: 'image' },
								{ label: __( 'Story Teaser', 'rarc-theme' ), value: 'story' },
								{ label: __( 'Info Card', 'rarc-theme' ), value: 'info' },
								{ label: __( 'Horizontal Preview', 'rarc-theme' ), value: 'horizontal' }
							],
							onChange: function ( value ) {
								setAttributes( { variant: value } );
							}
						} ),
						el( SelectControl, {
							label: __( 'Button Style', 'rarc-theme' ),
							value: attributes.buttonStyle,
							options: [
								{ label: __( 'Primary', 'rarc-theme' ), value: 'primary' },
								{ label: __( 'Outline', 'rarc-theme' ), value: 'outline' }
							],
							onChange: function ( value ) {
								setAttributes( { buttonStyle: value } );
							}
						} ),
						el( TextControl, {
							label: __( 'CTA URL', 'rarc-theme' ),
							value: attributes.linkUrl,
							onChange: function ( value ) { setAttributes( { linkUrl: value } ); }
						} )
					)
				),
				el(
					'article',
					blockProps,
					el(
						'div',
						{ className: 'rarc-card-media' },
						attributes.imageUrl ? el( 'img', { src: attributes.imageUrl, alt: attributes.imageAlt || '' } ) : el( 'div', { className: 'rarc-editor-note' }, __( 'Select a card image.', 'rarc-theme' ) ),
						attributes.credit ? el( 'span', { className: 'rarc-card-credit' }, attributes.credit ) : null,
						el(
							MediaUploadCheck,
							null,
							el( MediaUpload, {
								onSelect: function ( media ) {
									setAttributes( { imageUrl: media.url, imageAlt: media.alt || '' } );
								},
								allowedTypes: [ 'image' ],
								render: function ( data ) {
									return el( Button, { onClick: data.open, variant: 'secondary' }, attributes.imageUrl ? __( 'Replace Image', 'rarc-theme' ) : __( 'Select Image', 'rarc-theme' ) );
								}
							} )
						)
					),
					el(
						'div',
						{ className: 'rarc-card-body' },
						el( RichText, {
							tagName: 'div',
							className: 'rarc-eyebrow',
							placeholder: __( 'Eyebrow', 'rarc-theme' ),
							value: attributes.eyebrow,
							onChange: function ( value ) { setAttributes( { eyebrow: value } ); }
						} ),
						el( RichText, {
							tagName: 'h3',
							placeholder: __( 'Card title', 'rarc-theme' ),
							value: attributes.title,
							onChange: function ( value ) { setAttributes( { title: value } ); }
						} ),
						el( PlainText, {
							placeholder: __( 'Card meta or date', 'rarc-theme' ),
							value: attributes.meta,
							onChange: function ( value ) { setAttributes( { meta: value } ); }
						} ),
						el( PlainText, {
							placeholder: __( 'Optional subheadline', 'rarc-theme' ),
							value: attributes.subheadline,
							onChange: function ( value ) { setAttributes( { subheadline: value } ); }
						} ),
						el( RichText, {
							tagName: 'p',
							placeholder: __( 'Card description', 'rarc-theme' ),
							value: attributes.text,
							onChange: function ( value ) { setAttributes( { text: value } ); }
						} ),
						el( TextControl, {
							label: __( 'Image Credit', 'rarc-theme' ),
							value: attributes.credit,
							onChange: function ( value ) { setAttributes( { credit: value } ); }
						} ),
						ctaPreviewField( {
							variant: 'outline' === attributes.buttonStyle ? 'rarc-cta--outline' : 'rarc-cta--primary',
							placeholder: __( 'Card CTA label', 'rarc-theme' ),
							value: attributes.linkText,
							onChange: function ( value ) { setAttributes( { linkText: value } ); }
						} )
					)
				)
			);
		},
		save: function () {
			return null;
		}
	} );

	blocks.registerBlockType( 'rarc/carousel', {
		apiVersion: 2,
		title: __( 'RARC Carousel', 'rarc-theme' ),
		icon: 'images-alt2',
		category: 'design',
		attributes: {
			variant: { type: 'string', default: 'full' },
			eyebrow: { type: 'string', default: '' },
			heading: { type: 'string', default: '' },
			intro: { type: 'string', default: '' },
			bodyHeading: { type: 'string', default: '' },
			bodyText: { type: 'string', default: '' },
			slides: { type: 'array', default: [] }
		},
		edit: function ( props ) {
			var attributes = props.attributes;
			var setAttributes = props.setAttributes;
			var blockProps = useBlockProps( { className: 'rarc-carousel-block' } );
			var slides = attributes.slides || [];

			return el(
				Fragment,
				null,
				el(
					InspectorControls,
					null,
					el(
						PanelBody,
						{ title: __( 'Carousel Settings', 'rarc-theme' ), initialOpen: true },
						el( SelectControl, {
							label: __( 'Variant', 'rarc-theme' ),
							value: attributes.variant,
							options: [
								{ label: __( 'Full Section', 'rarc-theme' ), value: 'full' },
								{ label: __( 'Card Module', 'rarc-theme' ), value: 'card' }
							],
							onChange: function ( value ) {
								setAttributes( { variant: value } );
							}
						} )
					),
					slideEditor( slides, setAttributes, function ( slide, index ) {
						return el(
							Fragment,
							null,
							el(
								MediaUploadCheck,
								null,
								el( MediaUpload, {
									onSelect: function ( media ) {
										var nextSlides = updateSlide( updateSlide( slides, index, 'imageUrl', media.url ), index, 'alt', media.alt || '' );
										setAttributes( { slides: nextSlides } );
									},
									allowedTypes: [ 'image' ],
									render: function ( data ) {
										return el( Button, { onClick: data.open, variant: 'secondary' }, slide.imageUrl ? __( 'Replace Image', 'rarc-theme' ) : __( 'Select Image', 'rarc-theme' ) );
									}
								} )
							),
							el( TextControl, {
								label: __( 'Alt Text', 'rarc-theme' ),
								value: slide.alt || '',
								onChange: function ( value ) {
									setAttributes( { slides: updateSlide( slides, index, 'alt', value ) } );
								}
							} )
						);
					} ),
					el( Button, {
						variant: 'primary',
						onClick: function () {
							setAttributes( { slides: addSlide( slides, { imageUrl: '', alt: '', title: '', caption: '' } ) } );
						}
					}, __( 'Add Slide', 'rarc-theme' ) )
				),
				el(
					'div',
					blockProps,
					el( RichText, { tagName: 'div', className: 'rarc-eyebrow', placeholder: __( 'Eyebrow', 'rarc-theme' ), value: attributes.eyebrow, onChange: function ( value ) { setAttributes( { eyebrow: value } ); } } ),
					el( RichText, { tagName: 'h2', placeholder: __( 'Section heading', 'rarc-theme' ), value: attributes.heading, onChange: function ( value ) { setAttributes( { heading: value } ); } } ),
					el( RichText, { tagName: 'p', placeholder: __( 'Intro text', 'rarc-theme' ), value: attributes.intro, onChange: function ( value ) { setAttributes( { intro: value } ); } } ),
					el( 'div', { className: 'rarc-editor-note' }, slides.length ? __( 'Slides edit in the block sidebar. Frontend preview uses carousel behavior.', 'rarc-theme' ) : __( 'Add slides in the block sidebar.', 'rarc-theme' ) ),
					el( 'div', { className: 'rarc-carousel-stage' }, slides[0] && slides[0].imageUrl ? el( 'img', { src: slides[0].imageUrl, alt: slides[0].alt || '' } ) : null ),
					attributes.variant === 'card' ? el(
						Fragment,
						null,
						el( RichText, { tagName: 'h3', placeholder: __( 'Card body heading', 'rarc-theme' ), value: attributes.bodyHeading, onChange: function ( value ) { setAttributes( { bodyHeading: value } ); } } ),
						el( RichText, { tagName: 'p', placeholder: __( 'Card body text', 'rarc-theme' ), value: attributes.bodyText, onChange: function ( value ) { setAttributes( { bodyText: value } ); } } )
					) : null
				)
			);
		},
		save: function () {
			return null;
		}
	} );

	blocks.registerBlockType( 'rarc/hero-carousel', {
		apiVersion: 2,
		title: __( 'RARC Hero Carousel', 'rarc-theme' ),
		icon: 'slides',
		category: 'design',
		attributes: {
			anchor: { type: 'string', default: 'top' },
			eyebrow: { type: 'string', default: '' },
			heading: { type: 'string', default: '' },
			lede: { type: 'string', default: '' },
			primaryLabel: { type: 'string', default: '' },
			primaryUrl: { type: 'string', default: '' },
			secondaryLabel: { type: 'string', default: '' },
			secondaryUrl: { type: 'string', default: '' },
			slides: { type: 'array', default: [] }
		},
		edit: function ( props ) {
			var attributes = props.attributes;
			var setAttributes = props.setAttributes;
			var blockProps = useBlockProps( { className: 'rarc-hero' } );
			var slides = attributes.slides || [];

			return el(
				Fragment,
				null,
				el(
					InspectorControls,
					null,
					el(
						PanelBody,
						{ title: __( 'Hero CTA Links', 'rarc-theme' ), initialOpen: true },
						el( TextControl, { label: __( 'Primary CTA URL', 'rarc-theme' ), value: attributes.primaryUrl, onChange: function ( value ) { setAttributes( { primaryUrl: value } ); } } ),
						el( TextControl, { label: __( 'Secondary CTA URL', 'rarc-theme' ), value: attributes.secondaryUrl, onChange: function ( value ) { setAttributes( { secondaryUrl: value } ); } } )
					),
					slideEditor( slides, setAttributes, function ( slide, index ) {
						return el(
							Fragment,
							null,
							el(
								MediaUploadCheck,
								null,
								el( MediaUpload, {
									onSelect: function ( media ) {
										setAttributes( { slides: updateSlide( slides, index, 'imageUrl', media.url ) } );
									},
									allowedTypes: [ 'image' ],
									render: function ( data ) {
										return el( Button, { onClick: data.open, variant: 'secondary' }, slide.imageUrl ? __( 'Replace Background', 'rarc-theme' ) : __( 'Select Background', 'rarc-theme' ) );
									}
								} )
							),
							el( TextControl, {
								label: __( 'Credit', 'rarc-theme' ),
								value: slide.credit || '',
								onChange: function ( value ) {
									setAttributes( { slides: updateSlide( slides, index, 'credit', value ) } );
								}
							} )
						);
					} ),
					el( Button, {
						variant: 'primary',
						onClick: function () {
							setAttributes( { slides: addSlide( slides, { imageUrl: '', credit: '', title: '', caption: '' } ) } );
						}
					}, __( 'Add Hero Slide', 'rarc-theme' ) )
				),
				el(
					'section',
					blockProps,
					slides[0] && slides[0].imageUrl ? el( 'div', { className: 'rarc-carousel-stage' }, el( 'img', { src: slides[0].imageUrl, alt: '' } ) ) : el( 'div', { className: 'rarc-editor-note' }, __( 'Add hero slides in the block sidebar.', 'rarc-theme' ) ),
					el( RichText, { tagName: 'div', className: 'rarc-eyebrow', placeholder: __( 'Eyebrow', 'rarc-theme' ), value: attributes.eyebrow, onChange: function ( value ) { setAttributes( { eyebrow: value } ); } } ),
					el( RichText, { tagName: 'h1', placeholder: __( 'Hero heading', 'rarc-theme' ), value: attributes.heading, onChange: function ( value ) { setAttributes( { heading: value } ); } } ),
					el( RichText, { tagName: 'p', className: 'rarc-lede', placeholder: __( 'Hero summary', 'rarc-theme' ), value: attributes.lede, onChange: function ( value ) { setAttributes( { lede: value } ); } } ),
					el(
						'div',
						{ className: 'rarc-actions rarc-editor-cta-row' },
						ctaPreviewField( { variant: 'rarc-cta--primary', placeholder: __( 'Primary CTA label', 'rarc-theme' ), value: attributes.primaryLabel, onChange: function ( value ) { setAttributes( { primaryLabel: value } ); } } ),
						ctaPreviewField( { variant: 'rarc-cta--outline', placeholder: __( 'Secondary CTA label', 'rarc-theme' ), value: attributes.secondaryLabel, onChange: function ( value ) { setAttributes( { secondaryLabel: value } ); } } )
					)
				)
			);
		},
		save: function () {
			return null;
		}
	} );

	blocks.registerBlockType( 'rarc/info-row', {
		apiVersion: 2,
		title: __( 'RARC Info Row', 'rarc-theme' ),
		icon: 'editor-ul',
		category: 'design',
		attributes: {
			label: { type: 'string', default: '' },
			content: { type: 'string', default: '' }
		},
		edit: function ( props ) {
			var attributes = props.attributes;
			var setAttributes = props.setAttributes;
			var blockProps = useBlockProps( { className: 'rarc-info-item' } );

			return el(
				'div',
				blockProps,
				el( PlainText, {
					placeholder: __( 'Row label', 'rarc-theme' ),
					value: attributes.label,
					onChange: function ( value ) {
						setAttributes( { label: value } );
					}
				} ),
				el( RichText, {
					tagName: 'p',
					placeholder: __( 'Row content', 'rarc-theme' ),
					value: attributes.content,
					onChange: function ( value ) {
						setAttributes( { content: value } );
					}
				} )
			);
		},
		save: function () {
			return null;
		}
	} );

	blocks.registerBlockType( 'rarc/sidebar-card', {
		apiVersion: 2,
		title: __( 'RARC Sidebar Card', 'rarc-theme' ),
		icon: 'id',
		category: 'design',
		attributes: {
			title: { type: 'string', default: '' },
			text: { type: 'string', default: '' },
			buttonText: { type: 'string', default: '' },
			buttonUrl: { type: 'string', default: '' },
			isShare: { type: 'boolean', default: false },
			shareNote: { type: 'string', default: '' }
		},
		edit: function ( props ) {
			var attributes = props.attributes;
			var setAttributes = props.setAttributes;
			var blockProps = useBlockProps( { className: 'rarc-sidebar-card' } );

			return el(
				Fragment,
				null,
				el(
					InspectorControls,
					null,
					el(
						PanelBody,
						{ title: __( 'Sidebar Card Settings', 'rarc-theme' ), initialOpen: true },
						el( SelectControl, {
							label: __( 'Action Type', 'rarc-theme' ),
							value: attributes.isShare ? 'share' : 'link',
							options: [
								{ label: __( 'Link Button', 'rarc-theme' ), value: 'link' },
								{ label: __( 'Share Button', 'rarc-theme' ), value: 'share' }
							],
							onChange: function ( value ) {
								setAttributes( { isShare: 'share' === value } );
							}
						} ),
						! attributes.isShare ? el( TextControl, {
							label: __( 'Button URL', 'rarc-theme' ),
							value: attributes.buttonUrl,
							onChange: function ( value ) { setAttributes( { buttonUrl: value } ); }
						} ) : null,
						attributes.isShare ? el( TextControl, {
							label: __( 'Share Note', 'rarc-theme' ),
							value: attributes.shareNote,
							onChange: function ( value ) { setAttributes( { shareNote: value } ); }
						} ) : null
					)
				),
				el(
					'div',
					blockProps,
					el( PlainText, {
						placeholder: __( 'Sidebar title', 'rarc-theme' ),
						value: attributes.title,
						onChange: function ( value ) { setAttributes( { title: value } ); }
					} ),
					el( RichText, {
						tagName: 'p',
						placeholder: __( 'Sidebar description', 'rarc-theme' ),
						value: attributes.text,
						onChange: function ( value ) { setAttributes( { text: value } ); }
					} ),
					ctaPreviewField( {
						variant: attributes.isShare ? 'rarc-cta--share' : 'rarc-cta--outline',
						className: 'rarc-editor-sidebar-cta',
						placeholder: attributes.isShare ? __( 'Share action label', 'rarc-theme' ) : __( 'Sidebar CTA label', 'rarc-theme' ),
						value: attributes.buttonText,
						onChange: function ( value ) { setAttributes( { buttonText: value } ); },
						showIcon: !! attributes.isShare
					} ),
					attributes.buttonText ? el( 'div', { className: 'rarc-editor-note' }, attributes.isShare ? __( 'This card will render a share button on the frontend.', 'rarc-theme' ) : __( 'This card will render a linked button on the frontend.', 'rarc-theme' ) ) : null
				)
			);
		},
		save: function () {
			return null;
		}
	} );

	blocks.registerBlockType( 'rarc/story-preview', {
		apiVersion: 2,
		title: __( 'RARC Story Preview', 'rarc-theme' ),
		icon: 'index-card',
		category: 'design',
		attributes: {
			ctaLabel: { type: 'string', default: 'Read story' },
			showImage: { type: 'boolean', default: true }
		},
		edit: function ( props ) {
			var attributes = props.attributes;
			var setAttributes = props.setAttributes;
			var blockProps = useBlockProps( { className: 'rarc-card rarc-card--story rarc-story-preview' } );

			return el(
				Fragment,
				null,
				el(
					InspectorControls,
					null,
					el(
						PanelBody,
						{ title: __( 'Story Preview Settings', 'rarc-theme' ), initialOpen: true },
						el( TextControl, {
							label: __( 'CTA Label', 'rarc-theme' ),
							value: attributes.ctaLabel,
							onChange: function ( value ) { setAttributes( { ctaLabel: value } ); }
						} ),
						el( SelectControl, {
							label: __( 'Image Display', 'rarc-theme' ),
							value: attributes.showImage ? 'show' : 'hide',
							options: [
								{ label: __( 'Show featured image', 'rarc-theme' ), value: 'show' },
								{ label: __( 'Hide featured image', 'rarc-theme' ), value: 'hide' }
							],
							onChange: function ( value ) { setAttributes( { showImage: 'show' === value } ); }
						} )
					)
				),
				el(
					'article',
					blockProps,
					attributes.showImage ? el( 'div', { className: 'rarc-card-media rarc-card-media--placeholder' }, el( 'span', { className: 'rarc-card-placeholder' }, __( 'Featured image from current post', 'rarc-theme' ) ) ) : null,
					el(
						'div',
						{ className: 'rarc-card-body' },
						el( 'div', { className: 'rarc-card-meta' }, __( 'Post date from current entry', 'rarc-theme' ) ),
						el( 'h3', null, __( 'Post title from current entry', 'rarc-theme' ) ),
						el( 'p', null, __( 'Excerpt from current entry will render here on the front end.', 'rarc-theme' ) ),
						el( 'div', { className: 'rarc-cta rarc-cta--inline rarc-editor-cta' }, el( 'span', { className: 'rarc-cta__label' }, attributes.ctaLabel || __( 'Read story', 'rarc-theme' ) ), el( 'span', { className: 'rarc-cta__icon', 'aria-hidden': 'true' }, '->' ) )
					)
				)
			);
		},
		save: function () {
			return null;
		}
	} );
} )( window.wp.blocks, window.wp.element, window.wp.blockEditor, window.wp.components, window.wp.i18n );

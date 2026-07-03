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
			eyebrow: { type: 'string', default: '' },
			title: { type: 'string', default: '' },
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
							label: __( 'Button Style', 'rarc-theme' ),
							value: attributes.buttonStyle,
							options: [
								{ label: __( 'Primary', 'rarc-theme' ), value: 'primary' },
								{ label: __( 'Outline', 'rarc-theme' ), value: 'outline' }
							],
							onChange: function ( value ) {
								setAttributes( { buttonStyle: value } );
							}
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
						el( TextControl, {
							label: __( 'Button Text', 'rarc-theme' ),
							value: attributes.linkText,
							onChange: function ( value ) { setAttributes( { linkText: value } ); }
						} ),
						el( TextControl, {
							label: __( 'Button URL', 'rarc-theme' ),
							value: attributes.linkUrl,
							onChange: function ( value ) { setAttributes( { linkUrl: value } ); }
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
					el( TextControl, { label: __( 'Primary button label', 'rarc-theme' ), value: attributes.primaryLabel, onChange: function ( value ) { setAttributes( { primaryLabel: value } ); } } ),
					el( TextControl, { label: __( 'Primary button URL', 'rarc-theme' ), value: attributes.primaryUrl, onChange: function ( value ) { setAttributes( { primaryUrl: value } ); } } ),
					el( TextControl, { label: __( 'Secondary button label', 'rarc-theme' ), value: attributes.secondaryLabel, onChange: function ( value ) { setAttributes( { secondaryLabel: value } ); } } ),
					el( TextControl, { label: __( 'Secondary button URL', 'rarc-theme' ), value: attributes.secondaryUrl, onChange: function ( value ) { setAttributes( { secondaryUrl: value } ); } } )
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
						el( TextControl, {
							label: __( 'Button Text', 'rarc-theme' ),
							value: attributes.buttonText,
							onChange: function ( value ) { setAttributes( { buttonText: value } ); }
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
					attributes.buttonText ? el( 'div', { className: 'rarc-editor-note' }, attributes.isShare ? __( 'This card will render a share button on the frontend.', 'rarc-theme' ) : __( 'This card will render a linked button on the frontend.', 'rarc-theme' ) ) : null
				)
			);
		},
		save: function () {
			return null;
		}
	} );
} )( window.wp.blocks, window.wp.element, window.wp.blockEditor, window.wp.components, window.wp.i18n );

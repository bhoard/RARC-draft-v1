( function ( blocks, element, blockEditor, components, data, i18n ) {
	var el = element.createElement;
	var Fragment = element.Fragment;
	var createBlock = blocks.createBlock;
	var useBlockProps = blockEditor.useBlockProps;
	var InnerBlocks = blockEditor.InnerBlocks;
	var MediaUpload = blockEditor.MediaUpload;
	var MediaUploadCheck = blockEditor.MediaUploadCheck;
	var InspectorControls = blockEditor.InspectorControls;
	var RichText = blockEditor.RichText;
	var PlainText = blockEditor.PlainText;
	var URLInputButton = blockEditor.URLInputButton;
	var useDispatch = data.useDispatch;
	var useSelect = data.useSelect;
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

	function normalizeCardActions( attributes ) {
		var actions = Array.isArray( attributes.actions ) ? attributes.actions.filter( function ( action ) {
			return action && 'object' === typeof action;
		} ) : [];

		if ( actions.length ) {
			return actions;
		}

		if ( attributes.linkText || attributes.linkUrl ) {
			return [ {
				text: attributes.linkText || '',
				url: attributes.linkUrl || '',
				variant: attributes.buttonStyle || 'primary'
			} ];
		}

		return [];
	}

	function updateCardAction( actions, index, key, value ) {
		return actions.map( function ( action, actionIndex ) {
			if ( actionIndex !== index ) {
				return action;
			}

			var next = {};
			Object.keys( action ).forEach( function ( actionKey ) {
				next[ actionKey ] = action[ actionKey ];
			} );
			next[ key ] = value;
			return next;
		} );
	}

	function removeCardAction( actions, index ) {
		return actions.filter( function ( _, actionIndex ) {
			return actionIndex !== index;
		} );
	}

	function addCardAction( actions ) {
		return actions.concat( [ { text: '', url: '', variant: 'primary' } ] );
	}

	function setCardActions( setAttributes, actions ) {
		setAttributes( {
			actions: actions,
			linkText: actions[0] ? actions[0].text || '' : '',
			linkUrl: actions[0] ? actions[0].url || '' : '',
			buttonStyle: actions[0] ? actions[0].variant || 'primary' : 'primary'
		} );
	}

	function normalizeHeroActions( attributes ) {
		var actions = Array.isArray( attributes.actions ) ? attributes.actions.filter( function ( action ) {
			return action && 'object' === typeof action;
		} ) : [];

		if ( actions.length ) {
			return actions;
		}

		actions = [];

		if ( attributes.primaryLabel || attributes.primaryUrl ) {
			actions.push( {
				text: attributes.primaryLabel || '',
				url: attributes.primaryUrl || '',
				variant: 'primary'
			} );
		}

		if ( attributes.secondaryLabel || attributes.secondaryUrl ) {
			actions.push( {
				text: attributes.secondaryLabel || '',
				url: attributes.secondaryUrl || '',
				variant: 'outline'
			} );
		}

		return actions;
	}

	function setHeroActions( setAttributes, actions ) {
		setAttributes( {
			actions: actions,
			primaryLabel: actions[0] ? actions[0].text || '' : '',
			primaryUrl: actions[0] ? actions[0].url || '' : '',
			secondaryLabel: actions[1] ? actions[1].text || '' : '',
			secondaryUrl: actions[1] ? actions[1].url || '' : ''
		} );
	}

	function ctaPreviewField( options ) {
		return el(
			'div',
			{ key: options.key, className: 'rarc-cta ' + options.variant + ' rarc-editor-cta' + ( options.className ? ' ' + options.className : '' ) },
			el( PlainText, {
				placeholder: options.placeholder,
				value: options.value || '',
				onChange: options.onChange
			} ),
			options.showIcon ? el( 'span', { className: 'rarc-cta__icon', 'aria-hidden': 'true', dangerouslySetInnerHTML: { __html: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>' } } ) : null
		);
	}

	function linkPickerField( options ) {
		return el(
			BaseControl,
			{ label: options.label },
			el( URLInputButton, {
				url: options.value || '',
				onChange: options.onChange
			} ),
			options.value ? el( 'p', { className: 'rarc-editor-link-preview' }, options.value ) : null
		);
	}

	function updateInfoRow( rows, index, key, value ) {
		return rows.map( function ( row, rowIndex ) {
			var next = {};

			Object.keys( row || {} ).forEach( function ( rowKey ) {
				next[ rowKey ] = row[ rowKey ];
			} );

			if ( rowIndex === index ) {
				next[ key ] = value;
			}

			return next;
		} );
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

	blocks.registerBlockType( 'rarc/card-grid', {
		apiVersion: 2,
		title: __( 'RARC Card Grid', 'rarc-theme' ),
		icon: 'screenoptions',
		category: 'design',
		edit: function ( props ) {
			var blockProps = useBlockProps( { className: 'rarc-grid-3' } );
			var childCount = useSelect( function ( select ) {
				return select( 'core/block-editor' ).getBlockCount( props.clientId );
			}, [ props.clientId ] );
			var blockEditorStore = useDispatch( 'core/block-editor' );
			var addTileCount = 0 === childCount ? 3 : ( 0 === ( childCount % 3 ) ? 1 : 3 - ( childCount % 3 ) );

			function insertCard() {
				blockEditorStore.insertBlocks( createBlock( 'rarc/card', { variant: 'image' } ), childCount, props.clientId );
			}

			return el(
				'div',
				blockProps,
				el( InnerBlocks, {
					allowedBlocks: [ 'rarc/card' ],
					renderAppender: false
				} ),
				Array.from( { length: addTileCount } ).map( function ( _, index ) {
					return el( Button, {
						key: 'card-grid-appender-' + index,
						className: 'rarc-card-grid-appender',
						onClick: insertCard
					}, __( 'Add Card', 'rarc-theme' ) );
				} )
			);
		},
		save: function () {
			return el(
				'div',
				blockEditor.useBlockProps.save( { className: 'rarc-grid-3' } ),
				el( InnerBlocks.Content )
			);
		}
	} );

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
			buttonStyle: { type: 'string', default: 'primary' },
			actions: { type: 'array', default: [] }
		},
		edit: function ( props ) {
			var attributes = props.attributes;
			var setAttributes = props.setAttributes;
			var actions = normalizeCardActions( attributes );
			var blockProps = useBlockProps( { className: 'rarc-card rarc-card--' + attributes.variant } );

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
						el( TextControl, {
							label: __( 'Image Credit', 'rarc-theme' ),
							value: attributes.credit,
							onChange: function ( value ) { setAttributes( { credit: value } ); }
						} ),
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
						),
						actions.map( function ( action, index ) {
							return el(
								PanelBody,
								{ key: 'card-action-' + index, title: __( 'CTA', 'rarc-theme' ) + ' ' + ( index + 1 ), initialOpen: 0 === index },
								el( SelectControl, {
									label: __( 'Button Style', 'rarc-theme' ),
									value: action.variant || 'primary',
									options: [
										{ label: __( 'Primary', 'rarc-theme' ), value: 'primary' },
										{ label: __( 'Outline', 'rarc-theme' ), value: 'outline' }
									],
									onChange: function ( value ) {
										setCardActions( setAttributes, updateCardAction( actions, index, 'variant', value ) );
									}
								} ),
								linkPickerField( {
									label: __( 'CTA Link', 'rarc-theme' ),
									value: action.url || '',
									onChange: function ( value ) {
										setCardActions( setAttributes, updateCardAction( actions, index, 'url', value ) );
									}
								} ),
								el( Button, {
									isDestructive: true,
									onClick: function () {
										setCardActions( setAttributes, removeCardAction( actions, index ) );
									}
								}, __( 'Remove CTA', 'rarc-theme' ) )
							);
						} ),
						el( Button, {
							variant: 'secondary',
							onClick: function () {
								setCardActions( setAttributes, addCardAction( actions ) );
							}
						}, __( 'Add CTA', 'rarc-theme' ) )
					)
				),
				el(
					'article',
					blockProps,
					el(
						'div',
						{ className: 'rarc-card__image' + ( attributes.imageUrl ? '' : ' rarc-card__image--placeholder' ) },
						attributes.imageUrl ? el( 'img', { src: attributes.imageUrl, alt: attributes.imageAlt || '' } ) : el( 'span', { className: 'rarc-card-placeholder' }, __( 'Add card image', 'rarc-theme' ) ),
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
						{ className: 'rarc-card__content' },
						el( 'div', { className: 'rarc-card__header' },
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
						),
						el( RichText, {
							tagName: 'p',
							placeholder: __( 'Card description', 'rarc-theme' ),
							value: attributes.text,
							onChange: function ( value ) { setAttributes( { text: value } ); }
						} ),
						actions.length ? el(
							'div',
							{ className: 'rarc-card__actions' },
							actions.map( function ( action, index ) {
								return ctaPreviewField( {
									key: 'card-cta-preview-' + index,
									variant: 'outline' === ( action.variant || 'primary' ) ? 'rarc-cta--outline' : 'rarc-cta--primary',
									placeholder: __( 'Card CTA label', 'rarc-theme' ),
									value: action.text || '',
									onChange: function ( value ) { setCardActions( setAttributes, updateCardAction( actions, index, 'text', value ) ); },
									showIcon: true,
									className: 'rarc-card-cta'
								} );
							} )
						) : el( Button, {
							variant: 'secondary',
							onClick: function () {
								setCardActions( setAttributes, addCardAction( actions ) );
							}
						}, __( 'Add CTA', 'rarc-theme' ) )
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

			function carouselSlideCanvasEditor( slide, index ) {
				return el(
					'div',
					{ key: 'carousel-slide-editor-' + index, className: 'rarc-carousel-slide-editor' },
					el( 'div', { className: 'rarc-editor-badge' }, __( 'Slide', 'rarc-theme' ) + ' ' + ( index + 1 ) ),
					slide.imageUrl ? el( 'img', { src: slide.imageUrl, alt: slide.alt || '' } ) : el( 'div', { className: 'rarc-card__image--placeholder' }, el( 'span', { className: 'rarc-card-placeholder' }, __( 'Select slide image', 'rarc-theme' ) ) ),
					el( RichText, {
						tagName: 'strong',
						placeholder: __( 'Slide title', 'rarc-theme' ),
						value: slide.title || '',
						onChange: function ( value ) {
							setAttributes( { slides: updateSlide( slides, index, 'title', value ) } );
						}
					} ),
					el( RichText, {
						tagName: 'p',
						placeholder: __( 'Slide caption', 'rarc-theme' ),
						value: slide.caption || '',
						onChange: function ( value ) {
							setAttributes( { slides: updateSlide( slides, index, 'caption', value ) } );
						}
					} ),
					el(
						'div',
						{ className: 'rarc-carousel-slide-editor-actions' },
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
									return el( Button, { onClick: data.open, variant: 'secondary' }, slide.imageUrl ? __( 'Replace image', 'rarc-theme' ) : __( 'Select image', 'rarc-theme' ) );
								}
							} )
						),
						el( Button, {
							isDestructive: true,
							onClick: function () {
								setAttributes( { slides: removeSlide( slides, index ) } );
							}
						}, __( 'Remove slide', 'rarc-theme' ) )
					)
				);
			}

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
					el( 'div', { className: 'rarc-editor-badge' }, slides.length ? slides.length + ' ' + __( 'editable slide(s)', 'rarc-theme' ) : __( 'No slides yet.', 'rarc-theme' ) ),
					el( 'div', { className: 'rarc-carousel-slide-editor-list' }, slides.map( carouselSlideCanvasEditor ) ),
					el( Button, {
						variant: 'primary',
						onClick: function () {
							setAttributes( { slides: addSlide( slides, { imageUrl: '', alt: '', title: '', caption: '' } ) } );
						}
					}, __( 'Add slide', 'rarc-theme' ) ),
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
			actions: { type: 'array', default: [] },
			slides: { type: 'array', default: [] }
		},
		edit: function ( props ) {
			var attributes = props.attributes;
			var setAttributes = props.setAttributes;
			var blockProps = useBlockProps( { className: 'rarc-hero align' + ( attributes.align || 'full' ) } );
			var slides = attributes.slides || [];
			var actions = normalizeHeroActions( attributes );

			return el(
				Fragment,
				null,
				el(
					InspectorControls,
					null,
					el(
						PanelBody,
						{ title: __( 'Hero CTA Links', 'rarc-theme' ), initialOpen: true },
						actions.map( function ( action, index ) {
							return el(
								PanelBody,
								{ key: 'hero-action-' + index, title: __( 'Hero CTA', 'rarc-theme' ) + ' ' + ( index + 1 ), initialOpen: 0 === index },
								el( SelectControl, {
									label: __( 'Button Style', 'rarc-theme' ),
									value: action.variant || 'primary',
									options: [
										{ label: __( 'Primary', 'rarc-theme' ), value: 'primary' },
										{ label: __( 'Outline', 'rarc-theme' ), value: 'outline' }
									],
									onChange: function ( value ) {
										setHeroActions( setAttributes, updateCardAction( actions, index, 'variant', value ) );
									}
								} ),
								linkPickerField( {
									label: __( 'CTA Link', 'rarc-theme' ),
									value: action.url || '',
									onChange: function ( value ) {
										setHeroActions( setAttributes, updateCardAction( actions, index, 'url', value ) );
									}
								} ),
								el( Button, {
									isDestructive: true,
									onClick: function () {
										setHeroActions( setAttributes, removeCardAction( actions, index ) );
									}
								}, __( 'Remove CTA', 'rarc-theme' ) )
							);
						} ),
						el( Button, {
							variant: 'secondary',
							onClick: function () {
								setHeroActions( setAttributes, addCardAction( actions ) );
							}
						}, __( 'Add CTA', 'rarc-theme' ) )
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
					slides.length > 0 ? el(
						Fragment,
						null,
						el(
							'div',
							{ className: 'rarc-hero-bg rarc-editor-hero-bg' },
							el( 'div', { className: 'rarc-hero-slide is-active', style: { '--hero-image': 'url(' + slides[0].imageUrl + ')' } } ),
							el( 'div', { className: 'rarc-hero-credit' }, slides[0].credit || __( 'Add slide credit in the block sidebar.', 'rarc-theme' ) ),
							el( 'div', { className: 'rarc-editor-badge rarc-editor-hero-badge' }, slides.length + __( ' slide(s). Edit in sidebar.', 'rarc-theme' ) )
						) 
						) : el( 'div', { className: 'rarc-card__image--placeholder rarc-hero-placeholder' }, el( 'span', { className: 'rarc-card-placeholder' }, __( 'Add hero slide', 'rarc-theme' ) ) ),
					el(
						'div',
						{ className: 'wp-block-group alignwide rarc-hero-grid rarc-editor-hero-grid' },
						el(
							'div',
							{ className: 'rarc-hero-copy' },
							el( RichText, { tagName: 'div', className: 'rarc-eyebrow', placeholder: __( 'Eyebrow', 'rarc-theme' ), value: attributes.eyebrow, onChange: function ( value ) { setAttributes( { eyebrow: value } ); } } ),
							el( RichText, { tagName: 'h1', placeholder: __( 'Hero heading', 'rarc-theme' ), value: attributes.heading, onChange: function ( value ) { setAttributes( { heading: value } ); } } ),
							el( RichText, { tagName: 'p', className: 'rarc-lede', placeholder: __( 'Hero summary', 'rarc-theme' ), value: attributes.lede, onChange: function ( value ) { setAttributes( { lede: value } ); } } ),
							el(
								'div',
								{ className: 'rarc-actions rarc-editor-cta-row' },
								actions.length ? actions.map( function ( action, index ) {
									return ctaPreviewField( {
										key: 'hero-cta-preview-' + index,
										variant: 'outline' === ( action.variant || 'primary' ) ? 'rarc-cta--outline' : 'rarc-cta--primary',
										placeholder: __( 'Hero CTA label', 'rarc-theme' ),
										value: action.text || '',
										onChange: function ( value ) { setHeroActions( setAttributes, updateCardAction( actions, index, 'text', value ) ); },
										showIcon: true,
										className: 'rarc-hero-cta'
									} );
								} ) : el( Button, {
									variant: 'secondary',
									onClick: function () {
										setHeroActions( setAttributes, addCardAction( actions ) );
									}
								}, __( 'Add CTA', 'rarc-theme' ) )
							)
						)
					)
				)
			);
		},
		save: function () {
			return null;
		}
	} );

	blocks.registerBlockType( 'rarc/info-list', {
		apiVersion: 2,
		title: __( 'RARC Info List', 'rarc-theme' ),
		icon: 'editor-ul',
		category: 'design',
		attributes: {
			rows: { type: 'array', default: [] }
		},
		edit: function ( props ) {
			var attributes = props.attributes;
			var setAttributes = props.setAttributes;
			var rows = attributes.rows || [];
			var blockProps = useBlockProps( { className: 'rarc-info-list' } );

			function addRow() {
				setAttributes( {
					rows: rows.concat( [ {
						label: __( 'New row', 'rarc-theme' ),
						content: __( 'Add row details here.', 'rarc-theme' )
					} ] )
				} );
			}

			function removeLastRow() {
				setAttributes( { rows: rows.slice( 0, Math.max( rows.length - 1, 0 ) ) } );
			}

			return el(
				Fragment,
				null,
				el(
					InspectorControls,
					null,
					el(
						PanelBody,
						{ title: __( 'Info List Rows', 'rarc-theme' ), initialOpen: true },
						el( Button, { variant: 'primary', onClick: addRow }, __( 'Add row to bottom', 'rarc-theme' ) ),
						el( Button, { variant: 'secondary', onClick: removeLastRow, disabled: rows.length < 1, className: 'rarc-editor-panel-button' }, __( 'Remove last row', 'rarc-theme' ) )
					)
				),
				el(
					'div',
					blockProps,
					rows.map( function ( row, index ) {
						return el(
							'div',
							{ key: index, className: 'rarc-info-item' },
							el( PlainText, {
								className: 'rarc-info-label',
								placeholder: __( 'Row label', 'rarc-theme' ),
								value: row.label || '',
								onChange: function ( value ) {
									setAttributes( { rows: updateInfoRow( rows, index, 'label', value ) } );
								}
							} ),
							el( RichText, {
								tagName: 'p',
								placeholder: __( 'Row content', 'rarc-theme' ),
								value: row.content || '',
								onChange: function ( value ) {
									setAttributes( { rows: updateInfoRow( rows, index, 'content', value ) } );
								}
							} )
						);
					} ),
					el(
						'div',
						{ className: 'rarc-info-list-controls' },
						el( 'span', { className: 'rarc-editor-note' }, __( 'Info list rows', 'rarc-theme' ) ),
						el( Button, { variant: 'primary', onClick: addRow }, __( 'Add row to bottom', 'rarc-theme' ) ),
						el( Button, { variant: 'secondary', onClick: removeLastRow, disabled: rows.length < 1 }, __( 'Remove last row', 'rarc-theme' ) )
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
					className: 'rarc-info-label',
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
						! attributes.isShare ? linkPickerField( {
							label: __( 'Button Link', 'rarc-theme' ),
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
					el( 'div', { className: 'rarc-editor-badge' }, attributes.isShare ? __( 'Share Card', 'rarc-theme' ) : __( 'Link Card', 'rarc-theme' ) ),
					el( PlainText, {
						className: 'rarc-sidebar-title',
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
						showIcon: true
					} )
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
					attributes.showImage ? el( 'div', { className: 'rarc-card__image rarc-card__image--placeholder' }, el( 'span', { className: 'rarc-card-placeholder' }, __( 'Featured image from current post', 'rarc-theme' ) ) ) : null,
					el(
						'div',
						{ className: 'rarc-card__content' },
						el( 'div', { className: 'rarc-card__header' },
						el( 'div', { className: 'rarc-card-meta' }, __( 'Post date from current entry', 'rarc-theme' ) ),
						el( 'h3', null, __( 'Post title from current entry', 'rarc-theme' ) )
						),
						el( 'p', null, __( 'Excerpt from current entry will render here on the front end.', 'rarc-theme' ) ),
						el( 'div', { className: 'rarc-cta rarc-cta--inline rarc-editor-cta' },
							el( PlainText, {
								placeholder: __( 'CTA label', 'rarc-theme' ),
								value: attributes.ctaLabel,
								onChange: function ( value ) { setAttributes( { ctaLabel: value } ); }
							} ),
							el( 'span', { className: 'rarc-cta__icon', 'aria-hidden': 'true', dangerouslySetInnerHTML: { __html: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>' } } )
						)
					)
				)
			);
		},
		save: function () {
			return null;
		}
	} );
} )( window.wp.blocks, window.wp.element, window.wp.blockEditor, window.wp.components, window.wp.data, window.wp.i18n );

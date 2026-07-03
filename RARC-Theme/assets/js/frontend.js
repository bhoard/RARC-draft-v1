( function () {
	function initHero( hero ) {
		var heroCarousel = hero.querySelector( '[data-rarc-hero-carousel]' );
		if ( ! heroCarousel ) return;

		var slides = Array.prototype.slice.call( heroCarousel.querySelectorAll( '.rarc-hero-slide' ) );
		var credit = heroCarousel.querySelector( '.rarc-hero-credit' );
		var status = hero.querySelector( '.rarc-carousel-announce' );
		var pause = hero.querySelector( '[data-rarc-hero-pause]' );
		var current = 0;
		var reduced = window.matchMedia && window.matchMedia( '(prefers-reduced-motion: reduce)' ).matches;
		var paused = reduced;
		var timer;

		function show( index ) {
			if ( ! slides.length ) return;
			current = ( index + slides.length ) % slides.length;
			slides.forEach( function ( slide, i ) {
				slide.classList.toggle( 'is-active', i === current );
			} );
			if ( credit ) credit.textContent = slides[ current ].dataset.credit || '';
			if ( status ) status.textContent = 'Hero image ' + ( current + 1 ) + ' of ' + slides.length;
		}

		function queue() {
			window.clearInterval( timer );
			if ( ! paused && slides.length > 1 ) {
				timer = window.setInterval( function () {
					show( current + 1 );
				}, 6500 );
			}
		}

		if ( pause ) {
			pause.setAttribute( 'aria-pressed', String( paused ) );
			pause.addEventListener( 'click', function () {
				paused = ! paused;
				pause.setAttribute( 'aria-pressed', String( paused ) );
				pause.setAttribute( 'aria-label', paused ? 'Resume rotating hero field photos' : 'Pause rotating hero field photos' );
				queue();
			} );
		}

		show( 0 );
		queue();
	}

	function initCarousel( wrapper ) {
		var slides = Array.prototype.slice.call( wrapper.querySelectorAll( '.rarc-slide' ) );
		var thumbRow = wrapper.querySelector( '.rarc-thumb-row' );
		var status = wrapper.querySelector( '.rarc-carousel-status' );
		var prev = wrapper.querySelector( '[data-rarc-carousel-prev]' );
		var next = wrapper.querySelector( '[data-rarc-carousel-next]' );
		var current = Math.max( 0, slides.findIndex( function ( slide ) { return slide.classList.contains( 'is-active' ); } ) );
		var thumbs = [];

		if ( thumbRow ) {
			thumbRow.innerHTML = '';
			slides.forEach( function ( slide, index ) {
				var img = slide.querySelector( 'img' );
				var button = document.createElement( 'button' );
				button.type = 'button';
				button.dataset.carouselJump = String( index );
				button.setAttribute( 'aria-label', 'Show image ' + ( index + 1 ) );
				button.setAttribute( 'aria-current', String( 0 === index ) );
				if ( img ) {
					var thumb = document.createElement( 'img' );
					thumb.src = img.currentSrc || img.src;
					thumb.alt = '';
					button.appendChild( thumb );
				}
				thumbRow.appendChild( button );
			} );
			thumbs = Array.prototype.slice.call( thumbRow.querySelectorAll( '[data-carousel-jump]' ) );
		}

		function show( index ) {
			current = ( index + slides.length ) % slides.length;
			slides.forEach( function ( slide, slideIndex ) {
				var active = slideIndex === current;
				slide.classList.toggle( 'is-active', active );
				slide.setAttribute( 'aria-hidden', String( ! active ) );
			} );
			thumbs.forEach( function ( thumb, thumbIndex ) {
				thumb.setAttribute( 'aria-current', String( thumbIndex === current ) );
			} );
			if ( status ) status.textContent = 'Image ' + ( current + 1 ) + ' of ' + slides.length;
		}

		if ( prev ) prev.addEventListener( 'click', function () { show( current - 1 ); } );
		if ( next ) next.addEventListener( 'click', function () { show( current + 1 ); } );
		thumbs.forEach( function ( thumb ) {
			thumb.addEventListener( 'click', function () {
				show( Number( thumb.dataset.carouselJump ) );
			} );
		} );

		show( current );
	}

	function initShareButtons() {
		Array.prototype.slice.call( document.querySelectorAll( '.rarc-share-button' ) ).forEach( function ( button ) {
			button.addEventListener( 'click', function () {
				var note = button.parentNode.querySelector( '.rarc-share-note' );
				var shareData = {
					title: document.title,
					text: 'Visit Richmond Area RC and learn more about the club field, aircraft, and member events.',
					url: window.location.href
				};

				if ( navigator.share ) {
					navigator.share( shareData ).then( function () {
						if ( note ) note.textContent = 'Share sheet opened.';
					} ).catch( function () {
						if ( note ) note.textContent = 'Sharing was canceled.';
					} );
					return;
				}

				if ( navigator.clipboard ) {
					navigator.clipboard.writeText( window.location.href ).then( function () {
						if ( note ) note.textContent = 'Link copied to clipboard.';
					} );
					return;
				}

				if ( note ) note.textContent = 'Copy the page URL from your browser to share it.';
			} );
		} );
	}

	document.addEventListener( 'DOMContentLoaded', function () {
		document.querySelectorAll( '.wp-block-rarc-hero-carousel' ).forEach( initHero );
		document.querySelectorAll( '.wp-block-rarc-carousel' ).forEach( initCarousel );
		initShareButtons();
	} );
}() );

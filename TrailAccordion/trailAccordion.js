(function($){
	$.fn.trailAccordion = function(options = null){
		const T_ACCORDION_ACTIVE = "trail-accordion--active";
		const T_ACCORDION_HEADER = ".trail-accordion-header";
		const T_ACCORDION_BODY = ".trail-accordion-body";

		const domSetup = {
			_this: this,
			htmlBody: $("body, html"),
			accordionHeaders: this.find(T_ACCORDION_HEADER),
			activeAccordionItem: null,
			activeAccordionItemPosition: null,
			activeAccordionItemContentHeight: null,
			activeAccordionItemHeaderHeight: null,
			queuedAccordionItemPosition: null,
			scrollToTarget: null
		};

		// VALIDATE OPTIONS
		const accordionOptions = {
			animated: typeof options.animated === "boolean" ? options.animated : true,
			aniSpeed: typeof options.aniSpeed === "number" ? options.aniSpeed : 300,
			trailToSelection: typeof options.trailToSelection === "boolean" ? options.trailToSelection : true,
			multiExpanded: typeof options.multiExpanded === "boolean" ? options.multiExpanded : false,
			active: typeof options.active === "number" && options.active <= domSetup.accordionHeaders.length ? options.active : null,
		};

		if (!accordionOptions.animated) {
			accordionOptions.aniSpeed = 0;
		}

		function getActiveAccItemHeight(_this) {
			domSetup.queuedAccordionItemPosition = Math.floor(_this.offsetTop);
			if (accordionOptions.multiExpanded) return;

			domSetup.activeAccordionItem = domSetup._this.find(`.${T_ACCORDION_ACTIVE}`);

			if (domSetup.activeAccordionItem.length === 0) {
				domSetup.activeAccordionItemPosition = domSetup.queuedAccordionItemPosition;
				return;
			}

			domSetup.activeAccordionItemPosition = domSetup.activeAccordionItem.offset().top;
			domSetup.activeAccordionItemHeaderHeight = domSetup.activeAccordionItem.children(T_ACCORDION_HEADER).outerHeight();
			domSetup.activeAccordionItemContentHeight = Math.floor(
				domSetup.activeAccordionItem.outerHeight() - domSetup.activeAccordionItemHeaderHeight + (domSetup.activeAccordionItemHeaderHeight / 2)
			);
		}

		function setScrollPosition() {
			if (!accordionOptions.trailToSelection) return; // check if trailing is enabled
			if (accordionOptions.multiExpanded) {
				domSetup.scrollToTarget = domSetup.queuedAccordionItemPosition;
				return;
			}

			if (domSetup.queuedAccordionItemPosition > domSetup.activeAccordionItemPosition) {
				domSetup.scrollToTarget = domSetup.queuedAccordionItemPosition - domSetup.activeAccordionItemContentHeight;
				return;
			}
			domSetup.scrollToTarget = domSetup.queuedAccordionItemPosition;
		}

		function toggle(_this) {
			// _this.parent().hasClass(T_ACCORDION_ACTIVE) ? close(_this) : open(_this);
			_this
				.parent()
				.toggleClass(T_ACCORDION_ACTIVE)
				.find(T_ACCORDION_BODY)
				.slideToggle(accordionOptions.aniSpeed);
			
			if (accordionOptions.active !== null) accordionOptions.active = null; //reset active acc item
			if (accordionOptions.multiExpanded) return;

			if (domSetup.activeAccordionItem !== null && domSetup.activeAccordionItem.length !== 0) {
				domSetup.activeAccordionItem
					.removeClass(T_ACCORDION_ACTIVE)
					.children(T_ACCORDION_BODY)
					.slideUp(accordionOptions.aniSpeed);
			}
		}

		function scrollScreenToPosition() {
			accordionOptions.trailToSelection &&
			domSetup.htmlBody.animate({
				scrollTop: domSetup.scrollToTarget
			}, accordionOptions.aniSpeed);
		}

		domSetup.accordionHeaders.on("click", function(){
			// CALCUALTE POSITION, PROPORTIONS AND OFFSETS
			getActiveAccItemHeight(this);
			setScrollPosition();
			toggle($(this));
			scrollScreenToPosition(); // Set screen at top of opened item
		});

		// Open acc item if active is valid
		if (accordionOptions.active !== null) toggle($(domSetup.accordionHeaders[accordionOptions.active]));

		return this;
	}
}(jQuery));
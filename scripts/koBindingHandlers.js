// ---------------------  CUSTOM KO BINDING HANDLERS -------------------------------

/* Syncs innerHTML property of the element with observable. */
ko.bindingHandlers.innerHTML = {
    init: function (element, valueAccessor) {
        $(element).on('keyup', function () {
            var value = valueAccessor();
            value(this.innerHTML);
        });
    },
    update: function (element, valueAccessor) {
        var value = ko.utils.unwrapObservable(valueAccessor());
        if (element.innerHTML != value) {
            element.innerHTML = value;
        }
    }
};

/**
 * Manages visibility of element with animated slide effect.
 * Shows element by sliding from outside the screen to target position,
 * hides element by sliding from target position to outside the screen.
 * Note: target position here is default position of the element (position:static).
 * Binding properties:
 *  @slideShow      - true to show, false to hide.
 *  @slideDirection - 'stay'  - just set visibility without animation,
 *                    'left'  - move from right to left,
 *                    'right' - vise versa,
 *                    'up'    - move upwards,
 *                    'down'  - move downwards.
 *  @slideDuration  - duration of animation.
 *  @slideDelay     - delay before running animation.
 */
ko.bindingHandlers.slideShow = {
    update: function (element, valueAccessor, allBindings) {
        var makeVisible = ko.utils.unwrapObservable(valueAccessor());

        // Setup slide properties.
        var direction = allBindings.get('slideDirection');
        var duration = allBindings.get('slideDuration') || 500;
        var method = "swing";
        var delay = allBindings.get('slideDelay') || 0;

        var slideFunc = function () {
            // Show or hide element by sliding if we know direction,
            // otherwise just set visibility.
            if (!direction || direction == 'stay') {
                $(element).toggle(makeVisible);
            }
            else {
                // Before getting target position
                // make sure element is visible.
                if (!$(element).is(":visible")) {
                    element.style.display = '';
                }

                // Make sure element was not displaced
                // by previous animation.
                if ($(element).is(":animated")) {
                    $(element).stop();
                    $(element).css({position: '', top: '', left: ''});
                    defaultPosition = element.getBoundingClientRect();
                }
                else {
                    var defaultPosition = element.getBoundingClientRect();
                }

                var size = {width: $(element).width(), height: $(element).height(),
                    outerWidth: $(element).outerWidth(), outerHeight: $(element).outerHeight()};

                if (makeVisible) {                                               // Show
                    var startPosition = {};
                    switch (direction) {
                        case 'left':
                            startPosition.left = $(window).width() + size.outerWidth;
                            startPosition.top = defaultPosition.top;
                            break;
                        case 'right':
                            startPosition.left = -(size.outerWidth);
                            startPosition.top = defaultPosition.top;
                            break;
                        case 'up':
                            startPosition.top = $(window).height() + size.outerHeight;
                            startPosition.left = defaultPosition.left;
                            break;
                        case 'down':
                            startPosition.top = -(size.outerHeight);
                            startPosition.left = defaultPosition.left;
                            break;
                        default:
                            throw Error('Unknown slide direction');
                    }

                    // Detach element, preserving position and size proportions.
                    $(element).css({position: 'fixed', top: startPosition.top, left: startPosition.left,
                        width: size.width, height: size.height});
                    $(element).show();
                    $(element).animate({left: defaultPosition.left, top: defaultPosition.top},
                        duration,
                        method,
                        function () {
                            // Attach element back.
                            $(element).css({position: '', top: '', left: '', width: '', height: '' });
                        });
                }
                else {                                                         // Hide
                    var targetPositionOutside = {};
                    switch (direction) {
                        case 'left':
                            targetPositionOutside.left = -(size.outerWidth);
                            targetPositionOutside.top = defaultPosition.top;
                            break;
                        case 'right':
                            targetPositionOutside.left = $(window).width() + size.outerWidth;
                            targetPositionOutside.top = defaultPosition.top;
                            break;
                        case 'up':
                            targetPositionOutside.top = -(size.outerHeight);
                            targetPositionOutside.left = defaultPosition.left;
                            break;
                        case 'down':
                            targetPositionOutside.top = $(window).height() + size.outerHeight;
                            targetPositionOutside.left = defaultPosition.left;
                            break;
                        default:
                            throw Error('Unknown slide direction');
                    }

                    $(element).css({position: 'fixed', top: defaultPosition.top, left: defaultPosition.left,
                        width: size.width, height: size.height});
                    $(element).animate({left: targetPositionOutside.left, top: targetPositionOutside.top},
                        duration,
                        method,
                        function () {
                            $(element).hide();
                            $(element).css({position: '', top: '', left: '', width: '', height: '' });
                        });
                }
            }
        };

        setTimeout(slideFunc, delay);
    }
};

/**
 * Adds certain class to the element with animation effect.
 * Binding properties:
 *  @addClassName - name of CSS class to add.
 *  @addClassDuration - duration of animation.
 */
ko.bindingHandlers.addClass = {
    update: function (element, valueAccessor, allBindings) {
        var addClass = ko.utils.unwrapObservable(valueAccessor());

        var className = allBindings.get('addClassName');
        var duration = allBindings.get('addClassDuration');

        if (addClass) {
            $(element).addClass(className, duration);
        }
        else {
            $(element).removeClass(className, duration);
        }
    }
};

/**
 *  Registers hotkey on the element.
 *  Binding properties: array of objects with hotkey properties each.
 *  Hotkey properties contain:
 *  @key - key combination to use in binding (eg. 'Ctrl+N', 'left', 'Esc')
 *         see http://htmlpreview.github.io/?https://github.com/jeresig/jquery.hotkeys/master/test-static-05.html
 *  @context - 'this' context for function to call
 *             (TODO: For now, I did not found a way to make it without explicitly passed context.
 *                   But I'm sure it's possible since KO can do that!
 *                   Update: http://stackoverflow.com/questions/18759289/how-to-access-parent-or-root-viewmodels-from-within-custom-binding-in-durandal-k)
 *  @fn - function to call on keydown
 * */
ko.bindingHandlers.hotkeys = {
    init: function (element, valueAccessor) {
        var hotkeys = valueAccessor();

        $.each(hotkeys, function (index, properties) {
            $(element).bind("keydown", properties.key, $.throttle(function (e) {
                e.preventDefault();
                properties.fn.apply(properties.context);
                return false;
            }, 250));
        });
    }
};

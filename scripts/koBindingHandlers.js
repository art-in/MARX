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

/** Manages visibility of element with animated slide effect.
 *  Shows element by sliding from outside the screen to target position,
 *  hides element by sliding from target position to outside the screen.
 *  Binding properties:
 *   @slideShow - true to show, false to hide.
 *   @slideTargetPosition - id of element which top-left corner will indicate
 *                          target position for sliding when showing.
 *   @slideDirection - > 0 to move from right to left, < 0 - vise versa,
 *                     = 0 - just set visibility without animation.
 */
ko.bindingHandlers.slideShow = {
    update: function (element, valueAccessor, allBindings) {
        var makeVisible = ko.utils.unwrapObservable(valueAccessor());

        // Do not do anything if element already is in desirable visibility state.
        var currentlyVisible = $(element).is(":visible");
        if (currentlyVisible == makeVisible) {
            return;
        }

        // Setup slide properties.
        var targetPositionElement = allBindings.get('slideTargetPosition');
        if (!targetPositionElement) {
            throw Error("Target position not specified");
        }
        var slideDirection = allBindings.get('slideDirection');

        var targetPosition = targetPositionElement.getBoundingClientRect();
        var elementWidth = $(element).outerWidth();
        var duration = 500;
        var method = "swing";

        // Show or hide element by sliding if we know direction,
        // otherwise just set visibility.
        if (slideDirection == 0) {
            if (makeVisible) {
                $(element).css({top: targetPosition.top, left: targetPosition.left});
            }

            $(element).toggle(makeVisible);
        }
        else {
            if (makeVisible) {                        // Show
                var startPosition =
                { top: targetPosition.top,
                    left: slideDirection > 0
                        ? $(window).width() + elementWidth // start from right side.
                        : -(elementWidth)                  // .. or from left side.
                };

                $(element).css({top: startPosition.top, left: startPosition.left });
                $(element).show();
                $(element).animate({left: targetPosition.left}, duration, method)
            }
            else {                                    // Hide
                startPosition =
                { left: slideDirection > 0
                    ? -(elementWidth)
                    : $(window).width() + elementWidth
                };

                $(element).animate({left: startPosition.left}, duration, method,
                    function () {
                        $(element).hide()
                    });
            }
        }
    }
};

/** Registers hotkey on the element.
 *  Binding properties: array of objects with hotkey properties each.
 *  Hotkey properties contain:
 *  @key - key combination to use in binding (eg. 'Ctrl+N', 'left', 'Esc')
 *         see http://htmlpreview.github.io/?https://github.com/jeresig/jquery.hotkeys/master/test-static-05.html
 *  @context - 'this' context for function to call
 *             (TBD: For now, I did not found a way to make it without explicitly passed context.
 *                   But I'm sure it's possible since KO can do that!)
 *  @fn - function to call on keydown
 * */
ko.bindingHandlers.hotkeys = {
    init: function (element, valueAccessor) {
        var hotkeys = valueAccessor();

        $.each(hotkeys, function (index, properties) {
            $(element).bind("keydown", properties.key, function () {
                properties.fn.apply(properties.context);
            })
        });
    }
};
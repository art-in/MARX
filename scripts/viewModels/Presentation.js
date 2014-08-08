var Presentation = function () {
    var self = this;

    // Indicates that presentation was rendered.
    // I.e. passed initial stage of adding to the DOM and KO binding.
    // Necessary because we do not need to do some actions
    // when presentation was just opened (e.g. slide out edit elements).
    this.WasRendered = false;

    this.Slides = ko.observableArray([]);

    this.InEditMode = ko.observable();

    // Duration of animation for sliding effect.
    this.SlideDuration = 500;

    // Duration of animation for mode switching.
    this.ModeSwitchDuration = 250;

    this.SetSlidesRendered = function () {
        $.each(self.Slides(), function (index, slide) {
            slide.WasRendered = true;
        })
    };

    // Toggles Presentation/Edit mode.
    this.ToggleMode = function (obj, event, isEditMode) {
        self.InEditMode(typeof isEditMode != 'undefined' ? isEditMode : !self.InEditMode());
    };

    // Focused slide.
    this.CurrentSlide = ko.observable();

    this.PreviousSlideIndex = ko.observable();
    this.CurrentSlideIndex = ko.observable();

    // Remember current slide index before setting new one.
    this.CurrentSlide.subscribe(function (oldSlide) {
        if (!oldSlide) {
            // If there were not any slide before (i.e. initial load),
            // just empty the index, so we will equal it to new index later.
            self.PreviousSlideIndex(null);
        }
        else {
            var oldSlideIndex = self.Slides().indexOf(oldSlide);
            self.PreviousSlideIndex(oldSlideIndex < 0 ? Number.MAX_VALUE : oldSlideIndex);
        }
    }, null, "beforeChange");

    // Set index of current slide.
    this.CurrentSlide.subscribe(function (currentSlide) {
        var currentIndex = self.Slides().indexOf(currentSlide);
        self.CurrentSlideIndex(currentIndex);

        if (self.PreviousSlideIndex() == null) {
            self.PreviousSlideIndex(currentIndex)
        }
    }, null, "change");

    // Current slide position: current index / total number of slides.
    this.CurrentSlideNumberStatus = ko.computed(function () {
        var currentNumber = self.Slides().indexOf(self.CurrentSlide()) + 1;
        var totalNumber = self.Slides().length;
        return currentNumber + " / " + totalNumber;
    });

    this.AddNewSlide = function () {
        if (self.WasRendered && !self.InEditMode())
        {
            // Do not allow adding slides
            // in presentation mode.
            return;
        }

        var newSlide = new Slide();
        this.Slides.push(newSlide);
        this.CurrentSlide(newSlide);
    };

    this.RemoveCurrentSlide = function () {
        if (this.Slides().length == 1) {
            return;
        }

        var currentIndex = this.Slides.indexOf(this.CurrentSlide());
        this.Slides.splice(currentIndex, 1);

        // Go to previous slide.
        currentIndex = --currentIndex >= 0 ? currentIndex : 0;
        this.CurrentSlide(this.Slides()[currentIndex]);
    };

    this.GoToPreviousSlide = function () {
        var currentIndex = this.Slides.indexOf(this.CurrentSlide());
        if (currentIndex > 0) {
            this.CurrentSlide(this.Slides()[currentIndex - 1]);
        }
    };

    this.GoToNextSlide = function () {
        var currentIndex = this.Slides.indexOf(this.CurrentSlide());
        if (currentIndex < this.Slides().length - 1) {
            this.CurrentSlide(this.Slides()[currentIndex + 1]);
        }
    };

    // Indicates that presentation was edited.
    this.WasChanged = ko.computed(function () {
        var changedSlides = $.grep(self.Slides(), function (slide) {
            return slide.WasChanged();
        });

        return self.Slides().length > 1 || changedSlides.length > 0;
    })
};
var Presentation = function () {
    var self = this;

    this.Slides = ko.observableArray([]);

    this.CurrentSlide = ko.observable();

    this.CurrentSlideNumber = ko.computed(function () {
        var currentNumber = self.Slides().indexOf(self.CurrentSlide()) + 1;
        var totalNumber = self.Slides().length;
        return currentNumber + " / " + totalNumber;
    });

    this.AddNewSlide = function () {
        var newSlide = new Slide("new slide");
        this.Slides.push(newSlide);
        this.CurrentSlide(newSlide);
    }

    this.RemoveCurrentSlide = function () {
        if (this.Slides().length == 1) {
            return;
        }

        var currentIndex = this.Slides.indexOf(this.CurrentSlide());
        this.Slides.splice(currentIndex, 1);

        var currentIndex = --currentIndex >= 0 ? currentIndex : 0;
        this.CurrentSlide(this.Slides()[currentIndex]);
    }

    this.GoToPreviousSlide = function () {
        var currentIndex = this.Slides.indexOf(this.CurrentSlide());
        if (currentIndex > 0) {
            this.CurrentSlide(this.Slides()[currentIndex - 1]);
        }
    }

    this.GoToNextSlide = function () {
        var currentIndex = this.Slides.indexOf(this.CurrentSlide());
        if (currentIndex < this.Slides().length - 1) {
            this.CurrentSlide(this.Slides()[currentIndex + 1]);
        }
    }
}
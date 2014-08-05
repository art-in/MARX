// ---------------------  CONSTANTS  -------------------------------------------
var SLIDES_PANEL_ID = "pnlSlides";
var SLIDE_PANEL_CLASS = "slide";
var SLIDE_DEFINITION_CLASS = "slide-definition";
// ---------------------  INIT  ------------------------------------------------
window.onload = function () {
    var presentation = new Presentation();
    var presentationElement = $("#"+SLIDES_PANEL_ID);

    // Check if presentation already has slides.
    var hasSlides = presentationElement.find("."+SLIDE_PANEL_CLASS).length > 0;

    if (hasSlides) {
        // Create slide view-models to sync with the view.
        var slideNodes = presentationElement.find("."+SLIDE_PANEL_CLASS);
        var slides = [];
        $.each(slideNodes, function(index, node) {
            var definitionNode = $(node).find("."+SLIDE_DEFINITION_CLASS)[0];
            var slide = new Slide(definitionNode.innerHTML);
            slides.push(slide)
        });
        presentation.Slides(slides);
        presentation.CurrentSlide(slides[0]);
    }
    else {
        // Create initial slide.
        var slide = new Slide("first slide");
        presentation.Slides.push(slide);
        presentation.CurrentSlide(slide);
    }

    ko.applyBindings(presentation);
};